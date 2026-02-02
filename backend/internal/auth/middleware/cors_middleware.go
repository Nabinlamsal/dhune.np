package middleware

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"os"
	"time"
)

func CORSMiddleware() gin.HandlerFunc {
	frontendURL := os.Getenv("FRONTEND_URL")

	// Fallback for local development
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	return cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}
