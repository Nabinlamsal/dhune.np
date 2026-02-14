package service

import "github.com/google/uuid"

type CreateCategoryInput struct {
	Name         string
	AllowedUnits []string
	Description  string
}

type UpdateCategoryInput struct {
	ID           uuid.UUID
	Name         string
	AllowedUnits []string
	Description  string
}

type CategoryOutput struct {
	ID           uuid.UUID `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	AllowedUnits []string  `json:"allowed_units"`
	IsActive     bool      `json:"is_active"`
}
