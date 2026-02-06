package service

import (
	"context"
	"database/sql"
	"errors"
	"strings"

	"github.com/Nabinlamsal/dhune.np/internal/users/model"
	"github.com/Nabinlamsal/dhune.np/internal/users/repository"
	"github.com/google/uuid"
)

type UserService struct {
	commandRepo repository.CommandRepository
	userRepo    repository.UserRepository
}

func NewUserService(commandRepo repository.CommandRepository, userRepo repository.UserRepository) *UserService {
	return &UserService{commandRepo: commandRepo, userRepo: userRepo}
}

func (service *UserService) GetUsersFiltered(ctx context.Context, roles []string, status *string, search *string, limit int32, offset int32) ([]model.AdminUserSummary, error) {

	//validate pagination
	if limit < 10 {
		return nil, errors.New("limit cant be less than 10")
	}
	if limit > 100 {
		return nil, errors.New("limit cant be more than 100")
	}
	if offset < 0 {
		return nil, errors.New("offset cannot be negative")
	}
	//normalize roles
	if len(roles) > 0 {
		allowedRoles := map[string]bool{
			"user":     true,
			"admin":    true,
			"business": true,
			"vendor":   true,
		}
		seenRoles := map[string]struct{}{}
		normalizedRoles := make([]string, 0, len(roles))

		for _, role := range roles {
			role = strings.ToLower(strings.TrimSpace(role))
			if role == " " {
				continue
			}

			if !allowedRoles[role] {
				return nil, errors.New("role " + role + " is not allowed")
			}

			if _, ok := seenRoles[role]; !ok {
				seenRoles[role] = struct{}{}
				normalizedRoles = append(normalizedRoles, role)
			}

			roles = normalizedRoles
		}
	}

	//normalize status
	var statusNS sql.NullString
	if status != nil {
		s := strings.ToLower(strings.TrimSpace(*status))
		if s != "" {
			switch s {
			case "pending", "rejected", "suspended":
				statusNS = sql.NullString{
					String: s,
					Valid:  true,
				}
			default:
				return nil, errors.New("invalid status filter")
			}
		}
	}

	//normalize search
	var searchNS sql.NullString
	if search != nil {
		q := strings.TrimSpace(*search)
		if q != "" {
			searchNS = sql.NullString{
				String: q,
				Valid:  true,
			}
		}
	}

	users, err := service.userRepo.GetUsersFiltered(ctx, roles, statusNS, searchNS, limit, offset)
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (service *UserService) GetUserDetail(
	ctx context.Context,
	userId uuid.UUID,
) (*model.UserProfile, error) {

	if userId == uuid.Nil {
		return nil, errors.New("invalid user id")
	}

	user, err := service.userRepo.GetUserDetails(ctx, userId)
	if err != nil {
		return nil, err
	}

	return user, nil
}
