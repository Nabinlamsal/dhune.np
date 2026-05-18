package service

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	catalogRepo "github.com/Nabinlamsal/dhune.np/internal/catalog/repository"
	"github.com/Nabinlamsal/dhune.np/internal/config"
	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/orders/repository"
	paymentRepo "github.com/Nabinlamsal/dhune.np/internal/payments/repository"
	"github.com/google/uuid"
)

type PaymentService struct {
	repo         paymentRepo.PaymentRepository
	orderRepo    repository.OrderRepository
	settingsRepo catalogRepo.SettingsRepository
	db           *sql.DB
	httpClient   *http.Client
}

func NewPaymentService(repo paymentRepo.PaymentRepository, orderRepo repository.OrderRepository, settingsRepo catalogRepo.SettingsRepository, database *sql.DB) *PaymentService {
	return &PaymentService{
		repo:         repo,
		orderRepo:    orderRepo,
		settingsRepo: settingsRepo,
		db:           database,
		httpClient:   &http.Client{},
	}
}

type PaymentURLResponse struct {
	PaymentURL string `json:"payment_url"`
}

type KhaltiInitiateResponse struct {
	Pidx       string `json:"pidx"`
	PaymentURL string `json:"payment_url"`
	ExpiresAt  string `json:"expires_at"`
	ExpiresIn  int    `json:"expires_in"`
}

type KhaltiLookupResponse struct {
	Pidx          string `json:"pidx"`
	TotalAmount   int    `json:"total_amount"`
	Status        string `json:"status"`
	TransactionID string `json:"transaction_id"`
}

type EsewaSuccessData struct {
	TransactionCode  string `json:"transaction_code"`
	Status           string `json:"status"`
	TotalAmount      string `json:"total_amount"`
	TransactionUUID  string `json:"transaction_uuid"`
	ProductCode      string `json:"product_code"`
	Signature        string `json:"signature"`
	SignedFieldNames string `json:"signed_field_names"`
}

type EsewaStatusResponse struct {
	ProductCode     string `json:"product_code"`
	TransactionUUID string `json:"transaction_uuid"`
	TotalAmount     string `json:"total_amount"`
	Status          string `json:"status"`
	RefID           string `json:"ref_id"`
}

func backendURL() string {
	backendURL := strings.TrimRight(config.AppConfig.BackendURL, "/")
	if backendURL == "" {
		backendURL = strings.TrimRight(config.AppConfig.PublicBackendURL, "/")
	}
	if backendURL == "" {
		backendURL = strings.TrimRight(config.AppConfig.WebsiteURL, "/")
	}
	if backendURL == "" {
		backendURL = "http://localhost:" + config.AppConfig.ServerPort
	}
	return backendURL
}

func websiteURL() string {
	websiteURL := strings.TrimRight(config.AppConfig.WebsiteURL, "/")
	if websiteURL == "" {
		websiteURL = "https://dhune.np"
	}
	return websiteURL
}

func khaltiPaymentURL() string {
	if configured := strings.TrimSpace(config.AppConfig.KhaltiPaymentURL); configured != "" {
		return configured
	}
	return "https://dev.khalti.com/api/v2/epayment/initiate/"
}

func khaltiVerificationURL() string {
	if configured := strings.TrimSpace(config.AppConfig.KhaltiVerificationURL); configured != "" {
		return configured
	}
	return "https://dev.khalti.com/api/v2/epayment/lookup/"
}

func esewaGatewayURL() string {
	return strings.TrimSpace(config.AppConfig.EsewaGatewayURL)
}

func esewaStatusURL() string {
	gatewayURL := esewaGatewayURL()
	if gatewayURL == "" {
		return ""
	}
	if strings.Contains(gatewayURL, "epay/main") {
		return strings.Replace(gatewayURL, "epay/main", "api/epay/transaction/status/", 1)
	}
	return strings.TrimRight(gatewayURL, "/") + "/api/epay/transaction/status/"
}

func orderKhaltiCallbackURL() string {
	return backendURL() + "/payments/orders/khalti/callback"
}

func commissionKhaltiCallbackURL() string {
	return backendURL() + "/payments/commissions/khalti/callback"
}

func orderEsewaSuccessURL() string {
	return backendURL() + "/payments/orders/esewa/callback"
}

func commissionEsewaSuccessURL() string {
	return backendURL() + "/payments/commissions/esewa/callback"
}

func esewaFailureURL() string {
	return backendURL() + "/payments/esewa/failure"
}

