package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"mime/multipart"
	"os"
	"strings"
	"time"

	"github.com/Nabinlamsal/dhune.np/internal/auth/dto"
	"github.com/Nabinlamsal/dhune.np/internal/auth/repository"
	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/events"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/google/uuid"
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
	if !utils.IsValidPhone(req.Phone) {
		return nil, errors.New("phone must be exactly 10 digits")
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

	if role == "user" {
		if err := s.sendVerificationEmail(ctx, user.ID, user.Email); err != nil {
			log.Printf("send verification email failed for %s: %v", user.Email, err)
		}
	}

	adminBody := user.DisplayName + " registered as " + role + "."
	if role == "vendor" || role == "business" {
		adminBody = user.DisplayName + " registered as " + role + " and is waiting for admin approval."
	}

	events.EmitEvent(events.Event{
		Type: "USER_REGISTERED",
		Data: events.NotificationEvent{
			Title:   "New user registration",
			Body:    adminBody,
			Roles:   []string{"admin"},
			Persist: true,
			Push:    false,
			Data: map[string]interface{}{
				"user_id":         user.ID.String(),
				"display_name":    user.DisplayName,
				"role":            role,
				"requires_review": role == "vendor" || role == "business",
			},
			EntityType:  "user",
			EntityID:    user.ID.String(),
			ActorUserID: user.ID.String(),
		},
	})

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

func (s *AuthService) VerifyEmail(ctx context.Context, token string) error {
	claims, err := s.jwtService.ValidateActionToken(token, "email_verification")
	if err != nil {
		return errors.New("invalid or expired verification token")
	}

	userID, err := uuid.Parse(claims.Subject)
	if err != nil {
		return errors.New("invalid verification token")
	}

	user, err := s.authRepo.FindUserByID(ctx, userID)
	if err != nil {
		return err
	}
	if user.Role != "user" {
		return errors.New("email verification is only available for users")
	}
	if user.IsVerified {
		return nil
	}

	return s.authRepo.VerifyUserEmail(ctx, userID)
}

func (s *AuthService) ForgotPassword(ctx context.Context, req dto.ForgotPasswordRequestDTO) error {
	user, err := s.authRepo.FindUserByEmail(ctx, strings.TrimSpace(req.Email))
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil
		}
		return err
	}

	resetToken, err := s.jwtService.GeneratePasswordResetToken(user.ID, user.Email)
	if err != nil {
		return err
	}

	resetURL := strings.TrimRight(os.Getenv("FRONTEND_URL"), "/") + "/reset-password?token=" + resetToken
	body := fmt.Sprintf(
		"<p>Hello %s,</p><p>Reset your password by clicking <a href=\"%s\">here</a>.</p><p>This link expires in 1 hour.</p>",
		user.DisplayName,
		resetURL,
	)

	if err := utils.SendEmail(user.Email, "Reset your password", body); err != nil {
		return err
	}

	return nil
}

func (s *AuthService) ResetPassword(ctx context.Context, req dto.ResetPasswordRequestDTO) error {
	claims, err := s.jwtService.ValidateActionToken(req.Token, "password_reset")
	if err != nil {
		return errors.New("invalid or expired reset token")
	}

	userID, err := uuid.Parse(claims.Subject)
	if err != nil {
		return errors.New("invalid reset token")
	}

	hashedPwd, err := s.pwdService.HashPassword(req.NewPassword)
	if err != nil {
		return err
	}

	return s.authRepo.UpdateUserPassword(ctx, userID, hashedPwd)
}

func (s *AuthService) ChangePassword(ctx context.Context, userID uuid.UUID, req dto.ChangePasswordRequestDTO) error {
	user, err := s.authRepo.FindUserByID(ctx, userID)
	if err != nil {
		return err
	}

	if err := s.pwdService.ComparePasswords(user.PasswordHash, req.OldPassword); err != nil {
		return errors.New("old password is incorrect")
	}

	hashedPwd, err := s.pwdService.HashPassword(req.NewPassword)
	if err != nil {
		return err
	}

	return s.authRepo.UpdateUserPassword(ctx, userID, hashedPwd)
}

func (s *AuthService) GoogleLogin(ctx context.Context, req dto.GoogleLoginRequestDTO) (*dto.LoginResponseDTO, error) {
	tokenInfo, err := verifyGoogleIDToken(ctx, req.IDToken)
	if err != nil {
		return nil, errors.New("invalid google token")
	}

	email := strings.TrimSpace(tokenInfo.Email)
	if email == "" {
		return nil, errors.New("google email not found")
	}

	displayName := "Google User"
	if strings.TrimSpace(tokenInfo.Name) != "" {
		displayName = strings.TrimSpace(tokenInfo.Name)
	}

	user, err := s.authRepo.FindUserByEmail(ctx, email)
	if err != nil {
		if !errors.Is(err, sql.ErrNoRows) {
			return nil, err
		}

		tempPassword, hashErr := s.pwdService.HashPassword(uuid.NewString())
		if hashErr != nil {
			return nil, hashErr
		}

		tx, txErr := s.db.BeginTx(ctx, nil)
		if txErr != nil {
			return nil, txErr
		}
		defer tx.Rollback()

		qtx := db.New(tx)
		txRepo := repository.NewAuthRepository(qtx)

		user, err = txRepo.CreateUser(ctx, db.CreateUserParams{
			DisplayName:  displayName,
			Email:        email,
			Phone:        generateGooglePhone(),
			PasswordHash: tempPassword,
			Role:         "user",
		})
		if err != nil {
			return nil, err
		}
		if err := txRepo.VerifyUserEmail(ctx, user.ID); err != nil {
			return nil, err
		}
		if err := tx.Commit(); err != nil {
			return nil, err
		}
	}

	return s.buildLoginResponse(user)
}

func (s *AuthService) sendVerificationEmail(ctx context.Context, userID uuid.UUID, email string) error {
	token, err := s.jwtService.GenerateEmailVerificationToken(userID, email)
	if err != nil {
		return err
	}

	verifyURL := strings.TrimRight(os.Getenv("FRONTEND_URL"), "/") + "/verify-email?token=" + token
	body := fmt.Sprintf(
		"<p>Hello,</p><p>Verify your email by clicking <a href=\"%s\">here</a>.</p><p>This link expires in 24 hours.</p>",
		verifyURL,
	)

	return utils.SendEmail(email, "Verify your email", body)
}

func (s *AuthService) buildLoginResponse(user db.User) (*dto.LoginResponseDTO, error) {
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

func generateGooglePhone() string {
	return fmt.Sprintf("9%09d", time.Now().UnixNano()%1000000000)
}
