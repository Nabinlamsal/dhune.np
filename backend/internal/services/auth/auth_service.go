package services

import "github.com/Nabinlamsal/dhune.np/internal/domain"

type AuthService struct {
	repo domain.UserRepository
}
func NewAuthService(repo domain.UserRepository) *AuthService {
	return &AuthService{repo: repo}
}
func (s *AuthService) RegisteBusiness