func signEsewa(totalAmount, transactionUUID, productCode string) string {
	message := fmt.Sprintf("total_amount=%s,transaction_uuid=%s,product_code=%s", totalAmount, transactionUUID, productCode)
	mac := hmac.New(sha256.New, []byte(config.AppConfig.EsewaSecretKey))
	mac.Write([]byte(message))
	return base64.StdEncoding.EncodeToString(mac.Sum(nil))
}

func parseMoney(value string) (float64, error) {
	return strconv.ParseFloat(strings.ReplaceAll(strings.TrimSpace(value), ",", ""), 64)
}

func money(value float64) string {
	return fmt.Sprintf("%.2f", value)
}

func (s *PaymentService) PayCash(ctx context.Context, orderID, vendorID uuid.UUID) (*db.Payment, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	qtx := db.New(tx)
	repoTx := s.repo.WithTx(qtx)
	order, err := s.orderRepo.WithTx(qtx).GetByID(ctx, orderID)
	if err != nil {
		return nil, fmt.Errorf("order not found: %w", err)
	}
	if order.VendorID != vendorID {
		return nil, fmt.Errorf("only the vendor can mark cash received for this order")
	}
	if order.PaymentStatus == db.PaymentStatusPAID {
		existing, existingErr := repoTx.GetPaymentByOrderID(ctx, orderID)
		if existingErr == nil {
			return &existing, nil
		}
		return nil, fmt.Errorf("order is already paid")
	}

	payment, err := repoTx.CreatePayment(ctx, db.CreatePaymentParams{
		PaymentType:   db.PaymentRecordTypeORDERPAYMENT,
		OrderID:       uuid.NullUUID{UUID: order.ID, Valid: true},
		PayerID:       order.UserID,
		VendorID:      order.VendorID,
		Amount:        order.FinalPrice,
		PaymentMethod: db.PaymentMethodTypeCASH,
		PaymentStatus: db.PaymentStatusPAID,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create cash payment: %w", err)
	}
	if err := s.finalizeOrderPaymentTx(ctx, qtx, repoTx, payment); err != nil {
		return nil, err
	}
	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return &payment, nil
}

func (s *PaymentService) InitiateOrderPaymentURL(ctx context.Context, userID, orderID uuid.UUID, method db.PaymentMethodType) (*PaymentURLResponse, error) {
	switch method {
	case db.PaymentMethodTypeKHALTI:
		resp, err := s.initiateOrderKhalti(ctx, userID, orderID)
		if err != nil {
			return nil, err
		}
		return &PaymentURLResponse{PaymentURL: resp.PaymentURL}, nil
	case db.PaymentMethodTypeESEWA:
		return &PaymentURLResponse{PaymentURL: s.backendPaymentURL("orders", "esewa", orderID)}, nil
	default:
		return nil, fmt.Errorf("unsupported order payment method")
	}
}

func (s *PaymentService) InitiateCommissionPaymentURL(ctx context.Context, vendorID uuid.UUID, method db.PaymentMethodType) (*PaymentURLResponse, error) {
	switch method {
	case db.PaymentMethodTypeKHALTI:
		resp, err := s.initiateCommissionKhalti(ctx, vendorID)
		if err != nil {
			return nil, err
		}
		return &PaymentURLResponse{PaymentURL: resp.PaymentURL}, nil
	case db.PaymentMethodTypeESEWA:
		return &PaymentURLResponse{PaymentURL: s.backendPaymentURL("commissions", "esewa", uuid.Nil)}, nil
	default:
		return nil, fmt.Errorf("unsupported commission payment method")
	}
}

func (s *PaymentService) backendPaymentURL(flow, gateway string, orderID uuid.UUID) string {
	if flow == "orders" {
		return fmt.Sprintf("%s/payments/orders/%s/pay/%s", backendURL(), gateway, orderID.String())
	}
	return fmt.Sprintf("%s/payments/commissions/%s/pay", backendURL(), gateway)
}

func (s *PaymentService) initiateOrderKhalti(ctx context.Context, userID, orderID uuid.UUID) (*KhaltiInitiateResponse, error) {
	order, err := s.orderRepo.GetByID(ctx, orderID)
	if err != nil {
		return nil, fmt.Errorf("order not found: %w", err)
	}
	if order.UserID != userID {
		return nil, fmt.Errorf("unauthorized to pay for this order")
	}
	if order.PaymentStatus == db.PaymentStatusPAID {
		return nil, fmt.Errorf("order is already paid")
	}

	resp, err := s.createKhaltiGatewayPayment(ctx, order.FinalPrice, orderKhaltiCallbackURL(), order.ID.String(), "Dhune order "+order.ID.String())
	if err != nil {
		return nil, err
	}

	err = s.upsertOrderGatewayPayment(ctx, order, db.PaymentMethodTypeKHALTI, resp.Pidx)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *PaymentService) initiateCommissionKhalti(ctx context.Context, vendorID uuid.UUID) (*KhaltiInitiateResponse, error) {
	due, err := s.pendingCommissionDue(ctx, vendorID)
	if err != nil {
		return nil, err
	}
	if due <= 0 {
		return nil, fmt.Errorf("no commission due")
	}
	amount := money(due)
	resp, err := s.createKhaltiGatewayPayment(ctx, amount, commissionKhaltiCallbackURL(), "commission-"+vendorID.String(), "Dhune commission due")
	if err != nil {
		return nil, err
	}
	if err := s.createCommissionGatewayPayment(ctx, vendorID, amount, db.PaymentMethodTypeKHALTI, resp.Pidx); err != nil {
		return nil, err
	}
	return resp, nil
}

func (s *PaymentService) createKhaltiGatewayPayment(ctx context.Context, amount string, returnURL string, purchaseID string, purchaseName string) (*KhaltiInitiateResponse, error) {
	if strings.TrimSpace(config.AppConfig.KhaltiSecretKey) == "" {
		return nil, fmt.Errorf("khalti configuration is missing")
	}
	amountFloat, err := parseMoney(amount)
	if err != nil {
		return nil, fmt.Errorf("invalid payment amount: %w", err)
	}
	payload := map[string]interface{}{
		"return_url":          returnURL,
		"website_url":         websiteURL(),
		"amount":              int(math.Round(amountFloat * 100)),
		"purchase_order_id":   purchaseID,
		"purchase_order_name": purchaseName,
	}
	payloadBytes, _ := json.Marshal(payload)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, khaltiPaymentURL(), bytes.NewBuffer(payloadBytes))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Key "+config.AppConfig.KhaltiSecretKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to initiate khalti payment: %w", err)
	}
	defer resp.Body.Close()
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read khalti initiate response: %w", err)
	}
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		log.Printf("khalti initiate failed: status=%d body=%s", resp.StatusCode, string(bodyBytes))
		return nil, fmt.Errorf("khalti initiate failed with status %d", resp.StatusCode)
	}
	var khaltiResp KhaltiInitiateResponse
	if err := json.Unmarshal(bodyBytes, &khaltiResp); err != nil {
		return nil, fmt.Errorf("failed to decode khalti initiate response: %w", err)
	}
	if khaltiResp.PaymentURL == "" || khaltiResp.Pidx == "" {
		return nil, fmt.Errorf("khalti initiate response is missing payment URL")
	}
	return &khaltiResp, nil
}

