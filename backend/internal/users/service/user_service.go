package service

import (
	"context"

	"github.com/Nabinlamsal/dhune.np/internal/users/model"
	"github.com/Nabinlamsal/dhune.np/internal/users/repository"
)

type UserService struct {
	commandRepo repository.CommandRepository
	userRepo    repository.UserRepository
}

func NewUserService(commandRepo repository.CommandRepository, userRepo repository.UserRepository) *UserService {
	return &UserService{commandRepo: commandRepo, userRepo: userRepo}
}

func (service *UserService) GetUsersFiltered(ctx context.Context, roles []string, status *string, search *string) *[]model.AdminUserSummary {

}
