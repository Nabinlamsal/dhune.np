package events

import (
	"context"
	"fmt"
	"log"
	"reflect"
	"strings"

	"github.com/Nabinlamsal/dhune.np/internal/notifications"
	"github.com/Nabinlamsal/dhune.np/internal/ws"
)

func HandleEvent(event Event) {
	if payload, ok := event.Data.(NotificationEvent); ok {
		handleNotificationEvent(event.Type, payload)
		return
	}

	msg := ws.Message{
		Type: event.Type,
		Data: event.Data,
	}

	switch event.Type {
	case "REQUEST_CREATED":
		ws.BroadcastToRole("vendor", msg)

	case "OFFER_CREATED":
		userID := firstID(event.Data,
			"requestOwnerId", "requestOwnerID",
			"userId", "userID", "ownerId", "ownerID",
		)
		if userID != "" {
			ws.SendToUser(userID, msg)
		} else {
			ws.BroadcastToRole("user", msg)
		}

	case "OFFER_ACCEPTED":
		vendorID := firstID(event.Data, "vendorId", "vendorID")
		if vendorID != "" {
			ws.SendToVendor(vendorID, msg)
		} else {
			ws.BroadcastToRole("vendor", msg)
		}

	default:
		ws.BroadcastToRole("user", msg)
		ws.BroadcastToRole("vendor", msg)
	}

	// TODO: send push notification for offline users
}

func handleNotificationEvent(eventType string, payload NotificationEvent) {
	msg := ws.Message{
		Type: eventType,
		Data: map[string]interface{}{
			"title":         payload.Title,
			"body":          payload.Body,
			"entity_type":   payload.EntityType,
			"entity_id":     payload.EntityID,
			"actor_user_id": payload.ActorUserID,
			"data":          payload.Data,
		},
	}

	for _, userID := range payload.UserIDs {
		if userID == "" {
			continue
		}
		ws.SendToUser(userID, msg)
	}

	for _, role := range payload.Roles {
		if role == "" {
			continue
		}
		ws.BroadcastToRole(role, msg)
	}

	if err := notifications.Dispatch(context.Background(), notifications.DispatchInput{
		Type:        eventType,
		Title:       payload.Title,
		Body:        payload.Body,
		EntityType:  payload.EntityType,
		EntityID:    payload.EntityID,
		ActorUserID: payload.ActorUserID,
		UserIDs:     payload.UserIDs,
		Roles:       payload.Roles,
		Data:        payload.Data,
		Persist:     payload.Persist,
		Push:        payload.Push,
	}); err != nil {
		log.Printf("events: notification dispatch failed for %s: %v", eventType, err)
	}
}

func firstID(data interface{}, keys ...string) string {
	for _, key := range keys {
		if id, ok := extractID(data, key); ok && id != "" {
			return id
		}
	}
	return ""
}

func extractID(data interface{}, key string) (string, bool) {
	if data == nil {
		return "", false
	}

	v := reflect.ValueOf(data)
	for v.Kind() == reflect.Pointer {
		if v.IsNil() {
			return "", false
		}
		v = v.Elem()
	}

	switch v.Kind() {
	case reflect.Map:
		for _, mapKey := range v.MapKeys() {
			if mapKey.Kind() != reflect.String {
				continue
			}
			if !equalKey(mapKey.String(), key) {
				continue
			}
			raw := v.MapIndex(mapKey)
			if !raw.IsValid() {
				return "", false
			}
			return fmt.Sprint(raw.Interface()), true
		}
	case reflect.Struct:
		t := v.Type()
		for i := range t.NumField() {
			field := t.Field(i)
			if !field.IsExported() {
				continue
			}
			if !equalKey(field.Name, key) {
				continue
			}
			return fmt.Sprint(v.Field(i).Interface()), true
		}
	}

	return "", false
}

func equalKey(a, b string) bool {
	normalize := func(s string) string {
		return strings.ToLower(strings.ReplaceAll(s, "_", ""))
	}
	return normalize(a) == normalize(b)
}
