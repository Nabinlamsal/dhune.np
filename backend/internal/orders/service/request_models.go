package service

import (
	"time"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type CreateRequestInput struct {
	UserID         uuid.UUID
	PickupAddress  string
	PickupTimeFrom time.Time
	PickupTimeTo   time.Time
	PaymentMethod  db.PaymentMethod
	ExpiresAt      *time.Time

	Services []CreateRequestServiceInput
}

type CreateRequestServiceInput struct {
	CategoryID    uuid.UUID
	SelectedUnit  db.PricingUnit
	QuantityValue float64
	ItemsJSON     []byte
	Description   *string
}
type RequestServiceItem struct {
	ServiceID     uuid.UUID
	CategoryID    uuid.UUID
	SelectedUnit  db.PricingUnit
	QuantityValue float64
	ItemsJSON     []byte
	Description   *string
}

type RequestDetail struct {
	ID             uuid.UUID
	UserID         uuid.UUID
	PickupAddress  string
	PickupTimeFrom time.Time
	PickupTimeTo   time.Time
	PaymentMethod  db.PaymentMethod
	Status         db.RequestsStatus
	ExpiresAt      *time.Time
	CreatedAt      time.Time
	Services       []RequestServiceItem
}
type RequestSummary struct {
	ID            uuid.UUID
	UserID        uuid.UUID
	PickupAddress string
	Status        db.RequestsStatus
	CreatedAt     time.Time
}

type MarketplaceRequestSummary struct {
	ID             uuid.UUID
	PickupAddress  string
	PickupTimeFrom time.Time
	PickupTimeTo   time.Time
	ExpiresAt      time.Time
	CreatedAt      time.Time
	ServiceCount   int64
	TotalQuantity  float64
}
