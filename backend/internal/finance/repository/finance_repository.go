package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type FinanceRepository interface {
	CreateCommission(ctx context.Context, params db.CreateCommissionParams) (db.Commission, error)
	GetCommissionByOrderID(ctx context.Context, orderID uuid.UUID) (db.Commission, error)
	ListCommissionsByVendor(ctx context.Context, params db.ListCommissionsByVendorParams) ([]db.Commission, error)
	MarkCommissionsAsPaid(ctx context.Context, vendorID uuid.UUID) ([]db.Commission, error)
	ListCommissionsAdmin(ctx context.Context, params db.ListCommissionsAdminParams) ([]db.Commission, error)
	ListVendorCommissionDues(ctx context.Context) ([]db.ListVendorCommissionDuesRow, error)

	CreateVendorSettlement(ctx context.Context, params db.CreateVendorSettlementParams) (db.VendorSettlement, error)
	GetVendorSettlementByID(ctx context.Context, id uuid.UUID) (db.VendorSettlement, error)
	UpdateVendorSettlementStatus(ctx context.Context, params db.UpdateVendorSettlementStatusParams) (db.VendorSettlement, error)
	ListVendorSettlements(ctx context.Context, params db.ListVendorSettlementsParams) ([]db.VendorSettlement, error)
	ListVendorSettlementsByVendor(ctx context.Context, params db.ListVendorSettlementsByVendorParams) ([]db.VendorSettlement, error)

	GetAdminFinanceStats(ctx context.Context) (db.GetAdminFinanceStatsRow, error)
	GetVendorFinanceStats(ctx context.Context, vendorID uuid.UUID) (db.GetVendorFinanceStatsRow, error)

	WithTx(tx *db.Queries) FinanceRepository
}

type financeRepo struct {
	q *db.Queries
}

func NewFinanceRepository(q *db.Queries) FinanceRepository {
	return &financeRepo{q: q}
}

func (r *financeRepo) CreateCommission(ctx context.Context, params db.CreateCommissionParams) (db.Commission, error) {
	return r.q.CreateCommission(ctx, params)
}

func (r *financeRepo) GetCommissionByOrderID(ctx context.Context, orderID uuid.UUID) (db.Commission, error) {
	return r.q.GetCommissionByOrderID(ctx, orderID)
}

func (r *financeRepo) ListCommissionsByVendor(ctx context.Context, params db.ListCommissionsByVendorParams) ([]db.Commission, error) {
	return r.q.ListCommissionsByVendor(ctx, params)
}

func (r *financeRepo) MarkCommissionsAsPaid(ctx context.Context, vendorID uuid.UUID) ([]db.Commission, error) {
	return r.q.MarkCommissionsAsPaid(ctx, vendorID)
}

func (r *financeRepo) ListCommissionsAdmin(ctx context.Context, params db.ListCommissionsAdminParams) ([]db.Commission, error) {
	return r.q.ListCommissionsAdmin(ctx, params)
}

func (r *financeRepo) ListVendorCommissionDues(ctx context.Context) ([]db.ListVendorCommissionDuesRow, error) {
	return r.q.ListVendorCommissionDues(ctx)
}

func (r *financeRepo) CreateVendorSettlement(ctx context.Context, params db.CreateVendorSettlementParams) (db.VendorSettlement, error) {
	return r.q.CreateVendorSettlement(ctx, params)
}

func (r *financeRepo) GetVendorSettlementByID(ctx context.Context, id uuid.UUID) (db.VendorSettlement, error) {
	return r.q.GetVendorSettlementByID(ctx, id)
}

func (r *financeRepo) UpdateVendorSettlementStatus(ctx context.Context, params db.UpdateVendorSettlementStatusParams) (db.VendorSettlement, error) {
	return r.q.UpdateVendorSettlementStatus(ctx, params)
}

func (r *financeRepo) ListVendorSettlements(ctx context.Context, params db.ListVendorSettlementsParams) ([]db.VendorSettlement, error) {
	return r.q.ListVendorSettlements(ctx, params)
}

func (r *financeRepo) ListVendorSettlementsByVendor(ctx context.Context, params db.ListVendorSettlementsByVendorParams) ([]db.VendorSettlement, error) {
	return r.q.ListVendorSettlementsByVendor(ctx, params)
}

func (r *financeRepo) GetAdminFinanceStats(ctx context.Context) (db.GetAdminFinanceStatsRow, error) {
	return r.q.GetAdminFinanceStats(ctx)
}

func (r *financeRepo) GetVendorFinanceStats(ctx context.Context, vendorID uuid.UUID) (db.GetVendorFinanceStatsRow, error) {
	return r.q.GetVendorFinanceStats(ctx, vendorID)
}

func (r *financeRepo) WithTx(tx *db.Queries) FinanceRepository {
	return &financeRepo{q: tx}
}
