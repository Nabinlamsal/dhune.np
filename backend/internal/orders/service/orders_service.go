package service

import (
	"context"
	"errors"
	"strconv"
	"time"

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

// get by id
func (s *OrderService) GetByID(
	ctx context.Context,
	orderID uuid.UUID,
) (*OrderSummary, error) {

	order, err := s.repo.GetByID(ctx, orderID)
	if err != nil {
		return nil, err
	}

	return mapOrder(order), nil
}

// list by user
func (s *OrderService) ListByUser(
	ctx context.Context,
	userID uuid.UUID,
	limit, offset int32,
) ([]OrderSummary, error) {

	orders, err := s.repo.ListByUser(ctx, userID, limit, offset)
	if err != nil {
		return nil, err
	}

	var result []OrderSummary
	for _, o := range orders {
		result = append(result, *mapOrder(o))
	}

	return result, nil
}

// list by vendor
func (s *OrderService) ListByVendor(
	ctx context.Context,
	vendorID uuid.UUID,
	status *string,
	sortBy string,
	limit, offset int32,
) ([]OrderSummary, error) {
	var dbStatus db.NullOrderStatus

	if status != nil {
		dbStatus = db.NullOrderStatus{
			OrderStatus: db.OrderStatus(*status),
			Valid:       true,
		}
	}

	if sortBy == "" {
		sortBy = "newest"
	}

	orders, err := s.repo.ListByVendor(ctx, vendorID, dbStatus, sortBy, limit, offset)
	if err != nil {
		return nil, err
	}

	var result []OrderSummary
	for _, o := range orders {
		result = append(result, *mapOrder(o))
	}

	return result, nil
}

// update status
func (s *OrderService) UpdateStatus(
	ctx context.Context,
	input UpdateOrderStatusInput,
) error {

	//Get current order
	order, err := s.repo.GetByID(ctx, input.OrderID)
	if err != nil {
		return err
	}

	current := order.OrderStatus
	next := db.OrderStatus(input.Status)

	//Validate transition
	if !isValidTransition(current, next) {
		return errors.New("invalid order status transition")
	}

	// 3Update
	return s.repo.UpdateStatus(ctx, input.OrderID, next)
}

// cancel order
func (s *OrderService) Cancel(
	ctx context.Context,
	orderID uuid.UUID,
) error {

	order, err := s.repo.GetByID(ctx, orderID)
	if err != nil {
		return err
	}

	if order.OrderStatus != db.OrderStatusACCEPTED {
		return errors.New("order cannot be cancelled")
	}

	return s.repo.Cancel(ctx, orderID)
}

// mark as paid
func (s *OrderService) MarkPaid(
	ctx context.Context,
	orderID uuid.UUID,
) error {

	return s.repo.MarkPaid(ctx, orderID)
}

// mark as refunded
func (s *OrderService) MarkRefunded(
	ctx context.Context,
	orderID uuid.UUID,
) error {

	return s.repo.MarkRefunded(ctx, orderID)
}

// admin order listing
func (s *OrderService) ListAdmin(
	ctx context.Context,
	status *string,
	limit, offset int32,
) ([]OrderSummary, error) {

	var dbStatus db.NullOrderStatus

	if status != nil {
		dbStatus = db.NullOrderStatus{
			OrderStatus: db.OrderStatus(*status),
			Valid:       true,
		}
	}

	orders, err := s.repo.ListAdmin(ctx, dbStatus, limit, offset)
	if err != nil {
		return nil, err
	}

	var result []OrderSummary
	for _, o := range orders {
		result = append(result, *mapOrder(o))
	}

	return result, nil
}

func (s *OrderService) GetStats(
	ctx context.Context,
) (db.GetOrderStatsRow, error) {

	return s.repo.GetStats(ctx)
}

// helper function
func mapOrder(o db.Order) *OrderSummary {

	price, _ := strconv.ParseFloat(o.FinalPrice, 64)

	var pickup *time.Time
	if o.PickupTime.Valid {
		pickup = &o.PickupTime.Time
	}

	return &OrderSummary{
		ID:            o.ID,
		RequestID:     o.RequestID,
		OfferID:       o.OfferID,
		UserID:        o.UserID,
		VendorID:      o.VendorID,
		FinalPrice:    price,
		OrderStatus:   string(o.OrderStatus),
		PaymentStatus: string(o.PaymentStatus),
		PickupTime:    pickup,
		CreatedAt:     o.CreatedAt,
	}
}

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
