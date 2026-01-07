package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type AuthRepository interface {
	CreateUser(ctx context.Context, arg db.CreateUserParams) (db.User, error)
	FindUserByEmail(ctx context.Context, email string) (db.User, error)
	FindUserByPhone(ctx context.Context, phone string) (db.User, error)
	FindUserByID(ctx context.Context, id uuid.UUID) (db.User, error)

	CreateBusinessUserProfile(
		ctx context.Context,
		arg db.CreateBusinessUserProfileParams,
	) (db.BusinessProfile, error)

	GetBusinessProfileByUserID(
		ctx context.Context,
		userID uuid.UUID,
	) (db.BusinessProfile, error)

	CreateVendorProfile(
		ctx context.Context,
		arg db.CreateVendorProfileParams,
	) (db.VendorProfile, error)

	GetVendorProfileByUserID(
		ctx context.Context,
		userID uuid.UUID,
	) (db.VendorProfile, error)

	CreateDocument(
		ctx context.Context,
		arg db.CreateDocumentParams,
	) (db.Document, error)

	GetDocumentsByUserID(
		ctx context.Context,
		userID uuid.UUID,
	) ([]db.Document, error)
}
