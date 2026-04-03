package events

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/Nabinlamsal/dhune.np/internal/ws"
)

func HandleEvent(event Event) {
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
