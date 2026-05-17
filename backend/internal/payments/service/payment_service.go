package service

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"strconv"
	"strings"

	"github.com/Nabinlamsal/dhune.np/internal/config"
	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/orders/repository"
	paymentRepo "github.com/Nabinlamsal/dhune.np/internal/payments/repository"
	"github.com/google/uuid"
)

type PaymentService struct {
	repo       paymentRepo.PaymentRepository
	orderRepo  repository.OrderRepository
	db         *sql.DB
	httpClient *http.Client
}

func NewPaymentService(repo paymentRepo.PaymentRepository, orderRepo repository.OrderRepository, database *sql.DB) *PaymentService {
	return &PaymentService{
		repo:       repo,
		orderRepo:  orderRepo,
		db:         database,
		httpClient: &http.Client{},
	}
}

type InitiateKhaltiInput struct {
	OrderID      uuid.UUID `json:"order_id"`
	Amount       float64   `json:"amount"` // in Rs, Khalti needs in paisa
	PurchaseID   string    `json:"purchase_order_id"`
	PurchaseName string    `json:"purchase_order_name"`
	ReturnURL    string    `json:"return_url"`
}

type KhaltiInitiateResponse struct {
	Pidx       string `json:"pidx"`
	PaymentURL string `json:"payment_url"`
	ExpiresAt  string `json:"expires_at"`
	ExpiresIn  int    `json:"expires_in"`
}

type KhaltiVerifyInput struct {
	Pidx string `json:"pidx"`
}

type KhaltiLookupResponse struct {
	Pidx          string `json:"pidx"`
	TotalAmount   int    `json:"total_amount"`
	Status        string `json:"status"`
	TransactionID string `json:"transaction_id"`
	Fee           int    `json:"fee"`
	Refunded      bool   `json:"refunded"`
}

func khaltiBaseURL() string {
	baseURL := strings.TrimRight(config.AppConfig.KhaltiBaseURL, "/")
	if baseURL == "" {
		baseURL = "https://a.khalti.com/api/v2"
	}
	return baseURL
}

func khaltiWebsiteURL() string {
	websiteURL := strings.TrimRight(config.AppConfig.WebsiteURL, "/")
	if websiteURL == "" {
		websiteURL = "https://dhune.np"
	}
	return websiteURL
}

func khaltiReturnURL() string {
	publicBackendURL := strings.TrimRight(config.AppConfig.PublicBackendURL, "/")
	if publicBackendURL == "" {
		publicBackendURL = khaltiWebsiteURL()
	}
	return fmt.Sprintf("%s/payments/khalti/callback", publicBackendURL)
}

