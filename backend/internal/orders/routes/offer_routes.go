package routes

import (
	"github.com/Nabinlamsal/dhune.np/internal/orders/controller"
	"github.com/gin-gonic/gin"

	authMiddleware "github.com/Nabinlamsal/dhune.np/internal/auth/middleware"
	authService "github.com/Nabinlamsal/dhune.np/internal/auth/service"
)

func RegisterOfferRoutes(
	router *gin.Engine,
	offerHandler *controller.OfferHandler,
	jwtService authService.JWTService,
) {

	offers := router.Group("/offers")
	offers.Use(authMiddleware.JWTAuthMiddleware(jwtService))

	vendor := offers.Group("")
	vendor.Use(authMiddleware.VendorOnly())

	vendor.POST("/", offerHandler.Create)
	vendor.PUT("/:id", offerHandler.Update)
	vendor.DELETE("/:id", offerHandler.Withdraw)
	vendor.GET("/my", offerHandler.ListMyOffers)
	vendor.GET("/me/stats", offerHandler.VendorStats)

	user := offers.Group("")
	user.POST("/accept", offerHandler.Accept)
	user.GET("/request/:request_id", offerHandler.ListByRequest)
	user.GET("/:id/offers", offerHandler.RequestStats)

	admin := router.Group("/admin/offers")
	admin.Use(
		authMiddleware.JWTAuthMiddleware(jwtService),
		authMiddleware.AdminOnly(),
	)

	admin.GET("", offerHandler.ListAdmin)
	admin.GET("/stats", offerHandler.AdminStats)
}
