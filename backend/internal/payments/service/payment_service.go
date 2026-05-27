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
	"github.com/Nabinlamsal/dhune.np/internal/events"
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
	return strings.TrimRight(strings.TrimSpace(firstNonEmpty(config.AppConfig.PublicBackendURL, config.AppConfig.BackendURL)), "/")
}

func requireBackendURL() (string, error) {
	publicURL := backendURL()
	if publicURL == "" {
		return "", fmt.Errorf("PUBLIC_BACKEND_URL or BACKEND_URL is required for payment callbacks")
	}
	if strings.Contains(publicURL, "localhost") || strings.Contains(publicURL, "127.0.0.1") {
		return "", fmt.Errorf("payment callback backend URL must be reachable by the gateway/mobile device, got %s", publicURL)
	}
	return publicURL, nil
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}
	return ""
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
	return strings.TrimSpace(config.AppConfig.EsewaStatusURL)
}

func orderKhaltiCallbackURL() (string, error) {
	backendURL, err := requireBackendURL()
	if err != nil {
		return "", err
	}
	return backendURL + "/payments/orders/khalti/callback", nil
}

func commissionKhaltiCallbackURL() (string, error) {
	backendURL, err := requireBackendURL()
	if err != nil {
		return "", err
	}
	return backendURL + "/payments/commissions/khalti/callback", nil
}

func orderEsewaSuccessURL() (string, error) {
	backendURL, err := requireBackendURL()
	if err != nil {
		return "", err
	}
	return backendURL + "/payments/orders/esewa/callback", nil
}

func commissionEsewaSuccessURL() (string, error) {
	backendURL, err := requireBackendURL()
	if err != nil {
		return "", err
	}
	return backendURL + "/payments/commissions/esewa/callback", nil
}

func esewaFailureURL() (string, error) {
	backendURL, err := requireBackendURL()
	if err != nil {
		return "", err
	}
	return backendURL + "/payments/esewa/failure", nil
}

func callbackURLWithRedirect(callbackURL, redirectURL string) string {
	redirectURL = strings.TrimSpace(redirectURL)
	if redirectURL == "" {
		return callbackURL
	}
	parsed, err := url.Parse(callbackURL)
	if err != nil {
		return callbackURL
	}
	query := parsed.Query()
	query.Set("redirect", redirectURL)
	parsed.RawQuery = query.Encode()
	return parsed.String()
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
			finalized, finalizeErr := s.finalizePaidPaymentTx(ctx, qtx, repoTx, existing)
			if finalizeErr != nil {
				return nil, finalizeErr
			}
			if err := tx.Commit(); err != nil {
				return nil, err
			}
			log.Printf("duplicate cash payment ignored: order_id=%s payment_id=%s", order.ID, existing.ID)
			return finalized, nil
		}
		return nil, fmt.Errorf("order is already paid")
	}

	log.Printf("cash payment received: order_id=%s vendor_id=%s", order.ID, vendorID)

	payment, err := repoTx.GetPaymentByOrderID(ctx, orderID)
	if err == nil {
		if payment.PaymentStatus == db.PaymentStatusPAID {
			finalized, finalizeErr := s.finalizePaidPaymentTx(ctx, qtx, repoTx, payment)
			if finalizeErr != nil {
				return nil, finalizeErr
			}
			if err := tx.Commit(); err != nil {
				return nil, err
			}
			log.Printf("duplicate cash payment ignored: order_id=%s payment_id=%s", order.ID, payment.ID)
			return finalized, nil
		}
		payment, err = repoTx.PrepareGatewayPayment(ctx, db.PrepareGatewayPaymentParams{
			ID:               payment.ID,
			Amount:           order.FinalPrice,
			PaymentMethod:    db.PaymentMethodTypeCASH,
			GatewayReference: sql.NullString{},
		})
		if err != nil {
			return nil, fmt.Errorf("failed to prepare cash payment: %w", err)
		}
	} else if err == sql.ErrNoRows {
		payment, err = repoTx.CreatePayment(ctx, db.CreatePaymentParams{
			PaymentType:   db.PaymentRecordTypeORDERPAYMENT,
			OrderID:       uuid.NullUUID{UUID: order.ID, Valid: true},
			PayerID:       order.UserID,
			VendorID:      order.VendorID,
			Amount:        order.FinalPrice,
			PaymentMethod: db.PaymentMethodTypeCASH,
			PaymentStatus: db.PaymentStatusUNPAID,
		})
		if err != nil {
			return nil, fmt.Errorf("failed to create cash payment: %w", err)
		}
	} else {
		return nil, fmt.Errorf("failed to check existing payment: %w", err)
	}

	payment, err = repoTx.UpdatePaymentStatus(ctx, db.UpdatePaymentStatusParams{
		ID:            payment.ID,
		PaymentStatus: db.PaymentStatusPAID,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to mark cash payment paid: %w", err)
	}
	if err := s.finalizeOrderPaymentTx(ctx, qtx, repoTx, payment); err != nil {
		return nil, err
	}
	if err := tx.Commit(); err != nil {
		return nil, err
	}
	log.Printf("cash payment finalized: order_id=%s payment_id=%s", order.ID, payment.ID)
	return &payment, nil
}

