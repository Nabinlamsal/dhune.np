package service

import (
	"time"

	"github.com/google/uuid"
)

type OrderSummary struct {
	ID        uuid.UUID
	RequestID uuid.UUID
	OfferID   uuid.UUID

	FinalPrice float64

	OrderStatus   string
	PaymentStatus string

	PickupTime *time.Time
	CreatedAt  time.Time

	// user info
	UserName  string
	UserPhone string
	UserEmail string

	// vendor info
	VendorName  string
	VendorPhone string
	VendorEmail string

	// service category
	CategoryName string
}

type UpdateOrderStatusInput struct {
	OrderID uuid.UUID
	Status  string
}
type OrderServiceItem struct {
	ServiceID     uuid.UUID
	CategoryID    uuid.UUID
	CategoryName  string
	SelectedUnit  string
	QuantityValue float64
	ItemsJSON     []byte
	Description   *string
}

type OrderDetail struct {
	Order    OrderSummary
	UserID   uuid.UUID
	VendorID uuid.UUID

	PickupAddress  string
	PickupTimeFrom time.Time
	PickupTimeTo   time.Time
	PaymentMethod  string

	Services []OrderServiceItem
}
