package service

import (
	"context"
	"errors"
	"fmt"
	"log"
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

	return sendOTPEmail(email, otpPurposeEmailVerification, "Verify your email", body)
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

	return sendOTPEmail(email, otpPurposePasswordReset, "Reset your password", body)
}

func sendOTPEmail(email, purpose, subject, body string) error {
	log.Printf("email: otp send attempted purpose=%s recipient=%s", purpose, strings.TrimSpace(email))

	if !utils.EmailDeliveryEnabled() {
		log.Printf("email: otp send skipped purpose=%s recipient=%s delivery_enabled=false", purpose, strings.TrimSpace(email))
		return nil
	}

	if err := utils.SendEmail(email, subject, body); err != nil {
		log.Printf("email: otp send failed purpose=%s recipient=%s: %v", purpose, strings.TrimSpace(email), err)
		return errors.New("unable to send email right now")
	}

	log.Printf("email: otp send succeeded purpose=%s recipient=%s", purpose, strings.TrimSpace(email))
	return nil
}
