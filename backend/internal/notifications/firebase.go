package notifications

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"strings"
	"sync"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
	"google.golang.org/api/option"
)

var (
	firebaseInitOnce sync.Once
	firebaseClient   *messaging.Client
	firebaseInitErr  error
)

func InitFirebase(ctx context.Context) error {
	firebaseInitOnce.Do(func() {
		projectID := strings.TrimSpace(os.Getenv("FIREBASE_PROJECT_ID"))
		clientEmail := strings.TrimSpace(os.Getenv("FIREBASE_CLIENT_EMAIL"))
		privateKey := strings.ReplaceAll(strings.TrimSpace(os.Getenv("FIREBASE_PRIVATE_KEY")), `\n`, "\n")

		if projectID == "" || clientEmail == "" || privateKey == "" {
			firebaseInitErr = errors.New("firebase credentials are incomplete")
			return
		}

		credentialsJSON, err := json.Marshal(map[string]string{
			"type":         "service_account",
			"project_id":   projectID,
			"client_email": clientEmail,
			"private_key":  privateKey,
			"token_uri":    "https://oauth2.googleapis.com/token",
		})
		if err != nil {
			firebaseInitErr = err
			return
		}

		app, err := firebase.NewApp(ctx, &firebase.Config{ProjectID: projectID}, option.WithCredentialsJSON(credentialsJSON))
		if err != nil {
			firebaseInitErr = err
			return
		}

		firebaseClient, firebaseInitErr = app.Messaging(ctx)
	})

	return firebaseInitErr
}

func messagingClient() (*messaging.Client, error) {
	if firebaseClient == nil {
		if firebaseInitErr != nil {
			return nil, firebaseInitErr
		}
		return nil, errors.New("firebase messaging client is not initialized")
	}
	return firebaseClient, nil
}
