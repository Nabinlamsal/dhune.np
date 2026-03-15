package service

import (
	"context"
	"encoding/json"
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

func parseServices(data []byte) ([]OrderService, error) {
	var services []OrderService

	if len(data) == 0 {
		return services, nil
	}

	err := json.Unmarshal(data, &services)
	return services, err
}

func (s *OrderService) GetDetail(
	ctx context.Context,
	orderID uuid.UUID,
) (*OrderDetail, error) {

	row, err := s.repo.GetDetail(ctx, orderID)
	if err != nil {
		return nil, err
	}

	services, err := parseServices(row.ServicesJson)
	if err != nil {
		return nil, err
	}

	var pickup *time.Time
	if row.PickupTime.Valid {
		pickup = &row.PickupTime.Time
	}

	var delivery *time.Time
	if row.DeliveryTime.Valid {
		delivery = &row.DeliveryTime.Time
	}

	return &OrderDetail{
		ID:            row.ID.String(),
		RequestID:     row.RequestID.String(),
		FinalPrice:    row.FinalPrice,
		OrderStatus:   string(row.OrderStatus),
		PaymentStatus: string(row.PaymentStatus),

		PickupTime:   pickup,
		DeliveryTime: delivery,
		CreatedAt:    row.CreatedAt,

		User: UserInfo{
			ID:    row.UserID.String(),
			Name:  row.UserName,
			Email: row.UserEmail,
			Phone: row.UserPhone,
		},

		Vendor: VendorInfo{
			ID:    row.VendorID.String(),
			Name:  row.VendorName,
			Email: row.VendorEmail,
			Phone: row.VendorPhone,
		},

		Request: RequestInfo{
			PickupAddress:  row.PickupAddress,
			PickupLat:      nullFloat64Value(row.PickupLat),
			PickupLng:      nullFloat64Value(row.PickupLng),
			PickupTimeFrom: row.PickupTimeFrom,
			PickupTimeTo:   row.PickupTimeTo,
			PaymentMethod:  string(row.PaymentMethod),
		},

		Services: services,
	}, nil
}

func (s *OrderService) ListByUser(
	ctx context.Context,
	userID uuid.UUID,
	limit,
	offset int32,
) ([]OrderSummary, error) {

	rows, err := s.repo.ListByUser(ctx, userID, limit, offset)
	if err != nil {
		return nil, err
	}

	var result []OrderSummary

	for _, row := range rows {

		services, _ := parseServices(row.ServicesJson)

		result = append(result, OrderSummary{
			ID:            row.ID.String(),
			RequestID:     row.RequestID.String(),
			FinalPrice:    row.FinalPrice,
			OrderStatus:   string(row.OrderStatus),
			PaymentStatus: string(row.PaymentStatus),
			CreatedAt:     row.CreatedAt,

			VendorName:    row.VendorName,
			VendorPhone:   row.VendorPhone,
			PickupAddress: row.PickupAddress,
			PickupLat:     nullFloat64Value(row.PickupLat),
			PickupLng:     nullFloat64Value(row.PickupLng),

			Services: services,
		})
	}

	return result, nil
}

func (s *OrderService) ListByVendor(
	ctx context.Context,
	vendorID uuid.UUID,
	status *string,
	limit,
	offset int32,
) ([]OrderSummary, error) {

	var dbStatus db.NullOrderStatus

	if status != nil {
		dbStatus = db.NullOrderStatus{
			OrderStatus: db.OrderStatus(*status),
			Valid:       true,
		}
	}

	rows, err := s.repo.ListByVendor(ctx, vendorID, dbStatus, limit, offset)
	if err != nil {
		return nil, err
	}

	var result []OrderSummary

	for _, row := range rows {

		services, _ := parseServices(row.ServicesJson)

		result = append(result, OrderSummary{
			ID:            row.ID.String(),
			RequestID:     row.RequestID.String(),
			FinalPrice:    row.FinalPrice,
			OrderStatus:   string(row.OrderStatus),
			PaymentStatus: string(row.PaymentStatus),
			CreatedAt:     row.CreatedAt,

			UserName:  row.UserName,
			UserPhone: row.UserPhone,

			PickupAddress: row.PickupAddress,
			PickupLat:     nullFloat64Value(row.PickupLat),
			PickupLng:     nullFloat64Value(row.PickupLng),

			Services: services,
		})
	}

	return result, nil
}

func (s *OrderService) ListAdmin(
	ctx context.Context,
	status *string,
	limit,
	offset int32,
) ([]OrderSummary, error) {

	var dbStatus db.NullOrderStatus

	if status != nil {
		dbStatus = db.NullOrderStatus{
			OrderStatus: db.OrderStatus(*status),
			Valid:       true,
		}
	}

	rows, err := s.repo.ListAdmin(ctx, dbStatus, limit, offset)
	if err != nil {
		return nil, err
	}

	var result []OrderSummary

	for _, row := range rows {

		services, _ := parseServices(row.ServicesJson)

		result = append(result, OrderSummary{
			ID:            row.ID.String(),
			FinalPrice:    row.FinalPrice,
			OrderStatus:   string(row.OrderStatus),
			PaymentStatus: string(row.PaymentStatus),
			CreatedAt:     row.CreatedAt,

			UserName:   row.UserName,
			VendorName: row.VendorName,

			PickupAddress: row.PickupAddress,
			PickupLat:     nullFloat64Value(row.PickupLat),
			PickupLng:     nullFloat64Value(row.PickupLng),

			Services: services,
		})
	}

	return result, nil
}

func (s *OrderService) UpdateStatus(
	ctx context.Context,
	orderID uuid.UUID,
	status string,
) error {

	next := db.OrderStatus(status)

	return s.repo.UpdateStatus(ctx, orderID, next)
}

func (s *OrderService) Cancel(
	ctx context.Context,
	orderID uuid.UUID,
) error {

	return s.repo.Cancel(ctx, orderID)
}

func (s *OrderService) MarkPaid(
	ctx context.Context,
	orderID uuid.UUID,
) error {

	return s.repo.MarkPaid(ctx, orderID)
}

func (s *OrderService) MarkRefunded(
	ctx context.Context,
	orderID uuid.UUID,
) error {

	return s.repo.MarkRefunded(ctx, orderID)
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
