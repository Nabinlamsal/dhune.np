package middleware

import (
	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/gin-gonic/gin"
)

func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {

		if c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}
		role := c.GetString("role")

		if role != "admin" {
			utils.Error(c, 403, "error: Role must be Admin")
			return
		}
		c.Next()
	}
}
func VendorOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}
		role := c.GetString("role")

		if role != "vendor" {
			utils.Error(c, 403, "error: Role must be Admin")
			return
		}
		c.Next()
	}
}
