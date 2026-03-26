package ratings

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type Repository interface {
	UpsertOrderRating(
		ctx context.Context,
		orderID uuid.UUID,
		rating int16,
		review string,
		userID uuid.UUID,
	) (db.Rating, error)

	ListVendorRatings(
		ctx context.Context,
		vendorID uuid.UUID,
		limit int32,
		offset int32,
	) ([]db.ListVendorRatingsRow, error)

	GetVendorRatingSummary(
		ctx context.Context,
		vendorID uuid.UUID,
	) (db.GetVendorRatingSummaryRow, error)

	ListTopRatedVendors(
		ctx context.Context,
		limit int32,
		offset int32,
	) ([]db.ListTopRatedVendorsRow, error)
}

type repository struct {
	q *db.Queries
}

func NewRepository(q *db.Queries) Repository {
	return &repository{q: q}
}

func (r *repository) UpsertOrderRating(
	ctx context.Context,
	orderID uuid.UUID,
	rating int16,
	review string,
	userID uuid.UUID,
) (db.Rating, error) {
	return r.q.UpsertOrderRating(ctx, db.UpsertOrderRatingParams{
		Rating:  rating,
		Review:  review,
		OrderID: orderID,
		UserID:  userID,
	})
}

func (r *repository) ListVendorRatings(
	ctx context.Context,
	vendorID uuid.UUID,
	limit int32,
	offset int32,
) ([]db.ListVendorRatingsRow, error) {
	return r.q.ListVendorRatings(ctx, db.ListVendorRatingsParams{
		VendorID: vendorID,
		Limit:    limit,
		Offset:   offset,
	})
}

func (r *repository) GetVendorRatingSummary(
	ctx context.Context,
	vendorID uuid.UUID,
) (db.GetVendorRatingSummaryRow, error) {
	return r.q.GetVendorRatingSummary(ctx, vendorID)
}

func (r *repository) ListTopRatedVendors(
	ctx context.Context,
	limit int32,
	offset int32,
) ([]db.ListTopRatedVendorsRow, error) {
	return r.q.ListTopRatedVendors(ctx, db.ListTopRatedVendorsParams{
		Limit:  limit,
		Offset: offset,
	})
}
