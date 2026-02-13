package service

import (
	"context"
	"errors"

	"github.com/Nabinlamsal/dhune.np/internal/catalog/repository"
	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/google/uuid"
)

type CategoryService struct {
	repo repository.CategoryRepository
}

func NewCategoryService(repo repository.CategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

func (s *CategoryService) Create(
	ctx context.Context,
	input CreateCategoryInput,
) (*CategoryOutput, error) {

	if input.Name == "" {
		return nil, errors.New("category name required")
	}

	units, err := convertToPricingUnits(input.AllowedUnits)
	if err != nil {
		return nil, err
	}

	cat, err := s.repo.Create(ctx, db.CreateCategoryParams{
		Name:         input.Name,
		AllowedUnits: units,
	})
	if err != nil {
		return nil, err
	}

	return mapCategory(cat), nil
}

func (s *CategoryService) Update(
	ctx context.Context,
	input UpdateCategoryInput,
) (*CategoryOutput, error) {

	units, err := convertToPricingUnits(input.AllowedUnits)
	if err != nil {
		return nil, err
	}

	cat, err := s.repo.Update(ctx, db.UpdateCategoryParams{
		ID:           input.ID,
		Name:         input.Name,
		AllowedUnits: units,
	})
	if err != nil {
		return nil, err
	}

	return mapCategory(cat), nil
}

func (s *CategoryService) ListActive(
	ctx context.Context,
) ([]CategoryOutput, error) {

	rows, err := s.repo.ListActive(ctx)
	if err != nil {
		return nil, err
	}

	var result []CategoryOutput
	for _, c := range rows {
		result = append(result, *mapCategory(c))
	}

	return result, nil
}

func (s *CategoryService) SetActive(
	ctx context.Context,
	id uuid.UUID,
	active bool,
) error {
	return s.repo.SetActiveStatus(ctx, id, active)
}

func (s *CategoryService) ValidateCategory(
	ctx context.Context,
	categoryID uuid.UUID,
	selectedUnit string,
) error {

	cat, err := s.repo.GetByID(ctx, categoryID)
	if err != nil {
		return err
	}

	if !cat.IsActive {
		return errors.New("category is inactive")
	}

	allowed := false
	for _, unit := range cat.AllowedUnits {
		if string(unit) == selectedUnit {
			allowed = true
			break
		}
	}

	if !allowed {
		return errors.New("selected unit not allowed for this category")
	}

	return nil
}

func convertToPricingUnits(units []string) ([]db.PricingUnit, error) {
	var result []db.PricingUnit

	for _, u := range units {
		switch db.PricingUnit(u) {
		case db.PricingUnitKG,
			db.PricingUnitSQFT,
			db.PricingUnitITEMS:
			result = append(result, db.PricingUnit(u))
		default:
			return nil, errors.New("invalid pricing unit: " + u)
		}
	}

	return result, nil
}

func mapCategory(cat db.Category) *CategoryOutput {
	var units []string
	for _, u := range cat.AllowedUnits {
		units = append(units, string(u))
	}

	return &CategoryOutput{
		ID:           cat.ID,
		Name:         cat.Name,
		Description:  cat.Description.String,
		AllowedUnits: units,
		IsActive:     cat.IsActive,
	}
}
