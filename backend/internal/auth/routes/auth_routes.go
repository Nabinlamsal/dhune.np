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
		auth.GET("/verify-email", authController.VerifyEmail)
		auth.POST("/forgot-password", authController.ForgotPassword)
		auth.POST("/reset-password", authController.ResetPassword)
		auth.POST("/google-login", authController.GoogleLogin)

		// protected routes
		auth.GET(
			"/me",
			middleware.JWTAuthMiddleware(jwtSvc),
			authController.Me,
		)
		auth.PUT(
			"/change-password",
			middleware.JWTAuthMiddleware(jwtSvc),
			authController.ChangePassword,
		)
	}
}
