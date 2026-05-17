package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/Nabinlamsal/dhune.np/internal/auth/middleware"
	authService "github.com/Nabinlamsal/dhune.np/internal/auth/service"
	"github.com/Nabinlamsal/dhune.np/internal/finance/controller"
)

func RegisterFinanceRoutes(
	router *gin.Engine,
	financeHandler *handler.FinanceHandler,
	jwtSvc authService.JWTService,
) {
	admin := router.Group("/admin/finance")
	admin.Use(
		middleware.JWTAuthMiddleware(jwtSvc),
		middleware.AdminOnly(),
	)
	admin.GET("/dashboard", financeHandler.GetAdminDashboardStats)
	admin.GET("/settlements", financeHandler.ListAdminSettlements)
	admin.POST("/settlements/:id/verify", financeHandler.VerifySettlement)

	vendor := router.Group("/vendor/finance")
	vendor.Use(
		middleware.JWTAuthMiddleware(jwtSvc),
		middleware.VendorOnly(),
	)
	vendor.GET("/dashboard", financeHandler.GetVendorDashboardStats)
	vendor.POST("/settlements", financeHandler.CreateVendorSettlement)
	vendor.GET("/settlements", financeHandler.ListVendorSettlements)
	vendor.GET("/commissions", financeHandler.ListVendorCommissions)
}
