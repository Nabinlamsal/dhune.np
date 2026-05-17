package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/Nabinlamsal/dhune.np/internal/auth/middleware"
	"github.com/Nabinlamsal/dhune.np/internal/auth/service"
	"github.com/Nabinlamsal/dhune.np/internal/catalog/controller"
)

func RegisterSettingsRoutes(
	router *gin.Engine,
	settingsHandler *handler.SettingsHandler,
	jwtSvc service.JWTService,
) {
	// Admin routes
	admin := router.Group("/admin/settings")
	admin.Use(
		middleware.JWTAuthMiddleware(jwtSvc),
		middleware.AdminOnly(),
	)
	admin.GET("", settingsHandler.Get)
	admin.PUT("", settingsHandler.Update)
}
