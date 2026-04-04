package routes

import (
	"github.com/Nabinlamsal/dhune.np/internal/auth/middleware"
	authservice "github.com/Nabinlamsal/dhune.np/internal/auth/service"
	disputecontroller "github.com/Nabinlamsal/dhune.np/internal/disputes/controller"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	router *gin.Engine,
	controller *disputecontroller.Controller,
	jwtSvc authservice.JWTService,
) {
	disputes := router.Group("/disputes")
	disputes.Use(middleware.JWTAuthMiddleware(jwtSvc))
	disputes.POST("", controller.Create)
	disputes.GET("/my", controller.ListMy)

	admin := router.Group("/admin/disputes")
	admin.Use(
		middleware.JWTAuthMiddleware(jwtSvc),
		middleware.AdminOnly(),
	)
	admin.GET("", controller.ListAdmin)
	admin.GET("/:id", controller.GetAdminDetail)
	admin.PATCH("/:id/resolve", controller.Resolve)
}