func (s *PaymentService) upsertOrderGatewayPayment(ctx context.Context, order db.Order, method db.PaymentMethodType, gatewayRef string) error {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	repoTx := s.repo.WithTx(db.New(tx))
	existing, err := repoTx.GetPaymentByOrderID(ctx, order.ID)
	if err == nil {
		if existing.PaymentStatus == db.PaymentStatusPAID {
			return fmt.Errorf("order is already paid")
		}
		_, err = repoTx.PrepareGatewayPayment(ctx, db.PrepareGatewayPaymentParams{
			ID:               existing.ID,
			Amount:           order.FinalPrice,
			PaymentMethod:    method,
			GatewayReference: sql.NullString{String: gatewayRef, Valid: true},
		})
	} else if err == sql.ErrNoRows {
		_, err = repoTx.CreatePayment(ctx, db.CreatePaymentParams{
			PaymentType:      db.PaymentRecordTypeORDERPAYMENT,
			OrderID:          uuid.NullUUID{UUID: order.ID, Valid: true},
			PayerID:          order.UserID,
			VendorID:         order.VendorID,
			Amount:           order.FinalPrice,
			PaymentMethod:    method,
			PaymentStatus:    db.PaymentStatusUNPAID,
			GatewayReference: sql.NullString{String: gatewayRef, Valid: true},
		})
	}
	if err != nil {
		return fmt.Errorf("failed to store gateway payment: %w", err)
	}
	return tx.Commit()
}

