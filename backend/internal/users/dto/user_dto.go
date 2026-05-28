package dto

import (
	"time"

	"github.com/google/uuid"
)

type UserListAdminDto struct {
	ID                     uuid.UUID `json:"id"`
	DisplayName            string    `json:"display_name"`
	Email                  string    `json:"email"`
	Phone                  string    `json:"phone"`
	Role                   string    `json:"role"`
	IsActive               bool      `json:"is_active"`
	BusinessApprovalStatus *string   `json:"business_approval_status,omitempty"`
	VendorApprovalStatus   *string   `json:"vendor_approval_status,omitempty"`
	CreatedAt              time.Time `json:"created_at"`
}

type UserProfileDto struct {
	ID              uuid.UUID `json:"id"`
	DisplayName     string    `json:"display_name"`
	Email           string    `json:"email"`
	Phone           string    `json:"phone"`
	ProfileImageURL string    `json:"profile_image_url,omitempty"`
	Role            string    `json:"role"`
	IsActive        bool      `json:"is_active"`
	IsVerified      bool      `json:"is_verified"`
	CreatedAt       time.Time `json:"created_at"`

	BusinessProfile *BusinessProfileDto `json:"business_profile,omitempty"`
	VendorProfile   *VendorProfileDto   `json:"vendor_profile,omitempty"`
	Documents       []DocumentDto       `json:"documents,omitempty"`
}

type BusinessProfileDto struct {
	OwnerName          string `json:"owner_name"`
	BusinessType       string `json:"business_type"`
	RegistrationNumber string `json:"registration_number"`
	ApprovalStatus     string `json:"approval_status"`
}

type VendorProfileDto struct {
	OwnerName          string   `json:"owner_name"`
	Address            string   `json:"address"`
	BusinessLatitude   *float64 `json:"business_latitude,omitempty"`
	BusinessLongitude  *float64 `json:"business_longitude,omitempty"`
	ServiceRadiusKm    *float64 `json:"service_radius_km,omitempty"`
	RegistrationNumber string   `json:"registration_number"`
	ApprovalStatus     string   `json:"approval_status"`
}

type DocumentDto struct {
	ID           uuid.UUID `json:"id"`
	DocumentType string    `json:"document_type"`
	DocumentURL  string    `json:"document_url"`
	Verified     bool      `json:"verified"`
	CreatedAt    time.Time `json:"created_at"`
}

type UpdateProfileRequestDTO struct {
	DisplayName       *string  `json:"display_name"`
	Phone             *string  `json:"phone"`
	BusinessLatitude  *float64 `json:"business_latitude"`
	BusinessLongitude *float64 `json:"business_longitude"`
	ServiceRadiusKm   *float64 `json:"service_radius_km"`
}
