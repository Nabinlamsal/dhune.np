package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type CategoryRepository interface {
	Create(ctx context.Context, params db.CreateCategoryParams) (db.Category, error)
	GetByID(ctx context.Context, id uuid.UUID) (db.Category, error)
	ListActive(ctx context.Context) ([]db.Category, error)
	Update(ctx context.Context, params db.UpdateCategoryParams) (db.Category, error)
	SetActiveStatus(ctx context.Context, id uuid.UUID, isActive bool) error
}

type categoryRepo struct {
	q *db.Queries
}

func NewCategoryRepository(q *db.Queries) CategoryRepository {
	return &categoryRepo{q: q}
}

func (r *categoryRepo) Create(
	ctx context.Context,
	params db.CreateCategoryParams,
) (db.Category, error) {
	return r.q.CreateCategory(ctx, params)
}

func (r *categoryRepo) GetByID(
	ctx context.Context,
	id uuid.UUID,
) (db.Category, error) {
	return r.q.GetCategoryByID(ctx, id)
}

func (r *categoryRepo) ListActive(
	ctx context.Context,
) ([]db.Category, error) {
	return r.q.ListActiveCategories(ctx)
}

func (r *categoryRepo) Update(
	ctx context.Context,
	params db.UpdateCategoryParams,
) (db.Category, error) {
	return r.q.UpdateCategory(ctx, params)
}

func (r *categoryRepo) SetActiveStatus(
	ctx context.Context,
	id uuid.UUID,
	isActive bool,
) error {
	return r.q.SetCategoryActiveStatus(ctx, db.SetCategoryActiveStatusParams{
		ID:       id,
		IsActive: isActive,
	})
}
