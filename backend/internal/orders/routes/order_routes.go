package routes

import (
	"github.com/Nabinlamsal/dhune.np/internal/auth/middleware"
	"github.com/Nabinlamsal/dhune.np/internal/auth/service"
	"github.com/Nabinlamsal/dhune.np/internal/orders/controller"
	"github.com/gin-gonic/gin"
)

func RegisterOrderRoutes(
	router *gin.Engine,
	orderHandler *controller.OrderHandler,
	jwtSvc service.JWTService,
) {

	// USER routes
	user := router.Group("/orders")
	user.Use(middleware.JWTAuthMiddleware(jwtSvc))

	user.GET("/my", orderHandler.ListMy)
	user.GET("/:id", orderHandler.GetByID)
	user.PATCH("/:id/cancel", orderHandler.Cancel)

	// VENDOR routes
	vendor := router.Group("/vendor/orders")
	vendor.Use(
		middleware.JWTAuthMiddleware(jwtSvc),
		middleware.VendorOnly(),
	)

	vendor.GET("", orderHandler.ListVendor)
	vendor.PATCH("/:id/status", orderHandler.UpdateStatus)

	// ADMIN routes
	admin := router.Group("/admin/orders")
	admin.Use(
		middleware.JWTAuthMiddleware(jwtSvc),
		middleware.AdminOnly(),
	)

	admin.GET("", orderHandler.ListAdmin)
	admin.GET("/stats", orderHandler.GetStats)
}
