package notifications

import (
	"context"
	"log"
	"strings"
	"sync"
)

type PushSender interface {
	Send(ctx context.Context, userID string, input DispatchInput) error
}

type noopPushSender struct{}

func (noopPushSender) Send(context.Context, string, DispatchInput) error {
	return nil
}

type Service struct {
	repo   *Repository
	sender PushSender
}

func NewService(repo *Repository, sender PushSender) *Service {
	if sender == nil {
		sender = noopPushSender{}
	}
	return &Service{
		repo:   repo,
		sender: sender,
	}
}

func (s *Service) Dispatch(ctx context.Context, input DispatchInput) error {
	userIDs, err := s.resolveRecipients(ctx, input)
	if err != nil {
		return err
	}

	for _, userID := range userIDs {
		if input.Persist {
			if err := s.repo.CreateNotification(ctx, userID, input); err != nil {
				log.Printf("notifications: persist failed for user %s: %v", userID, err)
			}
		}
		if input.Push {
			if err := s.sender.Send(ctx, userID, input); err != nil {
				log.Printf("notifications: push failed for user %s: %v", userID, err)
			}
		}
	}

	return nil
}

func (s *Service) ListByUser(ctx context.Context, userID string, limit, offset int, unreadOnly bool) ([]Notification, error) {
	return s.repo.ListByUser(ctx, userID, limit, offset, unreadOnly)
}

func (s *Service) CountUnread(ctx context.Context, userID string) (int64, error) {
	return s.repo.CountUnread(ctx, userID)
}

func (s *Service) MarkRead(ctx context.Context, userID, notificationID string) error {
	return s.repo.MarkRead(ctx, userID, notificationID)
}

func (s *Service) MarkAllRead(ctx context.Context, userID string) error {
	return s.repo.MarkAllRead(ctx, userID)
}

func (s *Service) RegisterDeviceToken(ctx context.Context, userID string, input DeviceTokenInput) error {
	input.Platform = strings.ToLower(strings.TrimSpace(input.Platform))
	return s.repo.UpsertDeviceToken(ctx, userID, input)
}

func (s *Service) RemoveDeviceToken(ctx context.Context, userID, token string) error {
	return s.repo.DeleteDeviceToken(ctx, userID, token)
}

func (s *Service) resolveRecipients(ctx context.Context, input DispatchInput) ([]string, error) {
	set := make(map[string]struct{})

	for _, userID := range input.UserIDs {
		if userID == "" {
			continue
		}
		set[userID] = struct{}{}
	}

	roleUserIDs, err := s.repo.FindUserIDsByRoles(ctx, input.Roles)
	if err != nil {
		return nil, err
	}
	for _, userID := range roleUserIDs {
		if userID == "" {
			continue
		}
		set[userID] = struct{}{}
	}

	result := make([]string, 0, len(set))
	for userID := range set {
		result = append(result, userID)
	}
	return result, nil
}

var (
	defaultService *Service
	serviceMu      sync.RWMutex
)

func SetDefaultService(service *Service) {
	serviceMu.Lock()
	defer serviceMu.Unlock()
	defaultService = service
}

func Dispatch(ctx context.Context, input DispatchInput) error {
	serviceMu.RLock()
	service := defaultService
	serviceMu.RUnlock()
	if service == nil {
		return nil
	}
	return service.Dispatch(ctx, input)
}
