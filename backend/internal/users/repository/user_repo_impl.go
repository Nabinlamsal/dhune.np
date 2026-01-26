package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/users/model"
	"github.com/google/uuid"
)

type UserRepoImpl struct {
	q *db.Queries
}

func NewUserRepoImpl(q *db.Queries) *UserRepoImpl {
	return &UserRepoImpl{q: q}
}

func (repo *UserRepoImpl) GetUsersFiltered(ctx context.Context, roles []string, status *string, search *string, limit int32, offset int32) ([]model.AdminUserSummary, error) {
	params := db.GetUsersAdminViewParams{
		Column1: roles,
		Column2: status,
		Column3: search,
		Limit:   limit,
		Offset:  offset,
	}

	//execute sql query
	rows, err := repo.q.GetUsersAdminView(ctx, params)
	if err != nil {
		return nil, err
	}
	users := make([]model.AdminUserSummary, 0, len(rows))
	for _, row := range rows {
		//mapping sqlc rows to domain models

		var businessStatus *string
		var vendorStatus *string
		if row.BusinessApprovalStatus.Valid {
			v := row.BusinessApprovalStatus.String
			businessStatus = &v
		}

		if row.VendorApprovalStatus.Valid {
			v := row.VendorApprovalStatus.String
			vendorStatus = &v
		}
		users = append(users, model.AdminUserSummary{
			ID:                     row.ID,
			DisplayName:            row.DisplayName,
			Email:                  row.Email,
			Phone:                  row.Phone,
			Role:                   row.Role,
			IsActive:               row.IsActive,
			CreatedAt:              row.CreatedAt,
			BusinessApprovalStatus: businessStatus,
			VendorApprovalStatus:   vendorStatus,
		})
	}

	return users, nil
}

func (repo *UserRepoImpl) GetUserDetails(ctx context.Context, userId uuid.UUID) (*model.UserProfile, error) {
	row, err := repo.q.GetUserDetail(ctx, userId)
	if err != nil {
		return nil, err
	}
	docs, err := repo.q.GetUserDocuments(ctx, userId)
	if err != nil {
		return nil, err
	}

	//mapping profile
	profile := &model.UserProfile{
		ID:          userId,
		DisplayName: row.DisplayName,
		Email:       row.Email,
		Phone:       row.Phone,
		Role:        row.Role,
		Documents:   make([]model.Document, 0, len(docs)),
		IsActive:    row.IsActive,
		CreatedAt:   row.CreatedAt,
		IsVerified:  row.IsVerified,
	}

	if row.BusinessProfileID.Valid {
		profile.BusinessProfile = &model.BusinessProfile{
			OwnerName:          row.BusinessOwnerName.String,
			BusinessType:       row.BusinessType.String,
			RegistrationNumber: row.BusinessRegistrationNumber.String,
			ApprovalStatus:     row.BusinessApprovalStatus.String,
		}
	}
	if row.VendorProfileID.Valid {
		profile.VendorProfile = &model.VendorProfile{
			OwnerName:          row.VendorOwnerName.String,
			Address:            row.VendorAddress.String,
			RegistrationNumber: row.VendorRegistrationNumber.String,
			ApprovalStatus:     row.VendorApprovalStatus.String,
		}
	}

	for _, document := range docs {
		profile.Documents = append(profile.Documents, model.Document{
			ID:           document.ID,
			DocumentType: document.DocumentType,
			DocumentURL:  document.DocumentUrl,
			Verified:     document.Verified,
			CreatedAt:    document.CreatedAt,
		})
	}
	return profile, nil
}
