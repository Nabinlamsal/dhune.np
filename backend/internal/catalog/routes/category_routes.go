package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/Nabinlamsal/dhune.np/internal/auth/middleware"
	"github.com/Nabinlamsal/dhune.np/internal/auth/service"
	"github.com/Nabinlamsal/dhune.np/internal/catalog/controller"
)

func RegisterCategoryRoutes(
	router *gin.Engine,
	categoryHandler *handler.CategoryHandler,
	jwtSvc service.JWTService,
) {

	// Public route
	router.GET("/categories/active", categoryHandler.ListActive)

	// Admin routes
	admin := router.Group("/admin/categories")
	admin.Use(
		middleware.JWTAuthMiddleware(jwtSvc),
		middleware.AdminOnly(),
	)
	admin.GET("categories", categoryHandler.ListAll)
	admin.POST("", categoryHandler.Create)
	admin.PUT("/:id", categoryHandler.Update)
	admin.PATCH("/:id/deactivate", categoryHandler.Deactivate)
}
