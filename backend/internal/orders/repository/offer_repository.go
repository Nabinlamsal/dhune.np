package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type OfferRepository interface {
	Create(ctx context.Context, params db.CreateOfferParams) (db.Offer, error)
	Update(ctx context.Context, params db.UpdateOfferParams) (db.Offer, error)
	Withdraw(ctx context.Context, offerID uuid.UUID) error

	ListByRequest(ctx context.Context, requestID uuid.UUID) ([]db.Offer, error)
	ListByVendor(
		ctx context.Context,
		vendorID uuid.UUID,
		status db.NullOfferStatus,
		sortBy string,
		limit int32,
		offset int32,
	) ([]db.Offer, error)

	ListAdmin(
		ctx context.Context,
		status db.NullOfferStatus,
		vendorID uuid.NullUUID,
		requestID uuid.NullUUID,
		limit,
		offset int32,
	) ([]db.Offer, error)

	GetByID(ctx context.Context, offerID uuid.UUID) (db.Offer, error)

	Accept(ctx context.Context, tx *db.Queries, offerID uuid.UUID) (db.Offer, error)
	RejectOthers(ctx context.Context, tx *db.Queries, requestID, acceptedOfferID uuid.UUID) error

	Expire(ctx context.Context) error
	GetStatsFiltered(
		ctx context.Context,
		vendorID uuid.NullUUID,
		requestID uuid.NullUUID,
	) (db.GetOfferStatsFilteredRow, error)
}
