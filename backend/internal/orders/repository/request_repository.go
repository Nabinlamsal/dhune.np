package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type RequestRepository interface {
	Create(ctx context.Context, params db.CreateRequestParams) (db.Request, error)
	AddService(ctx context.Context, params db.AddRequestServiceParams) (db.RequestService, error)

	GetWithServices(ctx context.Context, requestID uuid.UUID) ([]db.GetRequestWithServicesRow, error)
	ListByUser(ctx context.Context, userID uuid.UUID, limit, offset int32) ([]db.Request, error)
	ListMarketplace(ctx context.Context, categoryID uuid.NullUUID, limit, offset int32) ([]db.ListMarketplaceRequestsRow, error)
	ListAdmin(ctx context.Context, status *db.RequestsStatus, limit, offset int32) ([]db.Request, error)

	Cancel(ctx context.Context, requestID uuid.UUID) error
	SetOrderCreated(ctx context.Context, requestID uuid.UUID) error

	Expire(ctx context.Context) error
	GetStats(ctx context.Context) (db.GetRequestStatsRow, error)
}
