package service

import (
	"context"
	"database/sql"
	"errors"
	"strconv"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/events"
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

	result := mapOffer(offer)

	events.EmitEvent(events.Event{
		Type: "OFFER_CREATED",
		Data: events.NotificationEvent{
			Title:   "New offer received",
			Body:    "A vendor sent a new offer for your request.",
			UserIDs: []string{request.UserID.String()},
			Persist: true,
			Push:    true,
			Data: map[string]interface{}{
				"offer_id":   offer.ID.String(),
				"request_id": input.RequestID.String(),
				"vendor_id":  input.VendorID.String(),
				"status":     result.Status,
				"bid_price":  result.BidPrice,
			},
			EntityType:  "offer",
			EntityID:    offer.ID.String(),
			ActorUserID: input.VendorID.String(),
		},
	})

	return result, nil
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

	result := mapOffer(offer)

	requestRows, err := s.requestRepo.GetWithServices(ctx, offer.RequestID)
	if err == nil && len(requestRows) > 0 {
		events.EmitEvent(events.Event{
			Type: "OFFER_UPDATED",
			Data: events.NotificationEvent{
				Title:   "Offer updated",
				Body:    "A vendor updated an offer on your request.",
				UserIDs: []string{requestRows[0].UserID.String()},
				Persist: true,
				Push:    true,
				Data: map[string]interface{}{
					"offer_id":   offer.ID.String(),
					"request_id": offer.RequestID.String(),
					"vendor_id":  offer.VendorID.String(),
					"status":     result.Status,
					"bid_price":  result.BidPrice,
				},
				EntityType:  "offer",
				EntityID:    offer.ID.String(),
				ActorUserID: offer.VendorID.String(),
			},
		})
	}

	return result, nil
}

func (s *OfferService) Withdraw(
	ctx context.Context,
	offerID uuid.UUID,
) error {
	offer, err := s.offerRepo.GetByID(ctx, offerID)
	if err != nil {
		return err
	}

	if err := s.offerRepo.Withdraw(ctx, offerID); err != nil {
		return err
	}

	requestRows, err := s.requestRepo.GetWithServices(ctx, offer.RequestID)
	if err == nil && len(requestRows) > 0 {
		events.EmitEvent(events.Event{
			Type: "OFFER_WITHDRAWN",
			Data: events.NotificationEvent{
				Title:   "Offer withdrawn",
				Body:    "A vendor withdrew an offer from your request.",
				UserIDs: []string{requestRows[0].UserID.String()},
				Persist: true,
				Push:    true,
				Data: map[string]interface{}{
					"offer_id":   offer.ID.String(),
					"request_id": offer.RequestID.String(),
					"vendor_id":  offer.VendorID.String(),
					"status":     string(db.OfferStatusWITHDRAWN),
				},
				EntityType:  "offer",
				EntityID:    offer.ID.String(),
				ActorUserID: offer.VendorID.String(),
			},
		})
	}

	return nil
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

	userID := request[0].UserID.String()
	vendorID := offer.VendorID.String()
	orderID := order.ID.String()
	requestID := offer.RequestID.String()
	offerID := offer.ID.String()

	events.EmitEvent(events.Event{
		Type: "OFFER_ACCEPTED",
		Data: events.NotificationEvent{
			Title:   "Offer accepted",
			Body:    "Your offer has been accepted by the customer.",
			UserIDs: []string{vendorID},
			Persist: true,
			Push:    true,
			Data: map[string]interface{}{
				"offer_id":     offerID,
				"request_id":   requestID,
				"order_id":     orderID,
				"vendor_id":    vendorID,
				"user_id":      userID,
				"offer_status": string(db.OfferStatusACCEPTED),
			},
			EntityType:  "offer",
			EntityID:    offerID,
			ActorUserID: userID,
		},
	})

	events.EmitEvent(events.Event{
		Type: "ORDER_CREATED",
		Data: events.NotificationEvent{
			Title:   "Order created",
			Body:    "A new order has been created from an accepted offer.",
			UserIDs: []string{userID, vendorID},
			Roles:   []string{"admin"},
			Persist: true,
			Push:    true,
			Data: map[string]interface{}{
				"order_id":   orderID,
				"request_id": requestID,
				"offer_id":   offerID,
				"user_id":    userID,
				"vendor_id":  vendorID,
				"status":     string(db.OrderStatusACCEPTED),
			},
			EntityType:  "order",
			EntityID:    orderID,
			ActorUserID: userID,
		},
	})

	return &AcceptOfferResult{
		OrderID: order.ID,
	}, nil
}

func (s *OfferService) ListByRequest(
	ctx context.Context,
	requestID uuid.UUID,
) ([]OfferSummary, error) {

	rows, err := s.offerRepo.ListByRequest(ctx, requestID)
	if err != nil {
		return nil, err
	}

	result := make([]OfferSummary, 0, len(rows))
	for _, row := range rows {
		price, _ := strconv.ParseFloat(row.BidPrice, 64)

		var description *string
		if row.Description.Valid {
			description = &row.Description.String
		}

		averageRating := row.AverageRating

		result = append(result, OfferSummary{
			ID:             row.ID,
			RequestID:      row.RequestID,
			VendorID:       row.VendorID,
			VendorName:     row.VendorName,
			BidPrice:       price,
			AverageRating:  &averageRating,
			TotalRatings:   row.TotalRatings,
			Description:    description,
			Status:         string(row.Status),
			CompletionTime: row.CompletionTime,
			CreatedAt:      row.CreatedAt,
		})
	}

	return result, nil
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
		Description:    nullStringPtr(o.Description),
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

func nullStringPtr(v sql.NullString) *string {
	if !v.Valid {
		return nil
	}
	value := v.String
	return &value
}
