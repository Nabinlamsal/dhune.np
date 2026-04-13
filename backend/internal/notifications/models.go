package notifications

import "time"

type DispatchInput struct {
	Type        string
	Title       string
	Body        string
	EntityType  string
	EntityID    string
	ActorUserID string
	UserIDs     []string
	Roles       []string
	Data        map[string]interface{}
	Persist     bool
	Push        bool
}

type Notification struct {
	ID          string                 `json:"id"`
	Type        string                 `json:"type"`
	Title       string                 `json:"title"`
	Body        string                 `json:"body"`
	EntityType  string                 `json:"entity_type,omitempty"`
	EntityID    string                 `json:"entity_id,omitempty"`
	ActorUserID string                 `json:"actor_user_id,omitempty"`
	Data        map[string]interface{} `json:"data,omitempty"`
	IsRead      bool                   `json:"is_read"`
	ReadAt      *time.Time             `json:"read_at,omitempty"`
	CreatedAt   time.Time              `json:"created_at"`
}

type DeviceTokenInput struct {
	Platform string  `json:"platform" binding:"required,oneof=android ios"`
	Token    string  `json:"token" binding:"required"`
	DeviceID *string `json:"device_id"`
}

type DeviceTokenDeleteInput struct {
	Token string `json:"token" binding:"required"`
}
