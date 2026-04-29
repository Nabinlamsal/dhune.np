package routes

import (
	"github.com/Nabinlamsal/dhune.np/internal/auth/middleware"
	"github.com/Nabinlamsal/dhune.np/internal/auth/service"
	"github.com/Nabinlamsal/dhune.np/internal/users/controller"
	"github.com/gin-gonic/gin"
)

func RegisterAdminRoutes(
	router *gin.Engine,
	userController *controller.UserController,
	serviceJwt service.JWTService,
) {
	admin := router.Group("admin")

	admin.Use(middleware.JWTAuthMiddleware(serviceJwt), middleware.AdminOnly())

	admin.GET("users", userController.GetFilteredUsers)
	admin.GET("users/:id/profile", userController.GetUserDetail)

	//commands
	// user governance commands
	admin.PATCH("/users/:id/suspend", userController.SuspendUser)
	admin.PATCH("/users/:id/reactivate", userController.ReactivateUser)

	// vendor approval commands
	admin.PATCH("/vendors/:id/approve", userController.ApproveVendor)
	admin.PATCH("/vendors/:id/reject", userController.RejectVendor)

	// business approval commands
	admin.PATCH("/business/:id/approve", userController.ApproveBusinessUser)
	admin.PATCH("/business/:id/reject", userController.RejectBusinessUser)
}
func RegisterUserRoutes(
	router *gin.Engine,
	userController *controller.UserController,
	serviceJwt service.JWTService,
) {
	user := router.Group("user")
	user.Use(middleware.JWTAuthMiddleware(serviceJwt))
	user.GET("/me/profile", userController.GetMyProfile)
	user.PUT("/me/profile", userController.UpdateMyProfile)
	user.PUT("/me/photo", userController.UploadProfileImage)
	user.DELETE("/me/photo", userController.DeleteProfileImage)
	user.POST("/upload-profile-image", userController.UploadProfileImage)
}