func (s *PaymentService) InitiateOrderPaymentURL(ctx context.Context, userID, orderID uuid.UUID, method db.PaymentMethodType, returnURL string) (*PaymentURLResponse, error) {
	switch method {
	case db.PaymentMethodTypeKHALTI:
		resp, err := s.initiateOrderKhalti(ctx, userID, orderID, returnURL)
		if err != nil {
			return nil, err
		}
		return &PaymentURLResponse{PaymentURL: resp.PaymentURL}, nil
	case db.PaymentMethodTypeESEWA:
		paymentURL, err := s.backendPaymentURL("orders", "esewa", orderID, returnURL)
		if err != nil {
			return nil, err
		}
		return &PaymentURLResponse{PaymentURL: paymentURL}, nil
	default:
		return nil, fmt.Errorf("unsupported order payment method")
	}
}

func (s *PaymentService) InitiateCommissionPaymentURL(ctx context.Context, vendorID uuid.UUID, method db.PaymentMethodType, returnURL string) (*PaymentURLResponse, error) {
	switch method {
	case db.PaymentMethodTypeKHALTI:
		resp, err := s.initiateCommissionKhalti(ctx, vendorID, returnURL)
		if err != nil {
			return nil, err
		}
		return &PaymentURLResponse{PaymentURL: resp.PaymentURL}, nil
	case db.PaymentMethodTypeESEWA:
		paymentURL, err := s.backendPaymentURL("commissions", "esewa", uuid.Nil, returnURL)
		if err != nil {
			return nil, err
		}
		return &PaymentURLResponse{PaymentURL: paymentURL}, nil
	default:
		return nil, fmt.Errorf("unsupported commission payment method")
	}
}

func (s *PaymentService) backendPaymentURL(flow, gateway string, orderID uuid.UUID, returnURL string) (string, error) {
	backendURL, err := requireBackendURL()
	if err != nil {
		return "", err
	}
	appendRedirect := func(rawURL string) string {
		return callbackURLWithRedirect(rawURL, returnURL)
	}
	var paymentURL string
	if flow == "orders" {
		paymentURL = appendRedirect(fmt.Sprintf("%s/payments/orders/%s/pay/%s", backendURL, gateway, orderID.String()))
	} else {
		paymentURL = appendRedirect(fmt.Sprintf("%s/payments/commissions/%s/pay", backendURL, gateway))
	}
	log.Printf("payment backend launch url generated: flow=%s gateway=%s url=%s return_url=%s", flow, gateway, paymentURL, returnURL)
	return paymentURL, nil
}