func (s *PaymentService) createCommissionGatewayPayment(ctx context.Context, vendorID uuid.UUID, amount string, method db.PaymentMethodType, gatewayRef string) error {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	repoTx := s.repo.WithTx(db.New(tx))
	_, err = repoTx.CreatePayment(ctx, db.CreatePaymentParams{
		PaymentType:      db.PaymentRecordTypeCOMMISSIONPAYMENT,
		OrderID:          uuid.NullUUID{},
		PayerID:          vendorID,
		VendorID:         vendorID,
		Amount:           amount,
		PaymentMethod:    method,
		PaymentStatus:    db.PaymentStatusUNPAID,
		GatewayReference: sql.NullString{String: gatewayRef, Valid: true},
	})
	if err != nil {
		return fmt.Errorf("failed to store commission payment: %w", err)
	}
	return tx.Commit()
}

func (s *PaymentService) RenderOrderEsewa(ctx context.Context, userID, orderID uuid.UUID) (string, map[string]string, error) {
	order, err := s.orderRepo.GetByID(ctx, orderID)
	if err != nil {
		return "", nil, fmt.Errorf("order not found: %w", err)
	}
	if order.UserID != userID {
		return "", nil, fmt.Errorf("unauthorized to pay for this order")
	}
	if order.PaymentStatus == db.PaymentStatusPAID {
		return "", nil, fmt.Errorf("order is already paid")
	}
	transactionUUID := uuid.NewString()
	if err := s.upsertOrderGatewayPayment(ctx, order, db.PaymentMethodTypeESEWA, transactionUUID); err != nil {
		return "", nil, err
	}
	return s.esewaForm(order.FinalPrice, transactionUUID, orderEsewaSuccessURL())
}

func (s *PaymentService) RenderCommissionEsewa(ctx context.Context, vendorID uuid.UUID) (string, map[string]string, error) {
	due, err := s.pendingCommissionDue(ctx, vendorID)
	if err != nil {
		return "", nil, err
	}
	if due <= 0 {
		return "", nil, fmt.Errorf("no commission due")
	}
	amount := money(due)
	transactionUUID := uuid.NewString()
	if err := s.createCommissionGatewayPayment(ctx, vendorID, amount, db.PaymentMethodTypeESEWA, transactionUUID); err != nil {
		return "", nil, err
	}
	return s.esewaForm(amount, transactionUUID, commissionEsewaSuccessURL())
}

func (s *PaymentService) esewaForm(totalAmount, transactionUUID, successURL string) (string, map[string]string, error) {
	if strings.TrimSpace(config.AppConfig.EsewaProductCode) == "" || strings.TrimSpace(config.AppConfig.EsewaSecretKey) == "" || esewaGatewayURL() == "" {
		return "", nil, fmt.Errorf("esewa configuration is missing")
	}
	productCode := strings.TrimSpace(config.AppConfig.EsewaProductCode)
	fields := map[string]string{
		"amount":                  totalAmount,
		"tax_amount":              "0",
		"total_amount":            totalAmount,
		"transaction_uuid":        transactionUUID,
		"product_code":            productCode,
		"product_service_charge":  "0",
		"product_delivery_charge": "0",
		"success_url":             successURL,
		"failure_url":             esewaFailureURL(),
		"signed_field_names":      "total_amount,transaction_uuid,product_code",
		"signature":               signEsewa(totalAmount, transactionUUID, productCode),
	}
	return esewaGatewayURL(), fields, nil
}

func (s *PaymentService) VerifyKhaltiCallback(ctx context.Context, pidx string, expectedType db.PaymentRecordType) (*db.Payment, error) {
	payment, err := s.repo.GetPaymentByGatewayReference(ctx, &pidx)
	if err != nil {
		return nil, fmt.Errorf("local payment record not found")
	}
	if payment.PaymentType != expectedType {
		return nil, fmt.Errorf("payment type mismatch")
	}
	if payment.PaymentStatus == db.PaymentStatusPAID {
		return s.ensurePaidPaymentFinalized(ctx, payment)
	}
	lookup, err := s.lookupKhalti(ctx, pidx)
	if err != nil {
		return nil, err
	}
	expected, _ := parseMoney(payment.Amount)
	if lookup.TotalAmount != int(math.Round(expected*100)) {
		return nil, fmt.Errorf("verified amount does not match payment amount")
	}
	return s.finalizeVerifiedPayment(ctx, payment, sql.NullString{String: lookup.Pidx, Valid: true})
}

