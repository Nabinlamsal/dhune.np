package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/Nabinlamsal/dhune.np/internal/auth/middleware"
	"github.com/Nabinlamsal/dhune.np/internal/auth/service"
	"github.com/Nabinlamsal/dhune.np/internal/orders/controller"
)

func RegisterRequestRoutes(
	router *gin.Engine,
	requestHandler *controller.RequestHandler,
	jwtSvc service.JWTService,
) {

	requests := router.Group("/requests")
	requests.Use(middleware.JWTAuthMiddleware(jwtSvc))

	requests.POST("", requestHandler.Create)
	requests.GET("/me", requestHandler.ListMy)
	requests.GET("/me/stats", requestHandler.GetUserStats)
	requests.GET("/:id", requestHandler.GetByID)
	requests.PATCH("/:id/cancel", requestHandler.Cancel)

	marketplace := router.Group("/marketplace")
	marketplace.Use(
		middleware.JWTAuthMiddleware(jwtSvc),
		middleware.VendorOnly(),
	)

	marketplace.GET("/requests", requestHandler.ListMarketplace)

	admin := router.Group("/admin")
	admin.Use(
		middleware.JWTAuthMiddleware(jwtSvc),
		middleware.AdminOnly(),
	)

	admin.GET("/requests", requestHandler.ListAdmin)
	admin.GET("/requests/stats", requestHandler.GetAdminStats)
}
