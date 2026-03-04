package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type OrderRepository interface {
	Create(ctx context.Context, params db.CreateOrderParams) (db.Order, error)

	// dashboards
	ListByUser(
		ctx context.Context,
		userID uuid.UUID,
		limit int32,
		offset int32,
	) ([]db.ListOrdersByUserRow, error)

	ListByVendor(
		ctx context.Context,
		vendorID uuid.UUID,
		status db.NullOrderStatus,
		limit int32,
		offset int32,
	) ([]db.ListOrdersByVendorRow, error)

	ListAdmin(
		ctx context.Context,
		status db.NullOrderStatus,
		limit int32,
		offset int32,
	) ([]db.ListOrdersAdminRow, error)

	// detail page
	GetDetail(
		ctx context.Context,
		orderID uuid.UUID,
	) (db.GetOrderDetailRow, error)

	// status management
	UpdateStatus(ctx context.Context, orderID uuid.UUID, status db.OrderStatus) error
	Cancel(ctx context.Context, orderID uuid.UUID) error

	MarkPaid(ctx context.Context, orderID uuid.UUID) error
	MarkRefunded(ctx context.Context, orderID uuid.UUID) error

	GetStatsFiltered(
		ctx context.Context,
		userID uuid.NullUUID,
		vendorID uuid.NullUUID,
	) (db.GetOrderStatsFilteredRow, error)
}
