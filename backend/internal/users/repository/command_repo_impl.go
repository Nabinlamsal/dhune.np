package repository

import (
	"context"

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
