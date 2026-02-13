package service

import (
	"context"
	"database/sql"
	"errors"
	"strconv"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/orders/repository"
	"github.com/google/uuid"
	"github.com/sqlc-dev/pqtype"
)

type OfferService struct {
	db          *sql.DB
	offerRepo   repository.OfferRepository
	orderRepo   repository.OrderRepository
	requestRepo repository.RequestRepository
}

func NewOfferService(
	db *sql.DB,
	offerRepo repository.OfferRepository,
	orderRepo repository.OrderRepository,
	requestRepo repository.RequestRepository,
) *OfferService {
	return &OfferService{
		db:          db,
		offerRepo:   offerRepo,
		orderRepo:   orderRepo,
		requestRepo: requestRepo,
	}
}

func (s *OfferService) Create(
	ctx context.Context,
	input CreateOfferInput,
) (*OfferSummary, error) {

	if input.BidPrice <= 0 {
		return nil, errors.New("invalid bid price")
	}

	offer, err := s.offerRepo.Create(ctx, db.CreateOfferParams{
		RequestID:      input.RequestID,
		VendorID:       input.VendorID,
		BidPrice:       strconv.FormatFloat(input.BidPrice, 'f', 2, 64),
		CompletionTime: input.CompletionTime,
		ServiceOptions: toNullJSON(input.ServiceOptions),
		Description:    toNullString(input.Description),
	})
	if err != nil {
		return nil, err
	}

	return mapOffer(offer), nil
}

func (s *OfferService) Update(
	ctx context.Context,
	input UpdateOfferInput,
) (*OfferSummary, error) {

	offer, err := s.offerRepo.Update(ctx, db.UpdateOfferParams{
		ID:             input.OfferID,
		BidPrice:       strconv.FormatFloat(input.BidPrice, 'f', 2, 64),
		CompletionTime: input.CompletionTime,
		ServiceOptions: toNullJSON(input.ServiceOptions),
		Description:    toNullString(input.Description),
	})
	if err != nil {
		return nil, err
	}

	return mapOffer(offer), nil
}

func (s *OfferService) Withdraw(
	ctx context.Context,
	offerID uuid.UUID,
) error {
	return s.offerRepo.Withdraw(ctx, offerID)
}

func (s *OfferService) Accept(
	ctx context.Context,
	input AcceptOfferInput,
) (*AcceptOfferResult, error) {

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	qtx := db.New(tx)

	// Accept offer
	rows, err := s.offerRepo.Accept(ctx, qtx, input.OfferID)
	if err != nil {
		return nil, err
	}

	if rows == 0 {
		return nil, errors.New("offer already accepted or invalid")
	}

	// Get offer inside transaction
	offer, err := qtx.GetOfferByID(ctx, input.OfferID)
	if err != nil {
		return nil, err
	}

	// Reject other offers
	err = s.offerRepo.RejectOthers(ctx, qtx, offer.RequestID, offer.ID)
	if err != nil {
		return nil, err
	}

	// Create order
	order, err := qtx.CreateOrder(ctx, db.CreateOrderParams{
		RequestID:  offer.RequestID,
		OfferID:    offer.ID,
		UserID:     input.UserID,
		VendorID:   offer.VendorID,
		FinalPrice: offer.BidPrice,
		PickupTime: sql.NullTime{
			Time:  offer.CompletionTime,
			Valid: true,
		},
	})
	if err != nil {
		return nil, err
	}

	// Mark request as ORDER_CREATED
	err = qtx.SetRequestOrderCreated(ctx, offer.RequestID)
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &AcceptOfferResult{
		OrderID: order.ID,
	}, nil
}

func (s *OfferService) ListByRequest(
	ctx context.Context,
	requestID uuid.UUID,
) ([]db.Offer, error) {

	return s.offerRepo.ListByRequest(ctx, requestID)
}

func (s *OfferService) ListByVendor(
	ctx context.Context,
	vendorID uuid.UUID,
	limit,
	offset int32,
) ([]db.Offer, error) {

	return s.offerRepo.ListByVendor(ctx, vendorID, limit, offset)
}

func (s *OfferService) ListAdmin(
	ctx context.Context,
	status *db.OfferStatus,
	vendorID *uuid.UUID,
	requestID *uuid.UUID,
	limit,
	offset int32,
) ([]db.Offer, error) {

	return s.offerRepo.ListAdmin(ctx, status, vendorID, requestID, limit, offset)
}

func (s *OfferService) Expire(ctx context.Context) error {
	return s.offerRepo.Expire(ctx)
}

func (s *OfferService) GetStats(
	ctx context.Context,
) (db.GetOfferStatsRow, error) {

	return s.offerRepo.GetStats(ctx)
}

func (s *OfferService) GetByID(
	ctx context.Context,
	offerID uuid.UUID,
) (*OfferSummary, error) {

	offer, err := s.offerRepo.GetByID(ctx, offerID)
	if err != nil {
		return nil, err
	}

	return mapOffer(offer), nil
}

func toNullString(s *string) sql.NullString {
	if s == nil {
		return sql.NullString{}
	}
	return sql.NullString{
		String: *s,
		Valid:  true,
	}
}

func mapOffer(o db.Offer) *OfferSummary {

	price, _ := strconv.ParseFloat(o.BidPrice, 64)

	return &OfferSummary{
		ID:        o.ID,
		RequestID: o.RequestID,
		VendorID:  o.VendorID,
		BidPrice:  price,
		Status:    string(o.Status),
		CreatedAt: o.CreatedAt,
	}
}

func toNullJSON(b []byte) pqtype.NullRawMessage {
	if b == nil {
		return pqtype.NullRawMessage{}
	}
	return pqtype.NullRawMessage{
		RawMessage: b,
		Valid:      true,
	}
}