func (s *PaymentService) initiateOrderKhalti(ctx context.Context, userID, orderID uuid.UUID, returnURL string) (*KhaltiInitiateResponse, error) {
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

	callbackURL, err := orderKhaltiCallbackURL()
	if err != nil {
		return nil, err
	}
	returnCallbackURL := callbackURLWithRedirect(callbackURL, returnURL)
	log.Printf("khalti order callback url generated: order_id=%s callback_url=%s return_url=%s", order.ID, callbackURL, returnURL)
	resp, err := s.createKhaltiGatewayPayment(ctx, order.FinalPrice, returnCallbackURL, order.ID.String(), "Dhune order "+order.ID.String())
	if err != nil {
		return nil, err
	}

	err = s.upsertOrderGatewayPayment(ctx, order, db.PaymentMethodTypeKHALTI, resp.Pidx)
	if err != nil {
		return nil, err
	}
	log.Printf("order payment initiated: order_id=%s method=%s payment_ref=%s", order.ID, db.PaymentMethodTypeKHALTI, resp.Pidx)
	return resp, nil
}

func (s *PaymentService) initiateCommissionKhalti(ctx context.Context, vendorID uuid.UUID, returnURL string) (*KhaltiInitiateResponse, error) {
	due, err := s.pendingCommissionDue(ctx, vendorID)
	if err != nil {
		return nil, err
	}
	if due <= 0 {
		return nil, fmt.Errorf("no commission due")
	}
	amount := money(due)
	callbackURL, err := commissionKhaltiCallbackURL()
	if err != nil {
		return nil, err
	}
	returnCallbackURL := callbackURLWithRedirect(callbackURL, returnURL)
	log.Printf("khalti commission callback url generated: vendor_id=%s callback_url=%s return_url=%s", vendorID, callbackURL, returnURL)
	resp, err := s.createKhaltiGatewayPayment(ctx, amount, returnCallbackURL, "commission-"+vendorID.String(), "Dhune commission due")
	if err != nil {
		return nil, err
	}
	if err := s.createCommissionGatewayPayment(ctx, vendorID, amount, db.PaymentMethodTypeKHALTI, resp.Pidx); err != nil {
		return nil, err
	}
	log.Printf("commission payment initiated: vendor_id=%s method=%s amount=%s payment_ref=%s", vendorID, db.PaymentMethodTypeKHALTI, amount, resp.Pidx)
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
	log.Printf("khalti initiate request: purchase_order_id=%s amount_paisa=%d return_url=%s website_url=%s", purchaseID, payload["amount"], returnURL, payload["website_url"])
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
	if existing, existingErr := repoTx.GetOpenCommissionPaymentByVendor(ctx, vendorID); existingErr == nil {
		_, err = repoTx.PrepareGatewayPayment(ctx, db.PrepareGatewayPaymentParams{
			ID:               existing.ID,
			Amount:           amount,
			PaymentMethod:    method,
			GatewayReference: sql.NullString{String: gatewayRef, Valid: true},
		})
	} else if existingErr == sql.ErrNoRows {
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
	} else {
		err = existingErr
	}
	if err != nil {
		return fmt.Errorf("failed to store commission payment: %w", err)
	}
	return tx.Commit()
}

func (s *PaymentService) RenderOrderEsewa(ctx context.Context, userID, orderID uuid.UUID, returnURL string) (string, map[string]string, error) {
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
	log.Printf("order payment initiated: order_id=%s method=%s payment_ref=%s", order.ID, db.PaymentMethodTypeESEWA, transactionUUID)
	successURL, err := orderEsewaSuccessURL()
	if err != nil {
		return "", nil, err
	}
	log.Printf("esewa order callback url generated: order_id=%s callback_url=%s return_url=%s", order.ID, successURL, returnURL)
	return s.esewaForm(order.FinalPrice, transactionUUID, callbackURLWithRedirect(successURL, returnURL))
}

func (s *PaymentService) RenderCommissionEsewa(ctx context.Context, vendorID uuid.UUID, returnURL string) (string, map[string]string, error) {
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
	log.Printf("commission payment initiated: vendor_id=%s method=%s amount=%s payment_ref=%s", vendorID, db.PaymentMethodTypeESEWA, amount, transactionUUID)
	successURL, err := commissionEsewaSuccessURL()
	if err != nil {
		return "", nil, err
	}
	log.Printf("esewa commission callback url generated: vendor_id=%s callback_url=%s return_url=%s", vendorID, successURL, returnURL)
	return s.esewaForm(amount, transactionUUID, callbackURLWithRedirect(successURL, returnURL))
}

