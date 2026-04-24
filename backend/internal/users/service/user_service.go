package service

import (
	"context"
	"database/sql"
	"errors"
	"mime/multipart"
	"strings"

	"github.com/Nabinlamsal/dhune.np/internal/users/dto"
	"github.com/Nabinlamsal/dhune.np/internal/users/model"
	"github.com/Nabinlamsal/dhune.np/internal/users/repository"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
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
			case "pending", "rejected", "suspended", "approved":
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
func (service *UserService) GetMyProfile(ctx context.Context, userId uuid.UUID) (*model.UserProfile, error) {

	if userId == uuid.Nil {
		return nil, errors.New("invalid user id")
	}

	profile, err := service.userRepo.GetMyProfile(ctx, userId)
	if err != nil {
		return nil, err
	}

	return profile, nil
}

func (service *UserService) UpdateMyProfile(
	ctx context.Context,
	userId uuid.UUID,
	req dto.UpdateProfileRequestDTO,
) (*model.UserProfile, error) {
	if userId == uuid.Nil {
		return nil, errors.New("invalid user id")
	}

	profile, err := service.userRepo.GetMyProfile(ctx, userId)
	if err != nil {
		return nil, err
	}

	var phoneNS sql.NullString
	if req.Phone != nil {
		phone := strings.TrimSpace(*req.Phone)
		if !utils.IsValidPhone(phone) {
			return nil, errors.New("phone must be exactly 10 digits")
		}
		phoneNS = sql.NullString{String: phone, Valid: true}
	}

	var displayNameNS sql.NullString
	if req.DisplayName != nil {
		displayName := strings.TrimSpace(*req.DisplayName)
		displayNameNS = sql.NullString{String: displayName, Valid: true}
	}

	switch profile.Role {
	case "user":
		_, err = service.commandRepo.UpdateUserSelfProfile(ctx, userId, displayNameNS, phoneNS, sql.NullString{})
	case "vendor", "business", "admin":
		if req.DisplayName != nil {
			return nil, errors.New("display name cannot be updated for this account")
		}
		_, err = service.commandRepo.UpdateRestrictedSelfProfile(ctx, userId, phoneNS, sql.NullString{})
	default:
		return nil, errors.New("invalid user role")
	}
	if err != nil {
		return nil, err
	}

	return service.GetMyProfile(ctx, userId)
}

func (service *UserService) UploadProfileImage(
	ctx context.Context,
	userId uuid.UUID,
	file *multipart.FileHeader,
) (*model.UserProfile, error) {
	if userId == uuid.Nil {
		return nil, errors.New("invalid user id")
	}
	if file == nil {
		return nil, errors.New("profile image is required")
	}

	imageURL, err := utils.UploadImageToCloudinary(ctx, file, "dhune/profile-images")
	if err != nil {
		return nil, err
	}

	if _, err := service.commandRepo.UpdateUserProfileImage(ctx, userId, imageURL); err != nil {
		return nil, err
	}

	return service.GetMyProfile(ctx, userId)
}
