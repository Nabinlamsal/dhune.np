package repository

import (
	"context"
	"database/sql"

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

func (r *requestRepo) ListMarketplace(
	ctx context.Context,
	categoryId uuid.NullUUID,
	vendorLat *float64,
	vendorLng *float64,
	maxDistanceKm *float64,
	sortBy string,
	limit, offset int32,
) ([]db.ListMarketplaceRequestsRow, error) {
	var dbVendorLat sql.NullFloat64
	if vendorLat != nil {
		dbVendorLat = sql.NullFloat64{Float64: *vendorLat, Valid: true}
	}

	var dbVendorLng sql.NullFloat64
	if vendorLng != nil {
		dbVendorLng = sql.NullFloat64{Float64: *vendorLng, Valid: true}
	}

	var dbMaxDistance sql.NullFloat64
	if maxDistanceKm != nil {
		dbMaxDistance = sql.NullFloat64{Float64: *maxDistanceKm, Valid: true}
	}

	return r.q.ListMarketplaceRequests(ctx, db.ListMarketplaceRequestsParams{
		CategoryID:    categoryId,
		VendorLat:     dbVendorLat,
		VendorLng:     dbVendorLng,
		MaxDistanceKm: dbMaxDistance,
		SortBy:        sortBy,
		Limit:         limit,
		Offset:        offset,
	})
}

func (r *requestRepo) ListAdmin(
	ctx context.Context,
	status *db.RequestsStatus,
	limit, offset int32,
) ([]db.ListRequestsAdminRow, error) {

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

func (r *requestRepo) GetStatsFiltered(ctx context.Context, userID uuid.NullUUID) (db.GetRequestStatsFilteredRow, error) {
	return r.q.GetRequestStatsFiltered(ctx, userID)
}
