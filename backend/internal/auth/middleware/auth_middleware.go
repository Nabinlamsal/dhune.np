package middleware

import (
	"net/http"
	"strings"

	"github.com/Nabinlamsal/dhune.np/internal/auth/service"
	"github.com/gin-gonic/gin"
)

func JWTAuthMiddleware(jwtSvc service.JWTService) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "authorization header missing",
			})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "authorization header format must be Bearer {token}",
			})
			return
		}

		tokenStr := parts[1]

		claims, err := jwtSvc.ValidateToken(tokenStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "invalid or expired token",
			})
			return
		}

		// Put user info into context
		c.Set("user_id", claims.Subject)
		c.Set("role", claims.Role)

		c.Next()
	}
}
