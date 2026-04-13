package notifications

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"strings"
	"time"

	"github.com/lib/pq"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

type notificationRow struct {
	ID          string
	Type        string
	Title       string
	Body        string
	EntityType  sql.NullString
	EntityID    sql.NullString
	ActorUserID sql.NullString
	Data        []byte
	IsRead      bool
	ReadAt      sql.NullTime
	CreatedAt   time.Time
}

func (r *Repository) CreateNotification(
	ctx context.Context,
	userID string,
	input DispatchInput,
) error {
	payload, err := json.Marshal(input.Data)
	if err != nil {
		return err
	}

	_, err = r.db.ExecContext(ctx, `
		INSERT INTO notifications (
			user_id,
			type,
			title,
			body,
			entity_type,
			entity_id,
			actor_user_id,
			data
		) VALUES ($1, $2, $3, $4, NULLIF($5, ''), NULLIF($6, '')::uuid, NULLIF($7, '')::uuid, $8::jsonb)
	`,
		userID,
		input.Type,
		input.Title,
		input.Body,
		input.EntityType,
		input.EntityID,
		input.ActorUserID,
		string(payload),
	)
	if ignoreUndefinedTable(err) {
		return nil
	}
	return err
}

func (r *Repository) ListByUser(
	ctx context.Context,
	userID string,
	limit, offset int,
	unreadOnly bool,
) ([]Notification, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id::text, type, title, body, entity_type, entity_id::text, actor_user_id::text, data, is_read, read_at, created_at
		FROM notifications
		WHERE user_id = $1
		  AND ($2 = FALSE OR is_read = FALSE)
		ORDER BY created_at DESC
		LIMIT $3 OFFSET $4
	`, userID, unreadOnly, limit, offset)
	if ignoreUndefinedTable(err) {
		return []Notification{}, nil
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make([]Notification, 0)
	for rows.Next() {
		var row notificationRow
		if err := rows.Scan(
			&row.ID,
			&row.Type,
			&row.Title,
			&row.Body,
			&row.EntityType,
			&row.EntityID,
			&row.ActorUserID,
			&row.Data,
			&row.IsRead,
			&row.ReadAt,
			&row.CreatedAt,
		); err != nil {
			return nil, err
		}

		result = append(result, mapNotification(row))
	}

	return result, rows.Err()
}

func (r *Repository) CountUnread(ctx context.Context, userID string) (int64, error) {
	var count int64
	err := r.db.QueryRowContext(ctx, `
		SELECT COUNT(*)
		FROM notifications
		WHERE user_id = $1 AND is_read = FALSE
	`, userID).Scan(&count)
	if ignoreUndefinedTable(err) {
		return 0, nil
	}
	return count, err
}

func (r *Repository) MarkRead(ctx context.Context, userID, notificationID string) error {
	_, err := r.db.ExecContext(ctx, `
		UPDATE notifications
		SET is_read = TRUE,
		    read_at = now(),
		    updated_at = now()
		WHERE id = $1::uuid AND user_id = $2::uuid
	`, notificationID, userID)
	if ignoreUndefinedTable(err) {
		return nil
	}
	return err
}

func (r *Repository) MarkAllRead(ctx context.Context, userID string) error {
	_, err := r.db.ExecContext(ctx, `
		UPDATE notifications
		SET is_read = TRUE,
		    read_at = now(),
		    updated_at = now()
		WHERE user_id = $1::uuid AND is_read = FALSE
	`, userID)
	if ignoreUndefinedTable(err) {
		return nil
	}
	return err
}

func (r *Repository) UpsertDeviceToken(ctx context.Context, userID string, input DeviceTokenInput) error {
	_, err := r.db.ExecContext(ctx, `
		INSERT INTO push_device_tokens (
			user_id,
			platform,
			token,
			device_id,
			is_active,
			last_seen_at
		) VALUES ($1::uuid, $2, $3, $4, TRUE, now())
		ON CONFLICT (token)
		DO UPDATE SET
			user_id = EXCLUDED.user_id,
			platform = EXCLUDED.platform,
			device_id = EXCLUDED.device_id,
			is_active = TRUE,
			last_seen_at = now(),
			updated_at = now()
	`, userID, strings.ToLower(input.Platform), input.Token, nullableString(input.DeviceID))
	if ignoreUndefinedTable(err) {
		return nil
	}
	return err
}

func (r *Repository) DeleteDeviceToken(ctx context.Context, userID, token string) error {
	_, err := r.db.ExecContext(ctx, `
		UPDATE push_device_tokens
		SET is_active = FALSE,
		    updated_at = now()
		WHERE user_id = $1::uuid AND token = $2
	`, userID, token)
	if ignoreUndefinedTable(err) {
		return nil
	}
	return err
}

func (r *Repository) FindUserIDsByRoles(ctx context.Context, roles []string) ([]string, error) {
	if len(roles) == 0 {
		return nil, nil
	}

	rows, err := r.db.QueryContext(ctx, `
		SELECT id::text
		FROM users
		WHERE role = ANY($1)
		  AND is_active = TRUE
	`, pq.Array(roles))
	if ignoreUndefinedTable(err) {
		return []string{}, nil
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make([]string, 0)
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		result = append(result, id)
	}
	return result, rows.Err()
}

func mapNotification(row notificationRow) Notification {
	item := Notification{
		ID:        row.ID,
		Type:      row.Type,
		Title:     row.Title,
		Body:      row.Body,
		IsRead:    row.IsRead,
		CreatedAt: row.CreatedAt,
	}

	if row.EntityType.Valid {
		item.EntityType = row.EntityType.String
	}
	if row.EntityID.Valid {
		item.EntityID = row.EntityID.String
	}
	if row.ActorUserID.Valid {
		item.ActorUserID = row.ActorUserID.String
	}
	if row.ReadAt.Valid {
		item.ReadAt = &row.ReadAt.Time
	}
	if len(row.Data) > 0 {
		_ = json.Unmarshal(row.Data, &item.Data)
	}

	return item
}

func nullableString(value *string) interface{} {
	if value == nil || strings.TrimSpace(*value) == "" {
		return nil
	}
	return strings.TrimSpace(*value)
}

func ignoreUndefinedTable(err error) bool {
	if err == nil {
		return false
	}
	var pqErr *pq.Error
	if errors.As(err, &pqErr) {
		return pqErr.Code == "42P01"
	}
	return false
}
