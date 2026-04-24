package repository

import (
	"context"
	"database/sql"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type CommandRepository interface {
	ApproveVendor(ctx context.Context, userId uuid.UUID) error
	RejectVendor(ctx context.Context, userId uuid.UUID) error
	ApproveBusinessUser(ctx context.Context, userId uuid.UUID) error
	RejectBusinessUser(ctx context.Context, userId uuid.UUID) error
	SuspendUser(ctx context.Context, userId uuid.UUID) error
	ReactivateUser(ctx context.Context, userId uuid.UUID) error
	UpdateUserSelfProfile(ctx context.Context, userId uuid.UUID, displayName, phone, profileImageURL sql.NullString) (db.User, error)
	UpdateRestrictedSelfProfile(ctx context.Context, userId uuid.UUID, phone, profileImageURL sql.NullString) (db.User, error)
	UpdateUserProfileImage(ctx context.Context, userId uuid.UUID, profileImageURL string) (db.User, error)
}