func (s *PaymentService) esewaForm(totalAmount, transactionUUID, successURL string) (string, map[string]string, error) {
	failureURL, err := esewaFailureURL()
	if err != nil {
		return "", nil, err
	}
	if strings.TrimSpace(config.AppConfig.EsewaProductCode) == "" || strings.TrimSpace(config.AppConfig.EsewaSecretKey) == "" || esewaGatewayURL() == "" || esewaStatusURL() == "" {
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
		"failure_url":             failureURL,
		"signed_field_names":      "total_amount,transaction_uuid,product_code",
		"signature":               signEsewa(totalAmount, transactionUUID, productCode),
	}
	log.Printf("esewa form generated: action=%s success_url=%s failure_url=%s transaction_uuid=%s", esewaGatewayURL(), successURL, failureURL, transactionUUID)
	return esewaGatewayURL(), fields, nil
}

func (s *PaymentService) VerifyKhaltiCallback(ctx context.Context, pidx string, expectedType db.PaymentRecordType) (*db.Payment, error) {
	log.Printf("khalti callback received: payment_ref=%s expected_type=%s", pidx, expectedType)
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
	log.Printf("khalti lookup result: payment_ref=%s status=%s amount_paisa=%d", pidx, lookup.Status, lookup.TotalAmount)
	expected, _ := parseMoney(payment.Amount)
	if lookup.TotalAmount != int(math.Round(expected*100)) {
		return nil, fmt.Errorf("verified amount does not match payment amount")
	}
	finalized, err := s.finalizeVerifiedPayment(ctx, payment, sql.NullString{String: lookup.Pidx, Valid: true})
	if err != nil {
		return nil, err
	}
	log.Printf("khalti finalization result: payment_id=%s payment_type=%s payment_status=%s order_id=%s", finalized.ID, finalized.PaymentType, finalized.PaymentStatus, nullableOrderID(finalized.OrderID))
	return finalized, nil
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
	log.Printf("esewa callback received: payment_ref=%s expected_type=%s status=%s", data.TransactionUUID, expectedType, data.Status)
	if err := validateEsewaCallbackData(data); err != nil {
		return nil, err
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
	log.Printf("esewa status result: payment_ref=%s status=%s amount=%s product_code=%s", data.TransactionUUID, statusResp.Status, statusResp.TotalAmount, statusResp.ProductCode)
	if !strings.EqualFold(statusResp.Status, "COMPLETE") && !strings.EqualFold(statusResp.Status, "COMPLETED") {
		return nil, fmt.Errorf("payment not completed on esewa")
	}
	if statusResp.ProductCode != "" && statusResp.ProductCode != strings.TrimSpace(config.AppConfig.EsewaProductCode) {
		return nil, fmt.Errorf("esewa product code mismatch")
	}
	if statusResp.TransactionUUID != "" && statusResp.TransactionUUID != data.TransactionUUID {
		return nil, fmt.Errorf("esewa transaction uuid mismatch")
	}
	verifiedAmount, err := parseMoney(statusResp.TotalAmount)
	if err == nil && math.Abs(verifiedAmount-expected) > 0.009 {
		return nil, fmt.Errorf("esewa status amount mismatch")
	}
	finalized, err := s.finalizeVerifiedPayment(ctx, payment, sql.NullString{String: data.TransactionUUID, Valid: true})
	if err != nil {
		return nil, err
	}
	log.Printf("esewa finalization result: payment_id=%s payment_type=%s payment_status=%s order_id=%s", finalized.ID, finalized.PaymentType, finalized.PaymentStatus, nullableOrderID(finalized.OrderID))
	return finalized, nil
}

func nullableOrderID(orderID uuid.NullUUID) string {
	if !orderID.Valid {
		return ""
	}
	return orderID.UUID.String()
}

func validateEsewaCallbackData(data EsewaSuccessData) error {
	productCode := strings.TrimSpace(config.AppConfig.EsewaProductCode)
	if data.ProductCode != "" && data.ProductCode != productCode {
		return fmt.Errorf("esewa product code mismatch")
	}
	if data.SignedFieldNames != "" && data.Signature != "" {
		signature, err := signEsewaFields(data)
		if err != nil {
			return err
		}
		if signature != data.Signature {
			return fmt.Errorf("esewa signature mismatch")
		}
	}
	if data.Status != "" && !strings.EqualFold(data.Status, "COMPLETE") && !strings.EqualFold(data.Status, "COMPLETED") {
		return fmt.Errorf("esewa callback is not complete")
	}
	return nil
}

func signEsewaFields(data EsewaSuccessData) (string, error) {
	values := map[string]string{
		"transaction_code":   data.TransactionCode,
		"status":             data.Status,
		"total_amount":       data.TotalAmount,
		"transaction_uuid":   data.TransactionUUID,
		"product_code":       data.ProductCode,
		"signed_field_names": data.SignedFieldNames,
	}
	fieldNames := strings.Split(data.SignedFieldNames, ",")
	parts := make([]string, 0, len(fieldNames))
	for _, fieldName := range fieldNames {
		fieldName = strings.TrimSpace(fieldName)
		value, ok := values[fieldName]
		if !ok {
			return "", fmt.Errorf("unsupported esewa signed field %s", fieldName)
		}
		parts = append(parts, fmt.Sprintf("%s=%s", fieldName, value))
	}
	mac := hmac.New(sha256.New, []byte(config.AppConfig.EsewaSecretKey))
	mac.Write([]byte(strings.Join(parts, ",")))
	return base64.StdEncoding.EncodeToString(mac.Sum(nil)), nil
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
		if current.PaymentType == db.PaymentRecordTypeCOMMISSIONPAYMENT {
			log.Printf("duplicate commission payment callback ignored: vendor_id=%s payment_id=%s payment_amount=%s", current.VendorID, current.ID, current.Amount)
		} else {
			finalized, err := s.finalizePaidPaymentTx(ctx, qtx, repoTx, current)
			if err != nil {
				return nil, err
			}
			current = *finalized
		}
		if err := tx.Commit(); err != nil {
			return nil, err
		}
		return &current, nil
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
	if current.PaymentType == db.PaymentRecordTypeCOMMISSIONPAYMENT {
		log.Printf("duplicate commission payment callback ignored: vendor_id=%s payment_id=%s payment_amount=%s", current.VendorID, current.ID, current.Amount)
	} else {
		finalized, err := s.finalizePaidPaymentTx(ctx, qtx, repoTx, current)
		if err != nil {
			return nil, err
		}
		current = *finalized
	}
	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return &current, nil
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
		return s.finalizeCommissionPaymentTx(ctx, qtx, payment)
	default:
		return fmt.Errorf("unsupported payment type")
	}
	return nil
}

