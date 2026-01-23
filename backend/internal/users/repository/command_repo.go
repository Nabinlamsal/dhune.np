package repository

import (
	"context"

	"github.com/google/uuid"
)

type UserRepository interface {
	ApproveVendor(ctx context.Context, userId uuid.UUID) error
	RejectVendor(ctx context.Context, userId uuid.UUID) error
	ApproveBusinessUser(ctx context.Context, userId uuid.UUID) error
	RejectBusinessUser(ctx context.Context, userId uuid.UUID) error
	SuspendUser(ctx context.Context, userId uuid.UUID) error
	ReactivateUser(ctx context.Context, userId uuid.UUID) error
}
