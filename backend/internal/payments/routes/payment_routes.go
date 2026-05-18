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
	publicPayments.GET("/orders/khalti/callback", paymentHandler.OrderKhaltiCallback)
	publicPayments.GET("/orders/esewa/pay/:order_id", paymentHandler.OrderEsewaPayPage)
	publicPayments.GET("/orders/esewa/callback", paymentHandler.OrderEsewaCallback)
	publicPayments.GET("/commissions/khalti/callback", paymentHandler.CommissionKhaltiCallback)
	publicPayments.GET("/commissions/esewa/pay", paymentHandler.CommissionEsewaPayPage)
	publicPayments.GET("/commissions/esewa/callback", paymentHandler.CommissionEsewaCallback)
	publicPayments.GET("/esewa/failure", paymentHandler.EsewaFailure)

	payments := router.Group("/payments")
	payments.Use(middleware.JWTAuthMiddleware(jwtSvc))

	payments.POST("/cash", paymentHandler.PayCash)
	payments.POST("/orders/:order_id/initiate", paymentHandler.InitiateOrderPayment)
	payments.POST("/commissions/initiate", paymentHandler.InitiateCommissionPayment)
}
