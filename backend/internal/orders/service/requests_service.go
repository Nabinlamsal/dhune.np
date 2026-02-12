package service

import (
	"context"
	"errors"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/orders/repository"
	"github.com/google/uuid"
)

type RequestService struct {
	repo repository.RequestRepository
}

func NewRequestService(repo repository.RequestRepository) *RequestService {
	return &RequestService{
		repo: repo,
	}
}

// Create new request
func (s *RequestService) Create(
	ctx context.Context,
	params db.CreateRequestParams,
) (db.Request, error) {

	return s.repo.Create(ctx, params)
}

// Add service to request
func (s *RequestService) AddService(
	ctx context.Context,
	params db.AddRequestServiceParams,
) (db.RequestService, error) {

	return s.repo.AddService(ctx, params)
}

// Get request with its services
func (s *RequestService) GetWithServices(
	ctx context.Context,
	requestID uuid.UUID,
) ([]db.GetRequestWithServicesRow, error) {

	return s.repo.GetWithServices(ctx, requestID)
}

// List user requests
func (s *RequestService) ListByUser(
	ctx context.Context,
	userID uuid.UUID,
	limit,
	offset int32,
) ([]db.Request, error) {

	return s.repo.ListByUser(ctx, userID, limit, offset)
}

// Marketplace listing
func (s *RequestService) ListMarketplace(
	ctx context.Context,
	limit,
	offset int32,
) ([]db.Request, error) {

	return s.repo.ListMarketplace(ctx, limit, offset)
}

// Admin listing (optional status filter)
func (s *RequestService) ListAdmin(
	ctx context.Context,
	status *db.RequestsStatus,
	limit,
	offset int32,
) ([]db.Request, error) {

	return s.repo.ListAdmin(ctx, status, limit, offset)
}

// Cancel request (with business rule)
func (s *RequestService) Cancel(
	ctx context.Context,
	requestID uuid.UUID,
) error {

	rows, err := s.repo.GetWithServices(ctx, requestID)
	if err != nil {
		return err
	}

	if len(rows) == 0 {
		return errors.New("request not found")
	}

	if rows[0].Status != db.RequestsStatusOPEN {
		return errors.New("only pending requests can be cancelled")
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
