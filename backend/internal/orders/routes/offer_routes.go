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

	user := offers.Group("")
	user.POST("/accept", offerHandler.Accept)
	user.GET("/request/:request_id", offerHandler.ListByRequest)

	admin := offers.Group("/admin")
	admin.Use(authMiddleware.AdminOnly())

	admin.GET("/offers", offerHandler.ListAdmin)
	admin.GET("/offers/stats", offerHandler.Stats)
}
