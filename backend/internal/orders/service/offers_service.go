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

	// Validate request exists & open
	requestRows, err := s.requestRepo.GetWithServices(ctx, input.RequestID)
	if err != nil || len(requestRows) == 0 {
		return nil, errors.New("request not found")
	}

	request := requestRows[0]

	if request.Status != db.RequestsStatusOPEN {
		return nil, errors.New("cannot bid on closed request")
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

	// Accept offer (returns updated row)
	offer, err := s.offerRepo.Accept(ctx, qtx, input.OfferID)
	if err != nil {
		return nil, errors.New("offer already accepted or invalid")
	}

	// Validate request belongs to user
	request, err := s.requestRepo.GetWithServices(ctx, offer.RequestID)
	if err != nil {
		return nil, err
	}

	if request[0].UserID != input.UserID {
		return nil, errors.New("unauthorized accept")
	}

	// Reject others
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
	if err := qtx.SetRequestOrderCreated(ctx, offer.RequestID); err != nil {
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
	status *string,
	sortBy string,
	limit,
	offset int32,
) ([]db.Offer, error) {
	var dbStatus db.NullOfferStatus

	if status != nil {
		dbStatus = db.NullOfferStatus{
			OfferStatus: db.OfferStatus(*status),
			Valid:       true,
		}
	}

	if sortBy == "" {
		sortBy = "newest"
	}

	return s.offerRepo.ListByVendor(
		ctx,
		vendorID,
		dbStatus,
		sortBy,
		limit,
		offset,
	)
}

func (s *OfferService) ListAdmin(
	ctx context.Context,
	status db.NullOfferStatus,
	vendorID uuid.NullUUID,
	requestID uuid.NullUUID,
	limit,
	offset int32,
) ([]OfferSummary, error) {

	offers, err := s.offerRepo.ListAdmin(ctx, status, vendorID, requestID, limit, offset)
	if err != nil {
		return nil, err
	}

	var result []OfferSummary
	for _, o := range offers {
		result = append(result, *mapOffer(o))
	}

	return result, nil
}

func (s *OfferService) Expire(ctx context.Context) error {
	return s.offerRepo.Expire(ctx)
}

func (s *OfferService) GetAdminStats(
	ctx context.Context,
) (db.GetOfferStatsFilteredRow, error) {

	return s.offerRepo.GetStatsFiltered(
		ctx,
		uuid.NullUUID{},
		uuid.NullUUID{},
	)
}

func (s *OfferService) GetVendorStats(
	ctx context.Context,
	vendorID uuid.UUID,
) (db.GetOfferStatsFilteredRow, error) {

	return s.offerRepo.GetStatsFiltered(
		ctx,
		uuid.NullUUID{
			UUID:  vendorID,
			Valid: true,
		},
		uuid.NullUUID{},
	)
}

func (s *OfferService) GetRequestStats(
	ctx context.Context,
	requestID uuid.UUID,
) (db.GetOfferStatsFilteredRow, error) {

	return s.offerRepo.GetStatsFiltered(
		ctx,
		uuid.NullUUID{},
		uuid.NullUUID{
			UUID:  requestID,
			Valid: true,
		},
	)
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
		ID:             o.ID,
		RequestID:      o.RequestID,
		VendorID:       o.VendorID,
		BidPrice:       price,
		Status:         string(o.Status),
		CompletionTime: o.CompletionTime,
		CreatedAt:      o.CreatedAt,
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
