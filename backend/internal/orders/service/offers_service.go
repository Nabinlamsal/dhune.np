package service

import (
	"context"
	"database/sql"
	"errors"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/orders/repository"
	"github.com/google/uuid"
)

type OfferService struct {
	repo repository.OfferRepository
	sql  *sql.DB
}

func NewOfferService(
	repo repository.OfferRepository,
	sqlDB *sql.DB,
) *OfferService {
	return &OfferService{
		repo: repo,
		sql:  sqlDB,
	}
}

// Create new offer
func (s *OfferService) Create(
	ctx context.Context,
	params db.CreateOfferParams,
) (db.Offer, error) {

	return s.repo.Create(ctx, params)
}

// Update offer (only allowed if PENDING - enforced by SQL)
func (s *OfferService) Update(
	ctx context.Context,
	params db.UpdateOfferParams,
) (db.Offer, error) {

	return s.repo.Update(ctx, params)
}

// Withdraw offer (only allowed if PENDING - enforced by SQL)
func (s *OfferService) Withdraw(
	ctx context.Context,
	offerID uuid.UUID,
) error {

	return s.repo.Withdraw(ctx, offerID)
}

// List offers for a request
func (s *OfferService) ListByRequest(
	ctx context.Context,
	requestID uuid.UUID,
) ([]db.Offer, error) {

	return s.repo.ListByRequest(ctx, requestID)
}

// List vendor's own offers
func (s *OfferService) ListByVendor(
	ctx context.Context,
	vendorID uuid.UUID,
	limit,
	offset int32,
) ([]db.Offer, error) {

	return s.repo.ListByVendor(ctx, vendorID, limit, offset)
}

// Admin listing with filters
func (s *OfferService) ListAdmin(
	ctx context.Context,
	status *db.OfferStatus,
	vendorID *uuid.UUID,
	requestID *uuid.UUID,
	limit,
	offset int32,
) ([]db.Offer, error) {

	return s.repo.ListAdmin(ctx, status, vendorID, requestID, limit, offset)
}

// Expire pending offers (background job)
func (s *OfferService) Expire(ctx context.Context) error {
	return s.repo.Expire(ctx)
}

// Offer statistics
func (s *OfferService) GetStats(
	ctx context.Context,
) (db.GetOfferStatsRow, error) {

	return s.repo.GetStats(ctx)
}

// AcceptOfferFlow
func (s *OfferService) AcceptOfferFlow(
	ctx context.Context,
	offerID uuid.UUID,
	requestID uuid.UUID,
	orderParams db.CreateOrderParams,
) error {

	tx, err := s.sql.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	qtx := db.New(tx)

	//Accept the selected offer (only if PENDING)
	rowsAffected, err := qtx.AcceptOffer(ctx, offerID)
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return errors.New("offer not found or already processed")
	}

	//Reject all other offers for same request
	err = qtx.RejectOtherOffers(ctx, db.RejectOtherOffersParams{
		RequestID: requestID,
		ID:        offerID,
	})
	if err != nil {
		return err
	}

	//Create order
	_, err = qtx.CreateOrder(ctx, orderParams)
	if err != nil {
		return err
	}

	//Update request status → ORDER_CREATED
	err = qtx.SetRequestOrderCreated(ctx, requestID)
	if err != nil {
		return err
	}

	return tx.Commit()
}