func (s *PaymentService) finalizeCommissionPaymentTx(ctx context.Context, qtx *db.Queries, payment db.Payment) error {
	if payment.PaymentType != db.PaymentRecordTypeCOMMISSIONPAYMENT {
		return fmt.Errorf("payment is not a commission payment")
	}
	paymentAmount, err := parseMoney(payment.Amount)
	if err != nil {
		return fmt.Errorf("invalid commission payment amount")
	}
	pendingBefore, err := pendingCommissionDueTx(ctx, qtx, payment.VendorID)
	if err != nil {
		return fmt.Errorf("failed to fetch pending commission due: %w", err)
	}
	pendingCommissions, err := qtx.ListPendingCommissionsByVendor(ctx, payment.VendorID)
	if err != nil {
		return fmt.Errorf("failed to list pending commissions: %w", err)
	}
	selectedIDs := make([]string, 0, len(pendingCommissions))
	selectedTotal := 0.0
	for _, commission := range pendingCommissions {
		selectedIDs = append(selectedIDs, commission.ID.String())
		amount, amountErr := parseMoney(commission.CommissionAmount)
		if amountErr != nil {
			return fmt.Errorf("invalid pending commission amount")
		}
		selectedTotal += amount
	}
	log.Printf(
		"commission payment finalization started: vendor_id=%s payment_id=%s payment_amount=%s pending_due_before=%s selected_commission_ids=%s total_selected_commission_amount=%s",
		payment.VendorID,
		payment.ID,
		money(paymentAmount),
		money(pendingBefore),
		strings.Join(selectedIDs, ","),
		money(selectedTotal),
	)
	if len(pendingCommissions) == 0 {
		return fmt.Errorf("commission payment did not settle any pending commissions")
	}
	if math.Abs(paymentAmount-pendingBefore) > 0.009 || math.Abs(paymentAmount-selectedTotal) > 0.009 {
		return fmt.Errorf("commission payment amount %s does not match pending due %s", money(paymentAmount), money(pendingBefore))
	}
	markedCommissions, err := qtx.MarkCommissionsAsPaid(ctx, payment.VendorID)
	if err != nil {
		return fmt.Errorf("failed to mark commissions paid: %w", err)
	}
	if len(markedCommissions) == 0 {
		return fmt.Errorf("commission payment did not mark any commissions paid")
	}
	markedTotal := 0.0
	for _, commission := range markedCommissions {
		amount, amountErr := parseMoney(commission.CommissionAmount)
		if amountErr != nil {
			return fmt.Errorf("invalid marked commission amount")
		}
		markedTotal += amount
	}
	if math.Abs(markedTotal-paymentAmount) > 0.009 {
		return fmt.Errorf("marked commission amount %s does not match payment amount %s", money(markedTotal), money(paymentAmount))
	}
	pendingAfter, err := pendingCommissionDueTx(ctx, qtx, payment.VendorID)
	if err != nil {
		return fmt.Errorf("failed to fetch pending commission due after finalization: %w", err)
	}
	log.Printf(
		"commission payment finalization completed: vendor_id=%s payment_id=%s payment_amount=%s total_selected_commission_amount=%s commissions_marked_paid=%d pending_due_after=%s",
		payment.VendorID,
		payment.ID,
		money(paymentAmount),
		money(selectedTotal),
		len(markedCommissions),
		money(pendingAfter),
	)
	return nil
}

