package service

import (
	"context"
	"database/sql"
	"errors"
	"strings"

	"github.com/Nabinlamsal/dhune.np/internal/auth/dto"
	"github.com/Nabinlamsal/dhune.np/internal/auth/repository"
	db "github.com/Nabinlamsal/dhune.np/internal/database"
)

type AuthService struct {
	authRepo   repository.AuthRepository
	pwdService *PasswordService
	jwtService JWTService
	db         *sql.DB
}

func NewAuthService(
	authRepo repository.AuthRepository,
	pwdService *PasswordService,
	jwtService JWTService,
	db *sql.DB,
) *AuthService {
	return &AuthService{
		authRepo:   authRepo,
		pwdService: pwdService,
		jwtService: jwtService,
		db:         db,
	}
}

func (s *AuthService) CreateUser(
	ctx context.Context,
	req dto.SignupRequestDTO,
) (*dto.SignupResponseDTO, error) {

	role := strings.ToLower(strings.TrimSpace(req.Role))
	if role != "user" && role != "business" && role != "vendor" {
		return nil, errors.New("invalid role")
	}

	if role == "business" {
		if req.OwnerName == nil || req.BusinessType == nil ||
			req.RegistrationNumber == nil || len(req.Documents) == 0 {
			return nil, errors.New("missing required business fields")
		}
	}

	if role == "vendor" {
		if req.OwnerName == nil || req.Address == nil ||
			req.RegistrationNumber == nil || len(req.Documents) == 0 {
			return nil, errors.New("missing required vendor fields")
		}
	}

	if _, err := s.authRepo.FindUserByEmail(ctx, req.Email); err == nil {
		return nil, errors.New("email already registered")
	}
	if _, err := s.authRepo.FindUserByPhone(ctx, req.Phone); err == nil {
		return nil, errors.New("phone already registered")
	}

	hashedPwd, err := s.pwdService.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	qtx := db.New(tx)
	txRepo := repository.NewAuthRepository(qtx)

	user, err := txRepo.CreateUser(ctx, db.CreateUserParams{
		DisplayName:  req.DisplayName,
		Email:        req.Email,
		Phone:        req.Phone,
		PasswordHash: hashedPwd,
		Role:         role,
	})
	if err != nil {
		return nil, err
	}

	if role == "business" {
		if _, err := txRepo.CreateBusinessUserProfile(ctx,
			db.CreateBusinessUserProfileParams{
				UserID:             user.ID,
				OwnerName:          *req.OwnerName,
				BusinessType:       *req.BusinessType,
				RegistrationNumber: *req.RegistrationNumber,
			}); err != nil {
			return nil, err
		}
	}

	if role == "vendor" {
		if _, err := txRepo.CreateVendorProfile(ctx,
			db.CreateVendorProfileParams{
				UserID:             user.ID,
				OwnerName:          *req.OwnerName,
				Address:            *req.Address,
				RegistrationNumber: *req.RegistrationNumber,
			}); err != nil {
			return nil, err
		}
	}

	for _, doc := range req.Documents {
		if _, err := txRepo.CreateDocument(ctx, db.CreateDocumentParams{
			UserID:       user.ID,
			DocumentType: doc.DocumentType,
			DocumentUrl:  doc.DocumentURL,
		}); err != nil {
			return nil, err
		}
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	msg := "Signup successful. Please login."
	if role != "user" {
		msg = "Signup successful. Your account is pending admin approval."
	}

	return &dto.SignupResponseDTO{
		UserId:          user.ID.String(),
		Role:            role,
		Status:          "success",
		ResponseMessage: msg,
	}, nil
}

func (s *AuthService) Login(
	ctx context.Context,
	req dto.LoginRequestDTO,
) (*dto.LoginResponseDTO, error) {

	var user db.User
	var err error

	identifier := strings.TrimSpace(req.EmailOrPhone)

	if strings.Contains(identifier, "@") {
		user, err = s.authRepo.FindUserByEmail(ctx, identifier)
	} else {
		user, err = s.authRepo.FindUserByPhone(ctx, identifier)
	}

	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if err := s.pwdService.ComparePasswords(user.PasswordHash, req.Password); err != nil {
		return nil, errors.New("invalid credentials")
	}

	accessToken, err := s.jwtService.GenerateAccessToken(user.ID, user.Role)
	if err != nil {
		return nil, err
	}

	refreshToken, err := s.jwtService.GenerateRefreshToken(user.ID)
	if err != nil {
		return nil, err
	}

	resp := &dto.LoginResponseDTO{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		Message:      "login successful",
	}

	resp.User.ID = user.ID.String()
	resp.User.DisplayName = user.DisplayName
	resp.User.Role = user.Role

	return resp, nil
}
