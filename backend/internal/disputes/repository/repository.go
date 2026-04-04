package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type Repository interface {
	Create(ctx context.Context, params db.CreateDisputeParams) (db.Dispute, error)
	GetOrderParty(ctx context.Context, orderID uuid.UUID) (db.GetOrderDisputePartyRow, error)
	ListMy(
		ctx context.Context,
		raisedBy db.DisputeRaisedBy,
		raisedByID uuid.UUID,
		limit int32,
		offset int32,
	) ([]db.ListMyDisputesRow, error)
	ListAdmin(
		ctx context.Context,
		status db.NullDisputeStatus,
		limit int32,
		offset int32,
	) ([]db.ListDisputesAdminRow, error)
	GetDetailAdmin(ctx context.Context, disputeID uuid.UUID) (db.GetDisputeDetailAdminRow, error)
	Resolve(ctx context.Context, params db.ResolveDisputeParams) (db.Dispute, error)
}