func (s *PaymentService) PayCash(ctx context.Context, orderID, userID uuid.UUID) (*db.Payment, error) {
	// Start transaction
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	qtx := db.New(tx)
	repoTx := s.repo.WithTx(qtx)

	// Fetch order
	order, err := s.orderRepo.WithTx(qtx).GetByID(ctx, orderID)
	if err != nil {
		return nil, fmt.Errorf("order not found: %w", err)
	}

	if order.UserID != userID {
		return nil, fmt.Errorf("unauthorized to pay for this order")
	}

	if order.PaymentStatus == db.PaymentStatusPAID {
		return nil, fmt.Errorf("order is already paid")
	}

	// Create payment record
	amountStr := order.FinalPrice
	payment, err := repoTx.CreatePayment(ctx, db.CreatePaymentParams{
		OrderID:       order.ID,
		PayerID:       order.UserID,
		VendorID:      order.VendorID,
		Amount:        amountStr,
		PaymentMethod: db.PaymentMethodTypeCASH,
		PaymentStatus: db.PaymentStatusPAID,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create payment: %w", err)
	}

	// Update order payment status
	_, err = repoTx.UpdateOrderPaymentStatus(ctx, db.UpdateOrderPaymentStatusParams{
		ID:            order.ID,
		PaymentStatus: db.PaymentStatusPAID,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to update order payment status: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &payment, nil
}

func (s *PaymentService) InitiateKhalti(ctx context.Context, userID uuid.UUID, input InitiateKhaltiInput) (*KhaltiInitiateResponse, error) {
	order, err := s.orderRepo.GetByID(ctx, input.OrderID)
	if err != nil {
		return nil, fmt.Errorf("order not found: %w", err)
	}

	if order.UserID != userID {
		return nil, fmt.Errorf("unauthorized to pay for this order")
	}

	if order.PaymentStatus == db.PaymentStatusPAID {
		return nil, fmt.Errorf("order is already paid")
	}

	url := fmt.Sprintf("%s/epayment/initiate/", khaltiBaseURL())

	finalPrice, err := strconv.ParseFloat(order.FinalPrice, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid order final price: %w", err)
	}
	amountInPaisa := int(math.Round(finalPrice * 100))

	purchaseID := input.PurchaseID
	if purchaseID == "" {
		purchaseID = order.ID.String()
	}
	purchaseName := input.PurchaseName
	if purchaseName == "" {
		purchaseName = fmt.Sprintf("Dhune order %s", order.ID.String())
	}

	payload := map[string]interface{}{
		"return_url":          khaltiReturnURL(),
		"website_url":         khaltiWebsiteURL(),
		"amount":              amountInPaisa,
		"purchase_order_id":   purchaseID,
		"purchase_order_name": purchaseName,
		"customer_info": map[string]string{
			"name":  userID.String(),
			"email": "user@example.com",
			"phone": "9800000000",
		},
	}

	payloadBytes, _ := json.Marshal(payload)

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Key %s", config.AppConfig.KhaltiSecretKey))
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

	var khaltiResp KhaltiInitiateResponse
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		log.Printf("khalti initiate failed: status=%d body=%s", resp.StatusCode, string(bodyBytes))
		return nil, fmt.Errorf("khalti initiate failed with status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	if err := json.Unmarshal(bodyBytes, &khaltiResp); err != nil {
		return nil, fmt.Errorf("failed to decode khalti initiate response: %w", err)
	}

	if khaltiResp.PaymentURL == "" {
		log.Printf("khalti initiate response missing payment_url: status=%d body=%s", resp.StatusCode, string(bodyBytes))
		return nil, fmt.Errorf("khalti initiate response missing payment_url: %s", string(bodyBytes))
	}

	// Create a PENDING payment record
	amountStr := order.FinalPrice
	// If payment already exists (e.g. they retried), we can either update or recreate.
	// To keep it simple and safe from duplicates, we can check if it exists:
	existingPayment, err := s.repo.GetPaymentByOrderID(ctx, input.OrderID)
	if err == nil && existingPayment.ID != uuid.Nil {
		// Update existing pending payment reference
		// We'll skip for now to avoid complexity, assuming unique constraint will fail
		// But let's handle it gracefully:
		_, err = s.repo.UpdatePaymentStatus(ctx, db.UpdatePaymentStatusParams{
			ID:               existingPayment.ID,
			PaymentStatus:    db.PaymentStatusUNPAID,
			GatewayReference: sql.NullString{String: khaltiResp.Pidx, Valid: true},
		})
		if err != nil {
			return nil, fmt.Errorf("failed to update khalti payment record: %w", err)
		}
	} else {
		gatewayRef := khaltiResp.Pidx
		_, err = s.repo.CreatePayment(ctx, db.CreatePaymentParams{
			OrderID:          order.ID,
			PayerID:          order.UserID,
			VendorID:         order.VendorID,
			Amount:           amountStr,
			PaymentMethod:    db.PaymentMethodTypeKHALTI,
			PaymentStatus:    db.PaymentStatusUNPAID,
			GatewayReference: sql.NullString{String: gatewayRef, Valid: true},
		})
		if err != nil {
			return nil, fmt.Errorf("failed to create khalti payment record: %w", err)
		}
	}

	return &khaltiResp, nil
}

func (s *PaymentService) VerifyKhalti(ctx context.Context, userID uuid.UUID, input KhaltiVerifyInput) (*db.Payment, error) {
	return s.verifyKhaltiPayment(ctx, input.Pidx)
}

func (s *PaymentService) VerifyKhaltiCallback(ctx context.Context, pidx string) (*db.Payment, error) {
	return s.verifyKhaltiPayment(ctx, pidx)
}

func (s *PaymentService) verifyKhaltiPayment(ctx context.Context, pidx string) (*db.Payment, error) {
	url := fmt.Sprintf("%s/epayment/lookup/", khaltiBaseURL())

	payload := map[string]interface{}{
		"pidx": pidx,
	}

	payloadBytes, _ := json.Marshal(payload)

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Key %s", config.AppConfig.KhaltiSecretKey))
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
		return nil, fmt.Errorf("khalti lookup failed with status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var khaltiResp KhaltiLookupResponse
	if err := json.Unmarshal(bodyBytes, &khaltiResp); err != nil {
		return nil, fmt.Errorf("failed to decode khalti lookup response: %w", err)
	}

	if khaltiResp.Status != "Completed" {
		return nil, fmt.Errorf("payment not completed on khalti. status: %s", khaltiResp.Status)
	}

	// Verify locally
	payment, err := s.repo.GetPaymentByGatewayReference(ctx, &pidx)
	if err != nil {
		return nil, fmt.Errorf("local payment record not found for pidx")
	}

	if payment.PaymentStatus == db.PaymentStatusPAID {
		return &payment, nil
	}

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	qtx := db.New(tx)
	repoTx := s.repo.WithTx(qtx)

	// Update payment record
	updatedPayment, err := repoTx.UpdatePaymentStatus(ctx, db.UpdatePaymentStatusParams{
		ID:               payment.ID,
		PaymentStatus:    db.PaymentStatusPAID,
		GatewayReference: sql.NullString{String: khaltiResp.Pidx, Valid: true},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to update payment status: %w", err)
	}

	// Update order
	_, err = repoTx.UpdateOrderPaymentStatus(ctx, db.UpdateOrderPaymentStatusParams{
		ID:            payment.OrderID,
		PaymentStatus: db.PaymentStatusPAID,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to update order payment status: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &updatedPayment, nil
}
