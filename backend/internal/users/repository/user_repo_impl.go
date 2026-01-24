package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/users/model"
)

type UserRepoImpl struct {
	q *db.Queries
}

func NewUserRepoImpl(q *db.Queries) *UserRepoImpl {
	return &UserRepoImpl{q: q}
}

func (repo *UserRepoImpl) GetUsersFiltered(ctx context.Context, roles []string, status *string, search *string) ([]model.AdminUserSummary, error) {
	params := db.GetUsersAdminViewParams{
		Column1: roles,
		Column2: status,
		Column3: search,
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
