package auth

import (
	"errors"

	"github.com/Nabinlamsal/dhune.np/internal/domain"
	"github.com/Nabinlamsal/dhune.np/internal/dto"
	"github.com/Nabinlamsal/dhune.np/internal/models"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo domain.UserRepository
}

func NewAuthService(repo domain.UserRepository) *AuthService {
	return &AuthService{repo: repo}
}
func (s *AuthService) RegisterCustomer(input dto.RegisterCostumerDTO) error {
	// Check email exists
	_, err := s.repo.FindByEmail(input.Email)
	if err == nil {
		return errors.New("email already exists")
	}

	// Check phone exists
	_, err = s.repo.FindByPhone(input.PhoneNumber)
	if err == nil {
		return errors.New("phone number already exists")
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)

	user := &models.User{
		PhoneNumber:  input.PhoneNumber,
		Email:        input.Email,
		FullName:     input.FullName,
		PasswordHash: string(hash),
		IsVerified:   false,
	}
	return s.repo.Create(user)
}
