package repository

import (
	"context"
	"database/sql"
)

type PublicCategory struct {
	Name         string
	Description  sql.NullString
	AllowedUnits []byte
}

type Repository interface {
	ListActiveCategories(ctx context.Context) ([]PublicCategory, error)
	SaveMessage(ctx context.Context, sessionID string, question string, answer string, source string) error
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

func (r *repository) ListActiveCategories(ctx context.Context) ([]PublicCategory, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT name, description, allowed_units::text
		FROM categories
		WHERE is_active = TRUE
		ORDER BY name ASC
		LIMIT 20
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []PublicCategory
	for rows.Next() {
		var category PublicCategory
		if err := rows.Scan(&category.Name, &category.Description, &category.AllowedUnits); err != nil {
			return nil, err
		}
		categories = append(categories, category)
	}

	return categories, rows.Err()
}

func (r *repository) SaveMessage(ctx context.Context, sessionID string, question string, answer string, source string) error {
	var session sql.NullString
	if sessionID != "" {
		session = sql.NullString{String: sessionID, Valid: true}
	}

	var sourceValue sql.NullString
	if source != "" {
		sourceValue = sql.NullString{String: source, Valid: true}
	}

	_, err := r.db.ExecContext(ctx, `
		INSERT INTO chatbot_messages (session_id, question, answer, source, created_at, updated_at)
		VALUES ($1, $2, $3, $4, NOW(), NOW())
	`, session, question, answer, sourceValue)

	return err
}
