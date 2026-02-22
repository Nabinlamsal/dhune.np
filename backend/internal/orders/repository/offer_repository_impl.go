package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type offerRepository struct {
	q *db.Queries
}

func NewOfferRepositoryImpl(q *db.Queries) OfferRepository {
	return &offerRepository{q: q}
}

// Create new offer
func (r *offerRepository) Create(
	ctx context.Context,
	params db.CreateOfferParams,
) (db.Offer, error) {
	return r.q.CreateOffer(ctx, params)
}

// Update offer
func (r *offerRepository) Update(
	ctx context.Context,
	params db.UpdateOfferParams,
) (db.Offer, error) {
	return r.q.UpdateOffer(ctx, params)
}

// Withdraw offer
func (r *offerRepository) Withdraw(
	ctx context.Context,
	offerID uuid.UUID,
) error {
	return r.q.WithdrawOffer(ctx, offerID)
}

// List offers by request
func (r *offerRepository) ListByRequest(
	ctx context.Context,
	requestID uuid.UUID,
) ([]db.Offer, error) {
	return r.q.ListOffersByRequest(ctx, requestID)
}
func (r *offerRepository) GetByID(ctx context.Context, offerID uuid.UUID) (db.Offer, error) {
	return r.q.GetOfferByID(ctx, offerID)
}

// List offers by vendor
func (r *offerRepository) ListByVendor(
	ctx context.Context,
	vendorID uuid.UUID,
	status db.NullOfferStatus,
	sortBy string,
	limit int32,
	offset int32,
) ([]db.Offer, error) {

	return r.q.ListOffersByVendor(ctx, db.ListOffersByVendorParams{
		VendorID: vendorID,
		Status:   status,
		SortBy:   sortBy,
		Limit:    limit,
		Offset:   offset,
	})
}

func (r *offerRepository) ListAdmin(
	ctx context.Context,
	status db.NullOfferStatus,
	vendorID uuid.NullUUID,
	requestID uuid.NullUUID,
	limit,
	offset int32,
) ([]db.Offer, error) {

	return r.q.ListOffersAdmin(ctx, db.ListOffersAdminParams{
		Limit:     limit,
		Offset:    offset,
		Status:    status,
		VendorID:  vendorID,
		RequestID: requestID,
	})
}

// Accept offer (transactional)
func (r *offerRepository) Accept(
	ctx context.Context,
	tx *db.Queries,
	offerID uuid.UUID,
) (db.Offer, error) {

	return tx.AcceptOffer(ctx, offerID)
}

// Reject all other offers except accepted one (transactional)
func (r *offerRepository) RejectOthers(
	ctx context.Context,
	tx *db.Queries,
	requestID,
	acceptedOfferID uuid.UUID,
) error {

	return tx.RejectOtherOffers(ctx, db.RejectOtherOffersParams{
		RequestID: requestID,
		ID:        acceptedOfferID,
	})
}

// Expire old offers (cron job type logic)
func (r *offerRepository) Expire(ctx context.Context) error {
	return r.q.ExpireOffers(ctx)
}

// Offer statistics
func (r *offerRepository) GetStats(
	ctx context.Context,
) (db.GetOfferStatsRow, error) {

	return r.q.GetOfferStats(ctx)
}
