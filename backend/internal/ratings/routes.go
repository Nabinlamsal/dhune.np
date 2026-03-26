package ratings

import (
	"github.com/Nabinlamsal/dhune.np/internal/auth/middleware"
	"github.com/Nabinlamsal/dhune.np/internal/auth/service"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	router *gin.Engine,
	controller *Controller,
	jwtSvc service.JWTService,
) {
	user := router.Group("/ratings")
	user.Use(middleware.JWTAuthMiddleware(jwtSvc))
	user.POST("", controller.AddOrUpdate)

	vendor := router.Group("/vendor/ratings")
	vendor.Use(
		middleware.JWTAuthMiddleware(jwtSvc),
		middleware.VendorOnly(),
	)
	vendor.GET("", controller.VendorDashboard)

	admin := router.Group("/admin/ratings")
	admin.Use(
		middleware.JWTAuthMiddleware(jwtSvc),
		middleware.AdminOnly(),
	)
	admin.GET("/top-rated-vendors", controller.AdminTopRated)
	admin.GET("/vendors/:vendorId/reviews", controller.AdminVendorReviews)
}
