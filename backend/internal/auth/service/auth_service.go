package service

import (
	"context"
	"database/sql"
	"errors"
	"mime/multipart"
	"strings"

	"github.com/Nabinlamsal/dhune.np/internal/auth/dto"
	"github.com/Nabinlamsal/dhune.np/internal/auth/repository"
	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
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

func (s *AuthService) Signup(
	ctx context.Context,
	req dto.SignupRequestDTO,
	file *multipart.FileHeader,
) (*dto.SignupResponseDTO, error) {

	role := strings.ToLower(strings.TrimSpace(req.Role))
	if role != "user" && role != "business" && role != "vendor" {
		return nil, errors.New("invalid role")
	}

	// role based validations
	if role == "business" {
		if req.OwnerName == nil ||
			req.BusinessType == nil ||
			req.RegistrationNumber == nil {
			return nil, errors.New("missing required business fields")
		}
		if file == nil {
			return nil, errors.New("business document is required")
		}
	}

	if role == "vendor" {
		if req.OwnerName == nil ||
			req.Address == nil ||
			req.RegistrationNumber == nil {
			return nil, errors.New("missing required vendor fields")
		}
		if file == nil {
			return nil, errors.New("vendor document is required")
		}
	}

	// uniqueness checks
	if _, err := s.authRepo.FindUserByEmail(ctx, req.Email); err == nil {
		return nil, errors.New("email already registered")
	}
	if _, err := s.authRepo.FindUserByPhone(ctx, req.Phone); err == nil {
		return nil, errors.New("phone already registered")
	}

	// pwd hashing
	hashedPwd, err := s.pwdService.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}
	var docURL string

	if role == "business" || role == "vendor" {
		docURL, err = utils.UploadDocumentToCloudinary(
			ctx,
			file,
			"dhune/registration-documents",
		)
		if err != nil {
			return nil, err
		}
	}
	// transaction
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	qtx := db.New(tx)
	txRepo := repository.NewAuthRepository(qtx)

	// create user
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

	//role specific profile
	if role == "business" {
		_, err = txRepo.CreateBusinessUserProfile(ctx,
			db.CreateBusinessUserProfileParams{
				UserID:             user.ID,
				OwnerName:          *req.OwnerName,
				BusinessType:       *req.BusinessType,
				RegistrationNumber: *req.RegistrationNumber,
			})
		if err != nil {
			return nil, err
		}
	}

	if role == "vendor" {
		_, err = txRepo.CreateVendorProfile(ctx,
			db.CreateVendorProfileParams{
				UserID:             user.ID,
				OwnerName:          *req.OwnerName,
				Address:            *req.Address,
				RegistrationNumber: *req.RegistrationNumber,
			})
		if err != nil {
			return nil, err
		}
	}
	if role == "business" || role == "vendor" {
		docType := "business_registration"
		if role == "vendor" {
			docType = "vendor_registration"
		}

		_, err = txRepo.CreateDocument(ctx, db.CreateDocumentParams{
			UserID:       user.ID,
			DocumentType: docType,
			DocumentUrl:  docURL,
		})
		if err != nil {
			return nil, err
		}
	}

	//commit
	if err := tx.Commit(); err != nil {
		return nil, err
	}

	//responce
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

	//Global suspension check (applies to all roles)
	if !user.IsActive {
		return nil, errors.New("account is suspended")
	}

	//Role-based approval check
	switch user.Role {

	case "business":
		bp, err := s.authRepo.GetBusinessProfileByUserID(ctx, user.ID)
		if err != nil {
			return nil, errors.New("business profile not found")
		}
		if bp.ApprovalStatus != "approved" {
			return nil, errors.New("business account not approved or rejected")
		}

	case "vendor":
		vp, err := s.authRepo.GetVendorProfileByUserID(ctx, user.ID)
		if err != nil {
			return nil, errors.New("vendor profile not found")
		}
		if vp.ApprovalStatus != "approved" {
			return nil, errors.New("vendor account not approved")
		}

	case "user":
	//already applied in query

	case "admin":
		//admin bypasses all

	default:
		return nil, errors.New("invalid user role")
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