func (s *PaymentService) lookupKhalti(ctx context.Context, pidx string) (*KhaltiLookupResponse, error) {
	payloadBytes, _ := json.Marshal(map[string]string{"pidx": pidx})
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, khaltiVerificationURL(), bytes.NewBuffer(payloadBytes))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Key "+config.AppConfig.KhaltiSecretKey)
	req.Header.Set("Content-Type", "application/json")
	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to verify khalti payment: %w", err)
	}
	defer resp.Body.Close()
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read khalti lookup response: %w", err)
	}
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		log.Printf("khalti lookup failed: status=%d body=%s", resp.StatusCode, string(bodyBytes))
		return nil, fmt.Errorf("khalti lookup failed with status %d", resp.StatusCode)
	}
	var lookup KhaltiLookupResponse
	if err := json.Unmarshal(bodyBytes, &lookup); err != nil {
		return nil, fmt.Errorf("failed to decode khalti lookup response: %w", err)
	}
	if !strings.EqualFold(lookup.Status, "Completed") {
		return nil, fmt.Errorf("payment not completed on khalti")
	}
	return &lookup, nil
}

func (s *PaymentService) VerifyEsewa(ctx context.Context, data EsewaSuccessData, expectedType db.PaymentRecordType) (*db.Payment, error) {
	if data.TransactionUUID == "" {
		return nil, fmt.Errorf("missing esewa transaction_uuid")
	}
	payment, err := s.repo.GetPaymentByGatewayReference(ctx, &data.TransactionUUID)
	if err != nil {
		return nil, fmt.Errorf("local payment record not found")
	}
	if payment.PaymentType != expectedType {
		return nil, fmt.Errorf("payment type mismatch")
	}
	if payment.PaymentStatus == db.PaymentStatusPAID {
		return s.ensurePaidPaymentFinalized(ctx, payment)
	}
	expected, _ := parseMoney(payment.Amount)
	actual, err := parseMoney(data.TotalAmount)
	if err != nil || math.Abs(actual-expected) > 0.009 {
		return nil, fmt.Errorf("verified amount does not match payment amount")
	}
	statusResp, err := s.lookupEsewaStatus(ctx, money(actual), data.TransactionUUID)
	if err != nil {
		return nil, err
	}
	if !strings.EqualFold(statusResp.Status, "COMPLETE") && !strings.EqualFold(statusResp.Status, "COMPLETED") {
		return nil, fmt.Errorf("payment not completed on esewa")
	}
	return s.finalizeVerifiedPayment(ctx, payment, sql.NullString{String: data.TransactionUUID, Valid: true})
}

