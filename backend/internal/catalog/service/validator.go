package service

import (
	"context"

	"github.com/google/uuid"
)

type CategoryValidator interface {
	ValidateCategory(
		ctx context.Context,
		categoryID uuid.UUID,
		selectedUnit string,
	) error
}
