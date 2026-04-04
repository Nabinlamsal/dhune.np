package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type disputeRepository struct {
	q *db.Queries
}

func NewRepository(q *db.Queries) Repository {
	return &disputeRepository{q: q}
}

func (r *disputeRepository) Create(ctx context.Context, params db.CreateDisputeParams) (db.Dispute, error) {
	return r.q.CreateDispute(ctx, params)
}

func (r *disputeRepository) GetOrderParty(ctx context.Context, orderID uuid.UUID) (db.GetOrderDisputePartyRow, error) {
	return r.q.GetOrderDisputeParty(ctx, orderID)
}

func (r *disputeRepository) ListMy(
	ctx context.Context,
	raisedBy db.DisputeRaisedBy,
	raisedByID uuid.UUID,
	limit int32,
	offset int32,
) ([]db.ListMyDisputesRow, error) {
	return r.q.ListMyDisputes(ctx, db.ListMyDisputesParams{
		RaisedBy:   raisedBy,
		RaisedByID: raisedByID,
		Limit:      limit,
		Offset:     offset,
	})
}

func (r *disputeRepository) ListAdmin(
	ctx context.Context,
	status db.NullDisputeStatus,
	limit int32,
	offset int32,
) ([]db.ListDisputesAdminRow, error) {
	return r.q.ListDisputesAdmin(ctx, db.ListDisputesAdminParams{
		Status: status,
		Limit:  limit,
		Offset: offset,
	})
}

func (r *disputeRepository) GetDetailAdmin(ctx context.Context, disputeID uuid.UUID) (db.GetDisputeDetailAdminRow, error) {
	return r.q.GetDisputeDetailAdmin(ctx, disputeID)
}

func (r *disputeRepository) Resolve(ctx context.Context, params db.ResolveDisputeParams) (db.Dispute, error) {
	return r.q.ResolveDispute(ctx, params)
}
