package service

import (
	"time"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type CreateRequestInput struct {
	UserID         string
	PickupAddress  string
	PickupTimeFrom time.Time
	PickupTimeTo   time.Time
	PaymentMethod  db.PaymentMethod
	ExpiresAt      *time.Time

	Services []CreateRequestServiceInput
}

type CreateRequestServiceInput struct {
	CategoryID    string
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
	UserID         string
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
	UserID        string
	PickupAddress string
	Status        db.RequestsStatus
	CreatedAt     time.Time
}
