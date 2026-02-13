package service

import "github.com/google/uuid"

type CreateCategoryInput struct {
	Name         string
	AllowedUnits []string
}

type UpdateCategoryInput struct {
	ID           uuid.UUID
	Name         string
	AllowedUnits []string
}

type CategoryOutput struct {
	ID           uuid.UUID
	Name         string
	Description  string
	AllowedUnits []string
	IsActive     bool
}
