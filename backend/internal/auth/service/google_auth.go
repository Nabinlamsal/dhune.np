package service

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"time"
)

type googleTokenInfo struct {
	Email            string `json:"email"`
	Name             string `json:"name"`
	Audience         string `json:"aud"`
	EmailVerified    string `json:"email_verified"`
	ExpiresInSeconds string `json:"expires_in"`
}

func verifyGoogleIDToken(ctx context.Context, token string) (*googleTokenInfo, error) {
	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodGet,
		"https://oauth2.googleapis.com/tokeninfo?id_token="+token,
		nil,
	)
	if err != nil {
		return nil, err
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("invalid google token")
	}

	var info googleTokenInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return nil, err
	}

	if info.Audience != os.Getenv("GOOGLE_CLIENT_ID") {
		return nil, errors.New("google token client mismatch")
	}
	if info.Email == "" || info.EmailVerified != "true" {
		return nil, errors.New("google email not verified")
	}

	return &info, nil
}
