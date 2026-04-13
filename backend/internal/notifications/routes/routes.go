package routes

import (
	"github.com/Nabinlamsal/dhune.np/internal/auth/middleware"
	authservice "github.com/Nabinlamsal/dhune.np/internal/auth/service"
	"github.com/Nabinlamsal/dhune.np/internal/notifications"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine, controller *notifications.Controller, jwtSvc authservice.JWTService) {
	group := router.Group("/notifications")
	group.Use(middleware.JWTAuthMiddleware(jwtSvc))

	group.GET("", controller.ListMy)
	group.GET("/unread-count", controller.UnreadCount)
	group.PATCH("/:id/read", controller.MarkRead)
	group.PATCH("/read-all", controller.MarkAllRead)
	group.POST("/devices", controller.RegisterDeviceToken)
	group.DELETE("/devices", controller.DeleteDeviceToken)
}
