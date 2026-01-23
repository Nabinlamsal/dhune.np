package model

import (
	"time"

	"github.com/google/uuid"
)

type AdminUserSummary struct {
	ID                     uuid.UUID
	DisplayName            string
	Email                  string
	Phone                  string
	Role                   string
	IsActive               bool
	BusinessApprovalStatus *string
	VendorApprovalStatus   *string
	CreatedAt              time.Time
}
