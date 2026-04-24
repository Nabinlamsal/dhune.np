package repository

import (
	"context"
	"database/sql"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type CommandRepoImpl struct {
	q *db.Queries
}

func NewCommandRepoImpl(q *db.Queries) *CommandRepoImpl {
	return &CommandRepoImpl{q: q}
}

func (r *CommandRepoImpl) ApproveVendor(ctx context.Context, userId uuid.UUID) error {
	return r.q.ApproveVendor(ctx, userId)
}

func (r *CommandRepoImpl) RejectVendor(ctx context.Context, userId uuid.UUID) error {
	return r.q.RejectVendor(ctx, userId)
}
func (r *CommandRepoImpl) ApproveBusinessUser(ctx context.Context, userId uuid.UUID) error {
	return r.q.ApproveBusinessUser(ctx, userId)
}
func (r *CommandRepoImpl) RejectBusinessUser(ctx context.Context, userId uuid.UUID) error {
	return r.q.RejectBusinessUser(ctx, userId)
}
func (r *CommandRepoImpl) SuspendUser(ctx context.Context, userId uuid.UUID) error {
	return r.q.SuspendUser(ctx, userId)
}
func (r *CommandRepoImpl) ReactivateUser(ctx context.Context, userId uuid.UUID) error {
	return r.q.ReactivateUser(ctx, userId)
}

func (r *CommandRepoImpl) UpdateUserSelfProfile(
	ctx context.Context,
	userId uuid.UUID,
	displayName, phone, profileImageURL sql.NullString,
) (db.User, error) {
	return r.q.UpdateUserSelfProfile(ctx, db.UpdateUserSelfProfileParams{
		ID:              userId,
		DisplayName:     displayName,
		Phone:           phone,
		ProfileImageUrl: profileImageURL,
	})
}

func (r *CommandRepoImpl) UpdateRestrictedSelfProfile(
	ctx context.Context,
	userId uuid.UUID,
	phone, profileImageURL sql.NullString,
) (db.User, error) {
	return r.q.UpdateRestrictedSelfProfile(ctx, db.UpdateRestrictedSelfProfileParams{
		ID:              userId,
		Phone:           phone,
		ProfileImageUrl: profileImageURL,
	})
}

func (r *CommandRepoImpl) UpdateUserProfileImage(
	ctx context.Context,
	userId uuid.UUID,
	profileImageURL string,
) (db.User, error) {
	return r.q.UpdateUserProfileImage(ctx, db.UpdateUserProfileImageParams{
		ID:              userId,
		ProfileImageUrl: sql.NullString{String: profileImageURL, Valid: true},
	})
}
