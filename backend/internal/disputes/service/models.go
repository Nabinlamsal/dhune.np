package service

import (
	"mime/multipart"
	"time"
)

type CreateDisputeInput struct {
	OrderID     string
	RaisedBy    string
	RaisedByID  string
	DisputeType string
	Description string
	ImageURL    *string
	ImageFile   *multipart.FileHeader
}

type ResolveDisputeInput struct {
	DisputeID        string
	Decision         string
	AdjustmentAmount *float64
	AdminNote        string
}

type DisputeSummary struct {
	ID               string
	OrderID          string
	RaisedBy         string
	RaisedByID       string
	DisputeType      string
	Description      string
	ImageURL         *string
	Status           string
	AdminDecision    *string
	AdjustmentAmount *float64
	OrderStatus      string
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

type DisputeAdminSummary struct {
	DisputeSummary
	FinalPrice string
	UserName   string
	VendorName string
}

type DisputeDetail struct {
	DisputeSummary
	Order  DisputeOrderInfo
	User   DisputePartyInfo
	Vendor DisputePartyInfo
}

type DisputeOrderInfo struct {
	ID            string
	RequestID     string
	OfferID       string
	OrderStatus   string
	PaymentStatus string
	FinalPrice    string
}

type DisputePartyInfo struct {
	ID    string
	Name  string
	Email string
	Phone string
}
