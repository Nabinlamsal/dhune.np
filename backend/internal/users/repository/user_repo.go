package repository

import (
	"context"
	"database/sql"

	"github.com/Nabinlamsal/dhune.np/internal/users/model"
	"github.com/google/uuid"
)

type UserRepository interface {
	GetUsersFiltered(
		ctx context.Context,
		roles []string,
		status sql.NullString,
		search sql.NullString,
		limit int32,
		offset int32,
	) ([]model.AdminUserSummary, error)
	GetUserDetails(
		ctx context.Context,
		userId uuid.UUID,
	) (*model.UserProfile, error)
}
