package service

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/Nabinlamsal/dhune.np/internal/catalog/repository"
)

type PlatformSettingsOutput struct {
	ID                   int32     `json:"id"`
	CommissionPercentage string    `json:"commission_percentage"`
	UpdatedAt            time.Time `json:"updated_at"`
}

type UpdateSettingsInput struct {
	CommissionPercentage float64 `json:"commission_percentage"`
}

type SettingsService struct {
	repo repository.SettingsRepository
}

func NewSettingsService(repo repository.SettingsRepository) *SettingsService {
	return &SettingsService{repo: repo}
}

func (s *SettingsService) GetPlatformSettings(ctx context.Context) (*PlatformSettingsOutput, error) {
	setting, err := s.repo.GetPlatformSettings(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get platform settings: %w", err)
	}

	return &PlatformSettingsOutput{
		ID:                   setting.ID,
		CommissionPercentage: setting.CommissionPercentage,
		UpdatedAt:            setting.UpdatedAt,
	}, nil
}

func (s *SettingsService) UpdateCommissionPercentage(ctx context.Context, input UpdateSettingsInput) (*PlatformSettingsOutput, error) {
	if input.CommissionPercentage < 0 || input.CommissionPercentage > 100 {
		return nil, fmt.Errorf("invalid commission percentage, must be between 0 and 100")
	}

	percentageStr := strconv.FormatFloat(input.CommissionPercentage, 'f', 2, 64)

	setting, err := s.repo.UpdateCommissionPercentage(ctx, percentageStr)
	if err != nil {
		return nil, fmt.Errorf("failed to update commission percentage: %w", err)
	}

	return &PlatformSettingsOutput{
		ID:                   setting.ID,
		CommissionPercentage: setting.CommissionPercentage,
		UpdatedAt:            setting.UpdatedAt,
	}, nil
}
