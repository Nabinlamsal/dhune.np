package service

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type ActionTokenClaims struct {
	Purpose string `json:"purpose"`
	Email   string `json:"email"`
	jwt.RegisteredClaims
}

func (j *jwtService) generateActionToken(userID uuid.UUID, email, purpose string, expiry time.Duration) (string, error) {
	now := time.Now()

	claims := ActionTokenClaims{
		Purpose: purpose,
		Email:   email,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID.String(),
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(expiry)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(j.secret))
}

func (j *jwtService) GenerateEmailVerificationToken(userID uuid.UUID, email string) (string, error) {
	return j.generateActionToken(userID, email, "email_verification", 24*time.Hour)
}

func (j *jwtService) GeneratePasswordResetToken(userID uuid.UUID, email string) (string, error) {
	return j.generateActionToken(userID, email, "password_reset", time.Hour)
}

func (j *jwtService) ValidateActionToken(tokenStr, purpose string) (*ActionTokenClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &ActionTokenClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(j.secret), nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*ActionTokenClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}
	if claims.Purpose != purpose {
		return nil, errors.New("invalid token purpose")
	}

	return claims, nil
}
