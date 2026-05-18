package repository

import (
	"context"

	"database/sql"
	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type PaymentRepository interface {
	CreatePayment(ctx context.Context, params db.CreatePaymentParams) (db.Payment, error)
	GetPaymentByOrderID(ctx context.Context, orderID uuid.UUID) (db.Payment, error)
	GetPaymentByID(ctx context.Context, id uuid.UUID) (db.Payment, error)
	GetPaymentByGatewayReference(ctx context.Context, gatewayReference *string) (db.Payment, error)
	GetOpenCommissionPaymentByVendor(ctx context.Context, vendorID uuid.UUID) (db.Payment, error)
	UpdatePaymentStatus(ctx context.Context, params db.UpdatePaymentStatusParams) (db.Payment, error)
	PrepareGatewayPayment(ctx context.Context, params db.PrepareGatewayPaymentParams) (db.Payment, error)
	UpdateOrderPaymentStatus(ctx context.Context, params db.UpdateOrderPaymentStatusParams) (db.Order, error)
	ListPaymentsByUser(ctx context.Context, params db.ListPaymentsByUserParams) ([]db.Payment, error)
	ListCommissionPaymentsByVendor(ctx context.Context, params db.ListCommissionPaymentsByVendorParams) ([]db.Payment, error)
	ListCommissionPaymentsAdmin(ctx context.Context, params db.ListCommissionPaymentsAdminParams) ([]db.Payment, error)
	WithTx(tx *db.Queries) PaymentRepository
}

type paymentRepo struct {
	q *db.Queries
}

func NewPaymentRepository(q *db.Queries) PaymentRepository {
	return &paymentRepo{q: q}
}

func (r *paymentRepo) CreatePayment(ctx context.Context, params db.CreatePaymentParams) (db.Payment, error) {
	return r.q.CreatePayment(ctx, params)
}

func (r *paymentRepo) GetPaymentByOrderID(ctx context.Context, orderID uuid.UUID) (db.Payment, error) {
	return r.q.GetPaymentByOrderID(ctx, uuid.NullUUID{UUID: orderID, Valid: true})
}

func (r *paymentRepo) GetPaymentByID(ctx context.Context, id uuid.UUID) (db.Payment, error) {
	return r.q.GetPaymentByID(ctx, id)
}

func (r *paymentRepo) GetPaymentByGatewayReference(ctx context.Context, gatewayReference *string) (db.Payment, error) {
	var ref sql.NullString
	if gatewayReference != nil {
		ref = sql.NullString{String: *gatewayReference, Valid: true}
	}
	return r.q.GetPaymentByGatewayReference(ctx, ref)
}

func (r *paymentRepo) GetOpenCommissionPaymentByVendor(ctx context.Context, vendorID uuid.UUID) (db.Payment, error) {
	return r.q.GetOpenCommissionPaymentByVendor(ctx, vendorID)
}

func (r *paymentRepo) UpdatePaymentStatus(ctx context.Context, params db.UpdatePaymentStatusParams) (db.Payment, error) {
	return r.q.UpdatePaymentStatus(ctx, params)
}

func (r *paymentRepo) PrepareGatewayPayment(ctx context.Context, params db.PrepareGatewayPaymentParams) (db.Payment, error) {
	return r.q.PrepareGatewayPayment(ctx, params)
}

func (r *paymentRepo) UpdateOrderPaymentStatus(ctx context.Context, params db.UpdateOrderPaymentStatusParams) (db.Order, error) {
	return r.q.UpdateOrderPaymentStatus(ctx, params)
}

func (r *paymentRepo) ListPaymentsByUser(ctx context.Context, params db.ListPaymentsByUserParams) ([]db.Payment, error) {
	return r.q.ListPaymentsByUser(ctx, params)
}

func (r *paymentRepo) ListCommissionPaymentsByVendor(ctx context.Context, params db.ListCommissionPaymentsByVendorParams) ([]db.Payment, error) {
	return r.q.ListCommissionPaymentsByVendor(ctx, params)
}

func (r *paymentRepo) ListCommissionPaymentsAdmin(ctx context.Context, params db.ListCommissionPaymentsAdminParams) ([]db.Payment, error) {
	return r.q.ListCommissionPaymentsAdmin(ctx, params)
}

func (r *paymentRepo) WithTx(tx *db.Queries) PaymentRepository {
	return &paymentRepo{q: tx}
}
