package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type orderRepository struct {
	q *db.Queries
}

func NewOrderRepository(q *db.Queries) OrderRepository {
	return &orderRepository{
		q: q,
	}
}

// Create order (used when offer is accepted)
func (r *orderRepository) Create(
	ctx context.Context,
	params db.CreateOrderParams,
) (db.Order, error) {

	return r.q.CreateOrder(ctx, params)
}

// List orders for a user dashboard
func (r *orderRepository) ListByUser(
	ctx context.Context,
	userID uuid.UUID,
	limit int32,
	offset int32,
) ([]db.ListOrdersByUserRow, error) {

	return r.q.ListOrdersByUser(ctx, db.ListOrdersByUserParams{
		UserID: userID,
		Limit:  limit,
		Offset: offset,
	})
}

// List orders for vendor dashboard
func (r *orderRepository) ListByVendor(
	ctx context.Context,
	vendorID uuid.UUID,
	status db.NullOrderStatus,
	limit int32,
	offset int32,
) ([]db.ListOrdersByVendorRow, error) {

	return r.q.ListOrdersByVendor(ctx, db.ListOrdersByVendorParams{
		VendorID: vendorID,
		Status:   status,
		Limit:    limit,
		Offset:   offset,
	})
}

// List orders for admin panel
func (r *orderRepository) ListAdmin(
	ctx context.Context,
	status db.NullOrderStatus,
	limit int32,
	offset int32,
) ([]db.ListOrdersAdminRow, error) {

	return r.q.ListOrdersAdmin(ctx, db.ListOrdersAdminParams{
		Status: status,
		Limit:  limit,
		Offset: offset,
	})
}

// Get full order detail (for clicking table row)
func (r *orderRepository) GetDetail(
	ctx context.Context,
	orderID uuid.UUID,
) (db.GetOrderDetailRow, error) {

	return r.q.GetOrderDetail(ctx, orderID)
}

// Update order status (vendor progress)
func (r *orderRepository) UpdateStatus(
	ctx context.Context,
	orderID uuid.UUID,
	status db.OrderStatus,
) error {

	return r.q.UpdateOrderStatus(ctx, db.UpdateOrderStatusParams{
		ID:          orderID,
		OrderStatus: status,
	})
}

// Cancel order (user)
func (r *orderRepository) Cancel(
	ctx context.Context,
	orderID uuid.UUID,
) error {

	return r.q.CancelOrder(ctx, orderID)
}

// Mark order paid (payment service)
func (r *orderRepository) MarkPaid(
	ctx context.Context,
	orderID uuid.UUID,
) error {

	return r.q.MarkOrderPaid(ctx, orderID)
}

// Mark order refunded
func (r *orderRepository) MarkRefunded(
	ctx context.Context,
	orderID uuid.UUID,
) error {

	return r.q.MarkOrderRefunded(ctx, orderID)
}

// Order statistics for dashboards
func (r *orderRepository) GetStatsFiltered(
	ctx context.Context,
	userID uuid.NullUUID,
	vendorID uuid.NullUUID,
) (db.GetOrderStatsFilteredRow, error) {

	return r.q.GetOrderStatsFiltered(ctx, db.GetOrderStatsFilteredParams{
		UserID:   userID,
		VendorID: vendorID,
	})
}
