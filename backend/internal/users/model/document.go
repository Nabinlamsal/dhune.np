package model

import (
	"time"

	"github.com/google/uuid"
)

type Document struct {
	ID           uuid.UUID
	DocumentType string
	DocumentURL  string
	Verified     bool
	CreatedAt    time.Time
}
