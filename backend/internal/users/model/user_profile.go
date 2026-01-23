package model

import (
	"time"

	"github.com/google/uuid"
)

type UserProfile struct {
	ID          uuid.UUID
	DisplayName string
	Email       string
	Phone       string
	Role        string
	IsActive    bool
	IsVerified  bool
	CreatedAt   time.Time

	BusinessProfile *BusinessProfile
	VendorProfile   *VendorProfile
	Documents       []Document
}
type BusinessProfile struct {
	OwnerName          string
	BusinessType       string
	RegistrationNumber string
	ApprovalStatus     string
}
type VendorProfile struct {
	OwnerName          string
	Address            string
	RegistrationNumber string
	ApprovalStatus     string
}
