package service

import (
	"time"

	"github.com/google/uuid"
)

type CreateOfferInput struct {
	RequestID      uuid.UUID
	VendorID       uuid.UUID
	BidPrice       float64
	CompletionTime time.Time
	ServiceOptions []byte
	Description    *string
}

type UpdateOfferInput struct {
	OfferID        uuid.UUID
	BidPrice       float64
	CompletionTime time.Time
	ServiceOptions []byte
	Description    *string
}

type OfferSummary struct {
	ID             uuid.UUID
	RequestID      uuid.UUID
	VendorID       uuid.UUID
	BidPrice       float64
	Status         string
	CompletionTime time.Time
	CreatedAt      time.Time
}

type AcceptOfferInput struct {
	OfferID uuid.UUID
	UserID  uuid.UUID
}

type AcceptOfferResult struct {
	OrderID uuid.UUID
}
