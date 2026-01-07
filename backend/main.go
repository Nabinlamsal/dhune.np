package main

import (
	"fmt"
	"log"

	"github.com/Nabinlamsal/dhune.np/internal/auth/controller"
	"github.com/Nabinlamsal/dhune.np/internal/auth/repository"
	"github.com/Nabinlamsal/dhune.np/internal/auth/routes"
	"github.com/Nabinlamsal/dhune.np/internal/auth/service"
	"github.com/Nabinlamsal/dhune.np/internal/config"
	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Server running for Dhune.np")

	config.LoadEnv()

	conn, err := config.ConnectDB(&config.AppConfig)
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}
	defer conn.Close()

	queries := db.New(conn)

	// repository
	authRepo := repository.NewAuthRepository(queries)

	// services
	passwordService := service.Password()
	jwtService := service.NewJWTService(config.AppConfig)

	authService := service.NewAuthService(
		authRepo,
		passwordService,
		jwtService,
		conn,
	)

	// controller
	authController := controller.NewAuthController(authService)

	// router
	router := gin.Default()

	// health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "auth-service running",
		})
	})

	// auth routes
	routes.RegisterAuthRoutes(router, authController, jwtService)

	log.Println("Auth service listening on port:", config.AppConfig.ServerPort)
	if err := router.Run(":" + config.AppConfig.ServerPort); err != nil {
		log.Fatal(err)
	}
}
