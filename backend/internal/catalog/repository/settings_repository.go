package repository

import (
	"context"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
)

type SettingsRepository interface {
	GetPlatformSettings(ctx context.Context) (db.PlatformSetting, error)
	UpdateCommissionPercentage(ctx context.Context, percentage string) (db.PlatformSetting, error)
}

type settingsRepo struct {
	q *db.Queries
}

func NewSettingsRepository(q *db.Queries) SettingsRepository {
	return &settingsRepo{q: q}
}

func (r *settingsRepo) GetPlatformSettings(ctx context.Context) (db.PlatformSetting, error) {
	return r.q.GetPlatformSettings(ctx)
}

func (r *settingsRepo) UpdateCommissionPercentage(ctx context.Context, percentage string) (db.PlatformSetting, error) {
	return r.q.UpdateCommissionPercentage(ctx, percentage)
}
