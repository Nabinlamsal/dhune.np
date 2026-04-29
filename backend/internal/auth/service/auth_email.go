package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/google/uuid"
)

func (s *AuthService) sendVerificationOTPEmail(
	ctx context.Context,
	userID uuid.UUID,
	email, displayName string,
) error {
	code, err := generateOTP(6)
	if err != nil {
		return err
	}

	if err := s.replaceOTP(ctx, userID, email, otpPurposeEmailVerification, code); err != nil {
		return err
	}

	body := fmt.Sprintf(
		"<p>Hello %s,</p><p>Your Dhune email verification OTP is <strong>%s</strong>.</p><p>This OTP expires in %d seconds.</p>",
		strings.TrimSpace(displayName),
		code,
		s.otpExpirySeconds(),
	)

	return utils.SendEmail(email, "Verify your email", body)
}

func (s *AuthService) sendPasswordResetOTPEmail(
	ctx context.Context,
	userID uuid.UUID,
	email, displayName string,
) error {
	code, err := generateOTP(6)
	if err != nil {
		return err
	}

	if err := s.replaceOTP(ctx, userID, email, otpPurposePasswordReset, code); err != nil {
		return err
	}

	body := fmt.Sprintf(
		"<p>Hello %s,</p><p>Your Dhune password reset OTP is <strong>%s</strong>.</p><p>This OTP expires in %d seconds.</p>",
		strings.TrimSpace(displayName),
		code,
		s.otpExpirySeconds(),
	)

	return utils.SendEmail(email, "Reset your password", body)
}
