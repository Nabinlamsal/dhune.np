package routes

import (
	"github.com/Nabinlamsal/dhune.np/internal/auth/controller"
	"github.com/Nabinlamsal/dhune.np/internal/auth/middleware"
	"github.com/Nabinlamsal/dhune.np/internal/auth/service"
	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(
	router *gin.Engine,
	authController *controller.AuthController,
	jwtSvc service.JWTService,
) {

	auth := router.Group("/auth")
	{
		// public routes
		auth.POST("/signup", authController.Signup)
		auth.POST("/login", authController.Login)

		// protected routes
		auth.GET(
			"/me",
			middleware.JWTAuthMiddleware(jwtSvc),
			authController.Me,
		)
	}
}
