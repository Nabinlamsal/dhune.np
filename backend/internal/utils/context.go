package utils

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetUserIDFromContext(ctx *gin.Context) (uuid.UUID, error) {
	userIdVal, exists := ctx.Get("user_id")
	if !exists {
		return uuid.Nil, errors.New("unauthorized")
	}

	switch v := userIdVal.(type) {
	case uuid.UUID:
		return v, nil
	case string:
		return uuid.Parse(v)
	default:
		return uuid.Nil, errors.New("invalid user id in context")
	}
}
