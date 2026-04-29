package notifications

import (
	"context"

	"firebase.google.com/go/v4/messaging"
)

type fcmSender struct {
	repo *Repository
}

func NewFCMSender(repo *Repository) PushSender {
	if repo == nil {
		return nil
	}
	return &fcmSender{repo: repo}
}

func (s *fcmSender) Send(ctx context.Context, userID string, input DispatchInput) error {
	client, err := messagingClient()
	if err != nil {
		return err
	}

	devices, err := s.repo.ListActiveDeviceTokens(ctx, userID)
	if err != nil {
		return err
	}

	for _, device := range devices {
		if device.Platform != "android" && device.Platform != "ios" {
			continue
		}

		_, err := client.Send(ctx, &messaging.Message{
			Token: device.Token,
			Notification: &messaging.Notification{
				Title: input.Title,
				Body:  input.Body,
			},
			Data: map[string]string{
				"type":        input.Type,
				"entity_type": input.EntityType,
				"entity_id":   input.EntityID,
			},
		})
		if err != nil {
			return err
		}
	}

	return nil
}