func (s *PaymentService) finalizeVerifiedPayment(ctx context.Context, payment db.Payment, gatewayRef sql.NullString) (*db.Payment, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	qtx := db.New(tx)
	repoTx := s.repo.WithTx(qtx)
	current, err := repoTx.GetPaymentByID(ctx, payment.ID)
	if err != nil {
		return nil, fmt.Errorf("payment not found: %w", err)
	}
	if current.PaymentStatus == db.PaymentStatusPAID {
		finalized, err := s.finalizePaidPaymentTx(ctx, qtx, repoTx, current)
		if err != nil {
			return nil, err
		}
		if err := tx.Commit(); err != nil {
			return nil, err
		}
		return finalized, nil
	}
	updated, err := repoTx.UpdatePaymentStatus(ctx, db.UpdatePaymentStatusParams{
		ID:               current.ID,
		PaymentStatus:    db.PaymentStatusPAID,
		GatewayReference: gatewayRef,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to update payment status: %w", err)
	}
	if err := s.applyPaidPaymentSideEffectsTx(ctx, qtx, repoTx, updated); err != nil {
		return nil, err
	}
	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return &updated, nil
}

func (s *PaymentService) ensurePaidPaymentFinalized(ctx context.Context, payment db.Payment) (*db.Payment, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	qtx := db.New(tx)
	repoTx := s.repo.WithTx(qtx)
	current, err := repoTx.GetPaymentByID(ctx, payment.ID)
	if err != nil {
		return nil, fmt.Errorf("payment not found: %w", err)
	}
	if current.PaymentStatus != db.PaymentStatusPAID {
		return nil, fmt.Errorf("payment is not paid")
	}
	finalized, err := s.finalizePaidPaymentTx(ctx, qtx, repoTx, current)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return finalized, nil
}

func (s *PaymentService) finalizePaidPaymentTx(ctx context.Context, qtx *db.Queries, repoTx paymentRepo.PaymentRepository, payment db.Payment) (*db.Payment, error) {
	if err := s.applyPaidPaymentSideEffectsTx(ctx, qtx, repoTx, payment); err != nil {
		return nil, err
	}
	return &payment, nil
}

func (s *PaymentService) applyPaidPaymentSideEffectsTx(ctx context.Context, qtx *db.Queries, repoTx paymentRepo.PaymentRepository, payment db.Payment) error {
	switch payment.PaymentType {
	case db.PaymentRecordTypeORDERPAYMENT:
		if err := s.finalizeOrderPaymentTx(ctx, qtx, repoTx, payment); err != nil {
			return err
		}
	case db.PaymentRecordTypeCOMMISSIONPAYMENT:
		if _, err := qtx.MarkCommissionsAsPaidThrough(ctx, db.MarkCommissionsAsPaidThroughParams{
			VendorID:  payment.VendorID,
			CreatedAt: payment.CreatedAt,
		}); err != nil {
			return fmt.Errorf("failed to mark commissions paid: %w", err)
		}
	default:
		return fmt.Errorf("unsupported payment type")
	}
	return nil
}

func (s *PaymentService) finalizeOrderPaymentTx(ctx context.Context, qtx *db.Queries, repoTx paymentRepo.PaymentRepository, payment db.Payment) error {
	if !payment.OrderID.Valid {
		return fmt.Errorf("order payment is missing order id")
	}
	order, err := s.orderRepo.WithTx(qtx).GetByID(ctx, payment.OrderID.UUID)
	if err != nil {
		return fmt.Errorf("order not found: %w", err)
	}
	expected, _ := parseMoney(order.FinalPrice)
	actual, _ := parseMoney(payment.Amount)
	if math.Abs(expected-actual) > 0.009 {
		return fmt.Errorf("payment amount does not match order amount")
	}
	if _, err := repoTx.UpdateOrderPaymentStatus(ctx, db.UpdateOrderPaymentStatusParams{
		ID:            order.ID,
		PaymentStatus: db.PaymentStatusPAID,
	}); err != nil {
		return fmt.Errorf("failed to update order payment status: %w", err)
	}
	if _, err := qtx.GetCommissionByOrderID(ctx, order.ID); err == nil {
		return nil
	} else if err != sql.ErrNoRows {
		return fmt.Errorf("failed to check commission: %w", err)
	}
	settings, err := s.settingsRepo.GetPlatformSettings(ctx)
	if err != nil {
		return fmt.Errorf("failed to fetch platform settings: %w", err)
	}
	percent, err := parseMoney(settings.CommissionPercentage)
	if err != nil {
		return fmt.Errorf("invalid commission percentage")
	}
	_, err = qtx.CreateCommission(ctx, db.CreateCommissionParams{
		OrderID:           order.ID,
		VendorID:          order.VendorID,
		OrderAmount:       money(expected),
		CommissionPercent: money(percent),
		CommissionAmount:  money((expected * percent) / 100),
	})
	if err != nil {
		return fmt.Errorf("failed to create commission: %w", err)
	}
	return nil
}

func (s *PaymentService) pendingCommissionDue(ctx context.Context, vendorID uuid.UUID) (float64, error) {
	stats, err := db.New(s.db).GetVendorFinanceStats(ctx, vendorID)
	if err != nil {
		return 0, err
	}
	return parseMoney(stats.TotalPendingDue)
}

func (s *PaymentService) lookupEsewaStatus(ctx context.Context, totalAmount, transactionUUID string) (*EsewaStatusResponse, error) {
	statusURL, err := url.Parse(esewaStatusURL())
	if err != nil || statusURL.String() == "" {
		return nil, fmt.Errorf("esewa status url is not configured")
	}
	query := statusURL.Query()
	query.Set("product_code", strings.TrimSpace(config.AppConfig.EsewaProductCode))
	query.Set("total_amount", totalAmount)
	query.Set("transaction_uuid", transactionUUID)
	statusURL.RawQuery = query.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, statusURL.String(), nil)
	if err != nil {
		return nil, err
	}
	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to verify esewa payment: %w", err)
	}
	defer resp.Body.Close()
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read esewa status response: %w", err)
	}
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		log.Printf("esewa status lookup failed: status=%d body=%s", resp.StatusCode, string(bodyBytes))
		return nil, fmt.Errorf("esewa status lookup failed with status %d", resp.StatusCode)
	}
	var statusResp EsewaStatusResponse
	if err := json.Unmarshal(bodyBytes, &statusResp); err != nil {
		return nil, fmt.Errorf("failed to decode esewa status response: %w", err)
	}
	return &statusResp, nil
}
