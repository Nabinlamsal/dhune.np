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
	return &orderRepository{q: q}
}

// Create new order
func (r *orderRepository) Create(ctx context.Context, params db.CreateOrderParams) (db.Order, error) {
	return r.q.CreateOrder(ctx, params)
}

// List orders by user
func (r *orderRepository) ListByUser(
	ctx context.Context,
	userID uuid.UUID,
	limit,
	offset int32,
) ([]db.Order, error) {

	return r.q.ListOrdersByUser(ctx, db.ListOrdersByUserParams{
		UserID: userID,
		Limit:  limit,
		Offset: offset,
	})
}

// List orders by vendor
func (r *orderRepository) ListByVendor(
	ctx context.Context,
	vendorID uuid.UUID,
	status db.NullOrderStatus,
	sortBy string,
	limit,
	offset int32,
) ([]db.Order, error) {

	// Default sort
	if sortBy == "" {
		sortBy = "newest"
	}

	return r.q.ListOrdersByVendor(ctx, db.ListOrdersByVendorParams{
		VendorID: vendorID,
		Limit:    limit,
		Offset:   offset,
		Status:   status,
		SortBy:   sortBy,
	})
}

// Get single order
func (r *orderRepository) GetByID(
	ctx context.Context,
	orderID uuid.UUID,
) (db.Order, error) {

	return r.q.GetOrderByID(ctx, orderID)
}

// Update order status
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

// Cancel order
func (r *orderRepository) Cancel(
	ctx context.Context,
	orderID uuid.UUID,
) error {

	return r.q.CancelOrder(ctx, orderID)
}

// Mark order as paid
func (r *orderRepository) MarkPaid(
	ctx context.Context,
	orderID uuid.UUID,
) error {

	return r.q.MarkOrderPaid(ctx, orderID)
}

// Mark order as refunded
func (r *orderRepository) MarkRefunded(
	ctx context.Context,
	orderID uuid.UUID,
) error {

	return r.q.MarkOrderRefunded(ctx, orderID)
}

// Admin listing with optional status filter
func (r *orderRepository) ListAdmin(
	ctx context.Context,
	status db.NullOrderStatus,
	limit, offset int32,
) ([]db.Order, error) {
	return r.q.ListOrdersAdmin(ctx, db.ListOrdersAdminParams{
		Status: status,
		Limit:  limit,
		Offset: offset,
	})
}

// Order statistics
func (r *orderRepository) GetStatsFiltered(
	ctx context.Context,
	userID uuid.NullUUID,
	vendorID uuid.NullUUID,
) (db.GetOrderStatsFilteredRow, error) {

	return r.q.GetOrderStatsFiltered(
		ctx,
		db.GetOrderStatsFilteredParams{
			UserID:   userID,
			VendorID: vendorID,
		},
	)
}
