package repository

import (
	"context"

	"github.com/Nabinlamsal/dhune.np/internal/users/model"
	"github.com/google/uuid"
)

type UserRepository interface {
	GetUsersFiltered(ctx context.Context, roles []string, status *string, search *string) ([]model.AdminUserSummary, error)
	GetUserDocuments(ctx context.Context, userId uuid.UUID) error
	GetUserDetails(ctx context.Context, userId uuid.UUID) (*model.UserProfile, error)
}