func (s *PaymentService) finalizeOrderPaymentTx(ctx context.Context, qtx *db.Queries, repoTx paymentRepo.PaymentRepository, payment db.Payment) error {
	if payment.PaymentType != db.PaymentRecordTypeORDERPAYMENT {
		return fmt.Errorf("payment is not an order payment")
	}
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
		log.Printf("duplicate order payment finalization ignored: order_id=%s payment_id=%s", order.ID, payment.ID)
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
	log.Printf("commission created: order_id=%s vendor_id=%s commission_amount=%s", order.ID, order.VendorID, money((expected*percent)/100))
	events.EmitEvent(events.Event{
		Type: "ORDER_PAYMENT_FINALIZED",
		Data: events.NotificationEvent{
			Title:   "Payment received",
			Body:    "Payment has been verified for your order.",
			UserIDs: []string{order.UserID.String(), order.VendorID.String()},
			Roles:   []string{"admin"},
			Persist: true,
			Push:    true,
			Data: map[string]interface{}{
				"order_id":       order.ID.String(),
				"vendor_id":      order.VendorID.String(),
				"user_id":        order.UserID.String(),
				"payment_status": string(db.PaymentStatusPAID),
			},
			EntityType: "order",
			EntityID:   order.ID.String(),
		},
	})
	log.Printf("order payment finalized: order_id=%s payment_id=%s", order.ID, payment.ID)
	return nil
}

func (s *PaymentService) pendingCommissionDue(ctx context.Context, vendorID uuid.UUID) (float64, error) {
	stats, err := db.New(s.db).GetVendorFinanceStats(ctx, vendorID)
	if err != nil {
		return 0, err
	}
	return parseMoney(stats.TotalPendingDue)
}

func pendingCommissionDueTx(ctx context.Context, qtx *db.Queries, vendorID uuid.UUID) (float64, error) {
	stats, err := qtx.GetVendorFinanceStats(ctx, vendorID)
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
	log.Printf("esewa status lookup response: status=%d body=%s", resp.StatusCode, string(bodyBytes))
	var statusResp EsewaStatusResponse
	if err := json.Unmarshal(bodyBytes, &statusResp); err != nil {
		return nil, fmt.Errorf("failed to decode esewa status response: %w", err)
	}
	return &statusResp, nil
}
