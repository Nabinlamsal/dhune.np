package service

import (
	"context"
	"database/sql"
	"errors"

	"github.com/Nabinlamsal/dhune.np/internal/catalog/service"
	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/orders/repository"
	"github.com/google/uuid"
	"github.com/sqlc-dev/pqtype"
)

type RequestService struct {
	db        *sql.DB
	repo      repository.RequestRepository
	validator service.CategoryValidator
}

func NewRequestService(
	db *sql.DB,
	repo repository.RequestRepository,
	validator service.CategoryValidator,
) *RequestService {
	return &RequestService{
		db:        db,
		repo:      repo,
		validator: validator,
	}
}

// Create new request
func (s *RequestService) Create(
	ctx context.Context,
	input CreateRequestInput,
) (*RequestDetail, error) {

	if input.PickupTimeTo.Before(input.PickupTimeFrom) {
		return nil, errors.New("invalid pickup time range")
	}

	if len(input.Services) == 0 {
		return nil, errors.New("request must contain at least one service")
	}

	// Validate all services BEFORE starting transaction
	for _, svc := range input.Services {
		if err := s.validator.ValidateCategory(
			ctx,
			svc.CategoryID,
			string(svc.SelectedUnit),
		); err != nil {
			return nil, err
		}
	}

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	qtx := db.New(tx)
	txRepo := repository.NewRequestRepositoryImpl(qtx)

	var expires sql.NullTime
	if input.ExpiresAt != nil {
		expires = sql.NullTime{
			Time:  *input.ExpiresAt,
			Valid: true,
		}
	}

	req, err := txRepo.Create(ctx, db.CreateRequestParams{
		UserID:         input.UserID,
		PickupAddress:  input.PickupAddress,
		PickupTimeFrom: input.PickupTimeFrom,
		PickupTimeTo:   input.PickupTimeTo,
		PaymentMethod:  input.PaymentMethod,
		ExpiresAt:      expires,
	})
	if err != nil {
		return nil, err
	}

	for _, svc := range input.Services {

		var desc sql.NullString
		if svc.Description != nil {
			desc = sql.NullString{
				String: *svc.Description,
				Valid:  true,
			}
		}

		var items pqtype.NullRawMessage
		if svc.ItemsJSON != nil {
			items = pqtype.NullRawMessage{
				RawMessage: svc.ItemsJSON,
				Valid:      true,
			}
		}

		_, err = txRepo.AddService(ctx, db.AddRequestServiceParams{
			RequestID:     req.ID,
			CategoryID:    svc.CategoryID,
			SelectedUnit:  svc.SelectedUnit,
			QuantityValue: svc.QuantityValue,
			ItemsJson:     items,
			Description:   desc,
		})
		if err != nil {
			return nil, err
		}
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return s.GetDetail(ctx, req.ID)
}

// get details
func (s *RequestService) GetDetail(
	ctx context.Context,
	requestID uuid.UUID,
) (*RequestDetail, error) {

	rows, err := s.repo.GetWithServices(ctx, requestID)
	if err != nil {
		return nil, err
	}

	if len(rows) == 0 {
		return nil, errors.New("request not found")
	}

	first := rows[0]

	result := &RequestDetail{
		ID:             first.ID,
		UserID:         first.UserID,
		PickupAddress:  first.PickupAddress,
		PickupTimeFrom: first.PickupTimeFrom,
		PickupTimeTo:   first.PickupTimeTo,
		PaymentMethod:  first.PaymentMethod,
		Status:         first.Status,
		CreatedAt:      first.CreatedAt,
	}

	if first.ExpiresAt.Valid {
		result.ExpiresAt = &first.ExpiresAt.Time
	}

	for _, r := range rows {

		if !r.ServiceID.Valid {
			continue
		}

		item := RequestServiceItem{
			ServiceID:     r.ServiceID.UUID,
			CategoryID:    r.CategoryID.UUID,
			SelectedUnit:  r.SelectedUnit.PricingUnit,
			QuantityValue: r.QuantityValue.Float64,
		}

		if r.Description.Valid {
			desc := r.Description.String
			item.Description = &desc
		}

		if r.ItemsJson.Valid {
			item.ItemsJSON = r.ItemsJson.RawMessage
		}

		result.Services = append(result.Services, item)
	}

	return result, nil
}

func (s *RequestService) ListByUser(
	ctx context.Context,
	userID uuid.UUID,
	limit, offset int32,
) ([]RequestSummary, error) {

	rows, err := s.repo.ListByUser(ctx, userID, limit, offset)
	if err != nil {
		return nil, err
	}

	var result []RequestSummary
	for _, r := range rows {
		result = append(result, RequestSummary{
			ID:            r.ID,
			UserID:        r.UserID,
			PickupAddress: r.PickupAddress,
			Status:        r.Status,
			CreatedAt:     r.CreatedAt,
		})
	}

	return result, nil
}

// Marketplace listing
func (s *RequestService) ListMarketplace(
	ctx context.Context,
	categoryID *uuid.UUID,
	limit,
	offset int32,
) ([]RequestSummary, error) {

	var dbCategory uuid.NullUUID
	if categoryID != nil {
		dbCategory = uuid.NullUUID{
			UUID:  *categoryID,
			Valid: true,
		}
	}

	rows, err := s.repo.ListMarketplace(ctx, dbCategory, limit, offset)
	if err != nil {
		return nil, err
	}

	var result []RequestSummary

	for _, r := range rows {
		result = append(result, RequestSummary{
			ID:            r.ID,
			UserID:        r.UserID,
			PickupAddress: r.PickupAddress,
			Status:        r.Status,
			CreatedAt:     r.CreatedAt,
		})
	}

	return result, nil
}

// Admin listing (optional status filter)
func (s *RequestService) ListAdmin(
	ctx context.Context,
	status *db.RequestsStatus,
	limit,
	offset int32,
) ([]RequestSummary, error) {

	rows, err := s.repo.ListAdmin(ctx, status, limit, offset)
	if err != nil {
		return nil, err
	}

	var result []RequestSummary

	for _, r := range rows {
		result = append(result, RequestSummary{
			ID:            r.ID,
			UserID:        r.UserID,
			PickupAddress: r.PickupAddress,
			Status:        r.Status,
			CreatedAt:     r.CreatedAt,
		})
	}

	return result, nil
}

// Cancel request (with business rule)
func (s *RequestService) Cancel(
	ctx context.Context,
	requestID uuid.UUID,
) error {

	detail, err := s.GetDetail(ctx, requestID)
	if err != nil {
		return err
	}

	if detail.Status != db.RequestsStatusOPEN {
		return errors.New("only OPEN requests can be cancelled")
	}

	return s.repo.Cancel(ctx, requestID)
}

// Mark request as order created
func (s *RequestService) SetOrderCreated(
	ctx context.Context,
	requestID uuid.UUID,
) error {

	return s.repo.SetOrderCreated(ctx, requestID)
}

// Expire old requests (cron job)
func (s *RequestService) Expire(ctx context.Context) error {
	return s.repo.Expire(ctx)
}

// Request statistics
func (s *RequestService) GetStats(
	ctx context.Context,
) (db.GetRequestStatsRow, error) {

	return s.repo.GetStats(ctx)
}
