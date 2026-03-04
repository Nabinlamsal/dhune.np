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

	price, err := strconv.ParseFloat(order.FinalPrice, 64)
	if err != nil {
		price = 0
	}

	var pickup *time.Time
	if order.PickupTime.Valid {
		pickup = &order.PickupTime.Time
	}

	return &OrderSummary{
		ID:            order.ID,
		RequestID:     order.RequestID,
		OfferID:       order.OfferID,
		UserID:        order.UserID,
		VendorID:      order.VendorID,
		FinalPrice:    price,
		OrderStatus:   string(order.OrderStatus),
		PaymentStatus: string(order.PaymentStatus),
		PickupTime:    pickup,
		CreatedAt:     order.CreatedAt,
	}, nil
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
		result = append(result, mapUserOrder(o))
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
		result = append(result, mapVendorOrder(o))
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
		result = append(result, mapAdminOrder(o))
	}

	return result, nil
}

func (s *OrderService) GetUserStats(
	ctx context.Context,
	userID uuid.UUID,
) (db.GetOrderStatsFilteredRow, error) {

	return s.repo.GetStatsFiltered(
		ctx,
		uuid.NullUUID{
			UUID:  userID,
			Valid: true,
		},
		uuid.NullUUID{},
	)
}
func (s *OrderService) GetVendorStats(
	ctx context.Context,
	vendorID uuid.UUID,
) (db.GetOrderStatsFilteredRow, error) {

	return s.repo.GetStatsFiltered(
		ctx,
		uuid.NullUUID{},
		uuid.NullUUID{
			UUID:  vendorID,
			Valid: true,
		},
	)
}

func (s *OrderService) GetAdminStats(
	ctx context.Context,
) (db.GetOrderStatsFilteredRow, error) {

	return s.repo.GetStatsFiltered(
		ctx,
		uuid.NullUUID{},
		uuid.NullUUID{},
	)
}
func mapVendorOrder(row db.ListOrdersByVendorRow) OrderSummary {

	price, _ := strconv.ParseFloat(row.FinalPrice, 64)

	var pickup *time.Time
	if row.PickupTime.Valid {
		pickup = &row.PickupTime.Time
	}

	return OrderSummary{
		ID:        row.ID,
		RequestID: row.RequestID,
		OfferID:   row.OfferID,

		FinalPrice: price,

		OrderStatus:   string(row.OrderStatus),
		PaymentStatus: string(row.PaymentStatus),

		PickupTime: pickup,
		CreatedAt:  row.CreatedAt,

		UserName:  row.UserName,
		UserPhone: row.UserPhone,
		UserEmail: row.UserEmail,

		CategoryName: row.CategoryName,
	}
}

func mapAdminOrder(row db.ListOrdersAdminRow) OrderSummary {

	price, _ := strconv.ParseFloat(row.FinalPrice, 64)

	return OrderSummary{
		ID:        row.ID,
		RequestID: row.RequestID,
		OfferID:   row.OfferID,

		FinalPrice: price,

		OrderStatus:   string(row.OrderStatus),
		PaymentStatus: string(row.PaymentStatus),

		CreatedAt: row.CreatedAt,

		UserName:  row.UserName,
		UserPhone: row.UserPhone,
		UserEmail: row.UserEmail,

		VendorName:  row.VendorName,
		VendorPhone: row.VendorPhone,
		VendorEmail: row.VendorEmail,

		CategoryName: row.CategoryName,
	}
}

func mapUserOrder(row db.ListOrdersByUserRow) OrderSummary {

	price, _ := strconv.ParseFloat(row.FinalPrice, 64)

	return OrderSummary{
		ID:        row.ID,
		RequestID: row.RequestID,
		OfferID:   row.OfferID,

		FinalPrice: price,

		OrderStatus:   string(row.OrderStatus),
		PaymentStatus: string(row.PaymentStatus),

		CreatedAt: row.CreatedAt,

		VendorName:  row.VendorName,
		VendorPhone: row.VendorPhone,
		VendorEmail: row.VendorEmail,

		CategoryName: row.CategoryName,
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
