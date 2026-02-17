package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type requestRepo struct {
	q *db.Queries
}

func NewRequestRepositoryImpl(q *db.Queries) RequestRepository {
	return &requestRepo{q: q}
}

func (r *requestRepo) Create(ctx context.Context, params db.CreateRequestParams) (db.Request, error) {
	return r.q.CreateRequest(ctx, params)
}

func (r *requestRepo) AddService(ctx context.Context, params db.AddRequestServiceParams) (db.RequestService, error) {
	return r.q.AddRequestService(ctx, params)
}

func (r *requestRepo) GetWithServices(ctx context.Context, requestID uuid.UUID) ([]db.GetRequestWithServicesRow, error) {
	return r.q.GetRequestWithServices(ctx, requestID)
}

func (r *requestRepo) ListByUser(ctx context.Context, userID uuid.UUID, limit, offset int32) ([]db.Request, error) {
	return r.q.ListUserRequests(ctx, db.ListUserRequestsParams{
		UserID: userID,
		Limit:  limit,
		Offset: offset,
	})
}

func (r *requestRepo) ListMarketplace(ctx context.Context, limit, offset int32) ([]db.Request, error) {
	return r.q.ListMarketplaceRequests(ctx, db.ListMarketplaceRequestsParams{
		Limit:  limit,
		Offset: offset,
	})
}

func (r *requestRepo) ListAdmin(
	ctx context.Context,
	status *db.RequestsStatus,
	limit, offset int32,
) ([]db.Request, error) {

	var nullableStatus db.NullRequestsStatus

	if status != nil {
		nullableStatus = db.NullRequestsStatus{
			RequestsStatus: *status,
			Valid:          true,
		}
	} else {
		nullableStatus = db.NullRequestsStatus{
			Valid: false,
		}
	}

	return r.q.ListRequestsAdmin(ctx, db.ListRequestsAdminParams{
		Status: nullableStatus,
		Limit:  limit,
		Offset: offset,
	})
}

func (r *requestRepo) Cancel(ctx context.Context, requestID uuid.UUID) error {
	return r.q.CancelRequest(ctx, requestID)
}

func (r *requestRepo) SetOrderCreated(ctx context.Context, requestID uuid.UUID) error {
	return r.q.SetRequestOrderCreated(ctx, requestID)
}

func (r *requestRepo) Expire(ctx context.Context) error {
	return r.q.ExpireRequests(ctx)
}

func (r *requestRepo) GetStats(ctx context.Context) (db.GetRequestStatsRow, error) {
	return r.q.GetRequestStats(ctx)
}
