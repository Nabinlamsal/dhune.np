package events

type NotificationEvent struct {
	Title       string                 `json:"title"`
	Body        string                 `json:"body"`
	EntityType  string                 `json:"entity_type,omitempty"`
	EntityID    string                 `json:"entity_id,omitempty"`
	ActorUserID string                 `json:"actor_user_id,omitempty"`
	UserIDs     []string               `json:"user_ids,omitempty"`
	Roles       []string               `json:"roles,omitempty"`
	Data        map[string]interface{} `json:"data,omitempty"`
	Persist     bool                   `json:"persist"`
	Push        bool                   `json:"push"`
}
