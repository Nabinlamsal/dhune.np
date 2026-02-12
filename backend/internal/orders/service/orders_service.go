package service

import (
	"context"
	"errors"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/orders/repository"
	"github.com/google/uuid"
)

type OrderService struct {
	repo repository.OrderRepository
}

func NewOrderService(repo repository.OrderRepository) *OrderService {
	return &OrderService{
		repo: repo,
	}
}

// basic operations
// List user orders
func (s *OrderService) ListByUser(
	ctx context.Context,
	userID uuid.UUID,
	limit,
	offset int32,
) ([]db.Order, error) {

	return s.repo.ListByUser(ctx, userID, limit, offset)
}

// List vendor orders
func (s *OrderService) ListByVendor(
	ctx context.Context,
	vendorID uuid.UUID,
	limit,
	offset int32,
) ([]db.Order, error) {

	return s.repo.ListByVendor(ctx, vendorID, limit, offset)
}

// Get single order
func (s *OrderService) GetByID(
	ctx context.Context,
	orderID uuid.UUID,
) (db.Order, error) {

	return s.repo.GetByID(ctx, orderID)
}

// Admin listing
func (s *OrderService) ListAdmin(
	ctx context.Context,
	status *db.OrderStatus,
	limit,
	offset int32,
) ([]db.Order, error) {

	return s.repo.ListAdmin(ctx, status, limit, offset)
}

// Order statistics
func (s *OrderService) GetStats(
	ctx context.Context,
) (db.GetOrderStatsRow, error) {

	return s.repo.GetStats(ctx)
}

// status transition
// Update order status with strict transition rules
func (s *OrderService) UpdateStatus(
	ctx context.Context,
	orderID uuid.UUID,
	newStatus db.OrderStatus,
) error {

	order, err := s.repo.GetByID(ctx, orderID)
	if err != nil {
		return err
	}

	if !isValidTransition(order.OrderStatus, newStatus) {
		return errors.New("invalid order status transition")
	}

	return s.repo.UpdateStatus(ctx, orderID, newStatus)
}

//business actions

// Cancel order (allowed only before IN_PROGRESS)
func (s *OrderService) Cancel(
	ctx context.Context,
	orderID uuid.UUID,
) error {

	order, err := s.repo.GetByID(ctx, orderID)
	if err != nil {
		return err
	}

	if order.OrderStatus == db.OrderStatusCOMPLETED ||
		order.OrderStatus == db.OrderStatusCANCELLED ||
		order.OrderStatus == db.OrderStatusPICKEDUP {
		return errors.New("order cannot be cancelled")
	}

	return s.repo.UpdateStatus(ctx, orderID, db.OrderStatusCANCELLED)
}

// Mark order completed
func (s *OrderService) MarkCompleted(
	ctx context.Context,
	orderID uuid.UUID,
) error {

	order, err := s.repo.GetByID(ctx, orderID)
	if err != nil {
		return err
	}

	if order.OrderStatus != db.OrderStatusDELIVERING {
		return errors.New("order must be delivering to mark completed")
	}

	return s.repo.UpdateStatus(ctx, orderID, db.OrderStatusCOMPLETED)
}

//// Open dispute (only allowed after completion)
//func (s *OrderService) OpenDispute(
//	ctx context.Context,
//	orderID uuid.UUID,
//) error {
//
//	order, err := s.repo.GetByID(ctx, orderID)
//	if err != nil {
//		return err
//	}
//
//	if order.OrderStatus != db.OrderStatusCOMPLETED {
//		return errors.New("dispute can only be opened after completion")
//	}
//
//	return s.repo.UpdateStatus(ctx, orderID, db.OrderStatusDISPUTED)
//}

// transaction logic
func isValidTransition(
	current db.OrderStatus,
	next db.OrderStatus,
) bool {

	switch current {

	case db.OrderStatusACCEPTED:
		return next == db.OrderStatusPICKEDUP ||
			next == db.OrderStatusCANCELLED

	case db.OrderStatusPICKEDUP:
		return next == db.OrderStatusINPROGRESS

	case db.OrderStatusINPROGRESS:
		return next == db.OrderStatusDELIVERING

	case db.OrderStatusDELIVERING:
		return next == db.OrderStatusCOMPLETED

	case db.OrderStatusCOMPLETED,
		db.OrderStatusCANCELLED:
		return false
	}
	return false
}
