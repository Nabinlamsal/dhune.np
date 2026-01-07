package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

// concrete implementation
type authRepository struct {
	q *db.Queries
}

func NewAuthRepository(q *db.Queries) AuthRepository {
	return &authRepository{q: q}
}

func (r *authRepository) CreateUser(
	ctx context.Context,
	arg db.CreateUserParams,
) (db.User, error) {
	return r.q.CreateUser(ctx, arg)
}

func (r *authRepository) FindUserByEmail(
	ctx context.Context,
	email string,
) (db.User, error) {
	return r.q.GetUserByEmail(ctx, email)
}

func (r *authRepository) FindUserByPhone(
	ctx context.Context,
	phone string,
) (db.User, error) {
	return r.q.GetUserByPhone(ctx, phone)
}

func (r *authRepository) FindUserByID(
	ctx context.Context,
	id uuid.UUID,
) (db.User, error) {
	return r.q.GetUserByID(ctx, id)
}

func (r *authRepository) CreateBusinessUserProfile(
	ctx context.Context,
	arg db.CreateBusinessUserProfileParams,
) (db.BusinessProfile, error) {
	return r.q.CreateBusinessUserProfile(ctx, arg)
}

func (r *authRepository) GetBusinessProfileByUserID(
	ctx context.Context,
	userID uuid.UUID,
) (db.BusinessProfile, error) {
	return r.q.GetBusinessProfileByUserID(ctx, userID)
}

func (r *authRepository) CreateVendorProfile(
	ctx context.Context,
	arg db.CreateVendorProfileParams,
) (db.VendorProfile, error) {
	return r.q.CreateVendorProfile(ctx, arg)
}

func (r *authRepository) GetVendorProfileByUserID(
	ctx context.Context,
	userID uuid.UUID,
) (db.VendorProfile, error) {
	return r.q.GetVendorProfileByUserID(ctx, userID)
}

func (r *authRepository) CreateDocument(
	ctx context.Context,
	arg db.CreateDocumentParams,
) (db.Document, error) {
	return r.q.CreateDocument(ctx, arg)
}

func (r *authRepository) GetDocumentsByUserID(
	ctx context.Context,
	userID uuid.UUID,
) ([]db.Document, error) {
	return r.q.GetDocumentsByUserID(ctx, userID)
}
