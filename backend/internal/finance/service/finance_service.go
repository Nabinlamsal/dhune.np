package service

import (
	"context"
	"database/sql"
	"fmt"
	"strconv"

	catalogRepo "github.com/Nabinlamsal/dhune.np/internal/catalog/repository"
	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/finance/repository"
	orderRepo "github.com/Nabinlamsal/dhune.np/internal/orders/repository"
	"github.com/google/uuid"
)

type FinanceService struct {
	repo         repository.FinanceRepository
	settingsRepo catalogRepo.SettingsRepository
	orderRepo    orderRepo.OrderRepository
	db           *sql.DB
}

type AdminDashboard struct {
	Stats              db.GetAdminFinanceStatsRow       `json:"stats"`
	RecentCommissions  []db.Commission                  `json:"recentCommissions"`
	CommissionPayments []db.Payment                     `json:"commissionPaymentHistory"`
	VendorDues         []db.ListVendorCommissionDuesRow `json:"vendorDues"`
}

type VendorDashboard struct {
	Stats              db.GetVendorFinanceStatsRow `json:"stats"`
	RecentCommissions  []db.Commission             `json:"recentCommissions"`
	CommissionPayments []db.Payment                `json:"commissionPaymentHistory"`
}

func NewFinanceService(
	repo repository.FinanceRepository,
	settingsRepo catalogRepo.SettingsRepository,
	orderRepo orderRepo.OrderRepository,
	database *sql.DB,
) *FinanceService {
	return &FinanceService{
		repo:         repo,
		settingsRepo: settingsRepo,
		orderRepo:    orderRepo,
		db:           database,
	}
}

