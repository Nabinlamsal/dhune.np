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

	body := utils.BuildDhuneEmail(utils.DhuneEmailInput{
		Title:   "Verify your Dhune.np email",
		Message: fmt.Sprintf("Hello %s, use this OTP to verify your Dhune.np account.", strings.TrimSpace(displayName)),
		Details: []utils.EmailDetailRow{
			{Label: "Verification OTP", Value: code},
			{Label: "Expires in", Value: fmt.Sprintf("%d seconds", s.otpExpirySeconds())},
		},
		Footer: "If you did not create a Dhune.np account, you can ignore this email.",
	})

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

	body := utils.BuildDhuneEmail(utils.DhuneEmailInput{
		Title:   "Reset your Dhune.np password",
		Message: fmt.Sprintf("Hello %s, use this OTP to reset your password.", strings.TrimSpace(displayName)),
		Details: []utils.EmailDetailRow{
			{Label: "Password reset OTP", Value: code},
			{Label: "Expires in", Value: fmt.Sprintf("%d seconds", s.otpExpirySeconds())},
		},
		Footer: "If you did not request a password reset, you can ignore this email.",
	})

	return utils.SendEmail(email, "Reset your password", body)
}
