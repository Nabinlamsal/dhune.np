package service

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
	"math/big"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
)

const (
	otpPurposeEmailVerification = "email_verification"
	otpPurposePasswordReset     = "password_reset"
	defaultOTPExpirySeconds     = 300
)

type otpRecord struct {
	ID        uuid.UUID
	CodeHash  string
	ExpiresAt time.Time
}

func (s *AuthService) otpExpiry() time.Duration {
	raw := strings.TrimSpace(os.Getenv("OTP_EXPIRY_SECONDS"))
	if raw == "" {
		return time.Duration(defaultOTPExpirySeconds) * time.Second
	}

	seconds, err := strconv.Atoi(raw)
	if err != nil || seconds <= 0 {
		return time.Duration(defaultOTPExpirySeconds) * time.Second
	}

	return time.Duration(seconds) * time.Second
}

func (s *AuthService) otpExpirySeconds() int {
	return int(s.otpExpiry() / time.Second)
}

func generateOTP(length int) (string, error) {
	if length <= 0 {
		length = 6
	}

	var builder strings.Builder
	builder.Grow(length)

	for i := 0; i < length; i++ {
		n, err := rand.Int(rand.Reader, big.NewInt(10))
		if err != nil {
			return "", err
		}
		builder.WriteByte(byte('0') + byte(n.Int64()))
	}

	return builder.String(), nil
}

func hashOTP(code string) string {
	sum := sha256.Sum256([]byte(strings.TrimSpace(code)))
	return hex.EncodeToString(sum[:])
}

func (s *AuthService) replaceOTP(
	ctx context.Context,
	userID uuid.UUID,
	email, purpose, code string,
) error {
	expiresAt := time.Now().UTC().Add(s.otpExpiry())

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.ExecContext(ctx, `
		DELETE FROM auth_otp_codes
		WHERE user_id = $1
		  AND purpose = $2
		  AND consumed_at IS NULL
	`, userID, purpose); err != nil {
		return err
	}

	if _, err := tx.ExecContext(ctx, `
		INSERT INTO auth_otp_codes (
			user_id,
			email,
			purpose,
			code_hash,
			expires_at
		) VALUES ($1, $2, $3, $4, $5)
	`, userID, strings.TrimSpace(email), purpose, hashOTP(code), expiresAt); err != nil {
		return err
	}

	return tx.Commit()
}

func (s *AuthService) consumeOTP(
	ctx context.Context,
	userID uuid.UUID,
	purpose, code string,
) error {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var record otpRecord
	err = tx.QueryRowContext(ctx, `
		SELECT id, code_hash, expires_at
		FROM auth_otp_codes
		WHERE user_id = $1
		  AND purpose = $2
		  AND consumed_at IS NULL
		ORDER BY created_at DESC
		LIMIT 1
	`, userID, purpose).Scan(&record.ID, &record.CodeHash, &record.ExpiresAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return fmt.Errorf("otp not found or expired")
		}
		return err
	}

	if time.Now().UTC().After(record.ExpiresAt) {
		return fmt.Errorf("otp expired")
	}

	if record.CodeHash != hashOTP(code) {
		return fmt.Errorf("invalid otp")
	}

	if _, err := tx.ExecContext(ctx, `
		UPDATE auth_otp_codes
		SET consumed_at = now(),
		    updated_at = now()
		WHERE id = $1
	`, record.ID); err != nil {
		return err
	}

	return tx.Commit()
}