func (s *FinanceService) CreateCommissionForOrder(ctx context.Context, orderID uuid.UUID) (*db.Commission, error) {
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

	if order.PaymentStatus != db.PaymentStatusPAID {
		return nil, fmt.Errorf("order must be paid to generate commission")
	}

	// Check if commission already exists
	existing, err := repoTx.GetCommissionByOrderID(ctx, orderID)
	if err == nil && existing.ID != uuid.Nil {
		return &existing, nil // already generated
	}

	// Fetch current platform commission settings
	settings, err := s.settingsRepo.GetPlatformSettings(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch platform settings: %w", err)
	}

	percentFloat, err := strconv.ParseFloat(settings.CommissionPercentage, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid commission percentage in settings")
	}

	finalPriceFloat, err := strconv.ParseFloat(order.FinalPrice, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid final price")
	}

	commissionAmount := (finalPriceFloat * percentFloat) / 100.0

	amountStr := fmt.Sprintf("%.2f", commissionAmount)
	orderAmountStr := fmt.Sprintf("%.2f", finalPriceFloat)
	percentStr := fmt.Sprintf("%.2f", percentFloat)

	commission, err := repoTx.CreateCommission(ctx, db.CreateCommissionParams{
		OrderID:           order.ID,
		VendorID:          order.VendorID,
		OrderAmount:       orderAmountStr,
		CommissionPercent: percentStr,
		CommissionAmount:  amountStr,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create commission: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &commission, nil
}

type CreateSettlementInput struct {
	VendorID      uuid.UUID `json:"-"`
	Amount        float64   `json:"amount" binding:"required"`
	PaymentMethod string    `json:"payment_method" binding:"required"`
	Reference     string    `json:"reference"`
}

func (s *FinanceService) CreateVendorSettlement(ctx context.Context, input CreateSettlementInput) (*db.VendorSettlement, error) {
	if input.Amount <= 0 {
		return nil, fmt.Errorf("settlement amount must be greater than zero")
	}
	stats, err := s.repo.GetVendorFinanceStats(ctx, input.VendorID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch commission due: %w", err)
	}
	pendingDue, err := strconv.ParseFloat(stats.TotalPendingDue, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid pending commission due")
	}
	if pendingDue <= 0 {
		return nil, fmt.Errorf("no pending commission due")
	}
	if input.Amount+0.009 < pendingDue {
		return nil, fmt.Errorf("settlement amount must cover pending commission due %.2f", pendingDue)
	}

	amountStr := fmt.Sprintf("%.2f", input.Amount)

	ref := sql.NullString{}
	if input.Reference != "" {
		ref = sql.NullString{String: input.Reference, Valid: true}
	}

	settlement, err := s.repo.CreateVendorSettlement(ctx, db.CreateVendorSettlementParams{
		VendorID:      input.VendorID,
		Amount:        amountStr,
		PaymentMethod: db.PaymentMethodType(input.PaymentMethod),
		Reference:     ref,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create settlement: %w", err)
	}

	return &settlement, nil
}

func (s *FinanceService) VerifyVendorSettlement(ctx context.Context, settlementID uuid.UUID) (*db.VendorSettlement, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	qtx := db.New(tx)
	repoTx := s.repo.WithTx(qtx)

	settlement, err := repoTx.GetVendorSettlementByID(ctx, settlementID)
	if err != nil {
		return nil, fmt.Errorf("settlement not found: %w", err)
	}

	if settlement.Status == db.SettlementStatusVERIFIED {
		return &settlement, nil
	}

	updated, err := repoTx.UpdateVendorSettlementStatus(ctx, db.UpdateVendorSettlementStatusParams{
		ID:     settlement.ID,
		Status: db.SettlementStatusVERIFIED,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to update settlement status: %w", err)
	}

	if _, amountErr := strconv.ParseFloat(settlement.Amount, 64); amountErr != nil {
		return nil, fmt.Errorf("invalid settlement amount")
	}

	// Mark pending commissions that existed when this settlement was submitted.
	_, err = qtx.MarkCommissionsAsPaidThrough(ctx, db.MarkCommissionsAsPaidThroughParams{
		VendorID:  settlement.VendorID,
		CreatedAt: settlement.CreatedAt,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to mark commissions as paid: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &updated, nil
}

func (s *FinanceService) GetAdminStats(ctx context.Context) (*db.GetAdminFinanceStatsRow, error) {
	stats, err := s.repo.GetAdminFinanceStats(ctx)
	if err != nil {
		return nil, err
	}
	return &stats, nil
}

func (s *FinanceService) GetAdminDashboard(ctx context.Context) (*AdminDashboard, error) {
	stats, err := s.repo.GetAdminFinanceStats(ctx)
	if err != nil {
		return nil, err
	}
	commissions, err := s.repo.ListCommissionsAdmin(ctx, db.ListCommissionsAdminParams{Limit: 10, Offset: 0})
	if err != nil {
		return nil, err
	}
	payments, err := db.New(s.db).ListCommissionPaymentsAdmin(ctx, db.ListCommissionPaymentsAdminParams{Limit: 10, Offset: 0})
	if err != nil {
		return nil, err
	}
	dues, err := s.repo.ListVendorCommissionDues(ctx)
	if err != nil {
		return nil, err
	}
	return &AdminDashboard{
		Stats:              stats,
		RecentCommissions:  commissions,
		CommissionPayments: payments,
		VendorDues:         dues,
	}, nil
}

func (s *FinanceService) GetVendorStats(ctx context.Context, vendorID uuid.UUID) (*db.GetVendorFinanceStatsRow, error) {
	stats, err := s.repo.GetVendorFinanceStats(ctx, vendorID)
	if err != nil {
		return nil, err
	}
	if stats.CommissionPercent == "0" || stats.CommissionPercent == "0.00" {
		settings, settingsErr := s.settingsRepo.GetPlatformSettings(ctx)
		if settingsErr == nil {
			stats.CommissionPercent = settings.CommissionPercentage
		}
	}
	return &stats, nil
}

func (s *FinanceService) GetVendorDashboard(ctx context.Context, vendorID uuid.UUID) (*VendorDashboard, error) {
	stats, err := s.GetVendorStats(ctx, vendorID)
	if err != nil {
		return nil, err
	}
	commissions, err := s.repo.ListCommissionsByVendor(ctx, db.ListCommissionsByVendorParams{
		VendorID: vendorID,
		Limit:    10,
		Offset:   0,
	})
	if err != nil {
		return nil, err
	}
	payments, err := db.New(s.db).ListCommissionPaymentsByVendor(ctx, db.ListCommissionPaymentsByVendorParams{
		VendorID: vendorID,
		Limit:    10,
		Offset:   0,
	})
	if err != nil {
		return nil, err
	}
	return &VendorDashboard{
		Stats:              *stats,
		RecentCommissions:  commissions,
		CommissionPayments: payments,
	}, nil
}

func (s *FinanceService) ListVendorSettlements(ctx context.Context, vendorID *uuid.UUID, limit, offset int32) ([]db.VendorSettlement, error) {
	if vendorID != nil {
		return s.repo.ListVendorSettlementsByVendor(ctx, db.ListVendorSettlementsByVendorParams{
			VendorID: *vendorID,
			Limit:    limit,
			Offset:   offset,
		})
	}
	return s.repo.ListVendorSettlements(ctx, db.ListVendorSettlementsParams{
		Limit:  limit,
		Offset: offset,
	})
}

func (s *FinanceService) ListCommissionsByVendor(ctx context.Context, vendorID uuid.UUID, limit, offset int32) ([]db.Commission, error) {
	return s.repo.ListCommissionsByVendor(ctx, db.ListCommissionsByVendorParams{
		VendorID: vendorID,
		Limit:    limit,
		Offset:   offset,
	})
}
