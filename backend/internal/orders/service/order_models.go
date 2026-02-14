package service

import (
	"time"

	"github.com/google/uuid"
)

type OrderSummary struct {
	ID            uuid.UUID
	RequestID     uuid.UUID
	OfferID       uuid.UUID
	UserID        uuid.UUID
	VendorID      uuid.UUID
	FinalPrice    float64
	OrderStatus   string
	PaymentStatus string
	PickupTime    *time.Time
	CreatedAt     time.Time
}

type UpdateOrderStatusInput struct {
	OrderID uuid.UUID
	Status  string
}
