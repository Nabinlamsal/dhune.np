package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type OrderRepository interface {
	Create(ctx context.Context, params db.CreateOrderParams) (db.Order, error)

	ListByUser(ctx context.Context, userID uuid.UUID, limit, offset int32) ([]db.Order, error)
	ListByVendor(ctx context.Context, vendorID uuid.UUID, status db.NullOrderStatus,
		sortBy string, limit, offset int32) ([]db.Order, error)

	GetByID(ctx context.Context, orderID uuid.UUID) (db.Order, error)

	UpdateStatus(ctx context.Context, orderID uuid.UUID, status db.OrderStatus) error
	Cancel(ctx context.Context, orderID uuid.UUID) error

	MarkPaid(ctx context.Context, orderID uuid.UUID) error
	MarkRefunded(ctx context.Context, orderID uuid.UUID) error

	ListAdmin(ctx context.Context, status db.NullOrderStatus, limit, offset int32) ([]db.Order, error)

	GetStatsFiltered(
		ctx context.Context,
		userID uuid.NullUUID,
		vendorID uuid.NullUUID,
	) (db.GetOrderStatsFilteredRow, error)
}
