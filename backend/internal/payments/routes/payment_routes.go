package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/Nabinlamsal/dhune.np/internal/auth/middleware"
	authService "github.com/Nabinlamsal/dhune.np/internal/auth/service"
	handler "github.com/Nabinlamsal/dhune.np/internal/payments/controller"
)

func RegisterPaymentRoutes(
	router *gin.Engine,
	paymentHandler *handler.PaymentHandler,
	jwtSvc authService.JWTService,
) {
	publicPayments := router.Group("/payments")
	publicPayments.GET("/khalti/callback", paymentHandler.KhaltiCallback)

	payments := router.Group("/payments")
	payments.Use(middleware.JWTAuthMiddleware(jwtSvc))

	payments.POST("/cash", paymentHandler.PayCash)
	payments.POST("/khalti/initiate", paymentHandler.InitiateKhalti)
	payments.POST("/khalti/verify", paymentHandler.VerifyKhalti)
}
