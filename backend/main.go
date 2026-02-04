package main

import (
	"context"
	"fmt"
	"log"

	"github.com/Nabinlamsal/dhune.np/internal/auth/middleware"
	"github.com/Nabinlamsal/dhune.np/internal/bootstrap"
	"github.com/gin-gonic/gin"

	// config & db
	"github.com/Nabinlamsal/dhune.np/internal/config"
	db "github.com/Nabinlamsal/dhune.np/internal/database"

	// auth layer
	authcontroller "github.com/Nabinlamsal/dhune.np/internal/auth/controller"
	authrepo "github.com/Nabinlamsal/dhune.np/internal/auth/repository"
	authroutes "github.com/Nabinlamsal/dhune.np/internal/auth/routes"
	authservice "github.com/Nabinlamsal/dhune.np/internal/auth/service"

	// users layer
	usercontroller "github.com/Nabinlamsal/dhune.np/internal/users/controller"
	userrepo "github.com/Nabinlamsal/dhune.np/internal/users/repository"
	userroutes "github.com/Nabinlamsal/dhune.np/internal/users/routes"
	userservice "github.com/Nabinlamsal/dhune.np/internal/users/service"
)

func main() {
	fmt.Println("Server running for Dhune.np")

	// load env
	config.LoadEnv()

	// connect db
	conn, err := config.ConnectDB(&config.AppConfig)
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}
	defer conn.Close()

	//seed admin
	if err := bootstrap.SeedAdmin(context.Background(), conn); err != nil {
		log.Fatal("failed to seed admin:", err)
	}
	queries := db.New(conn)

	//repositories
	authRepo := authrepo.NewAuthRepository(queries)
	userRepo := userrepo.NewUserRepoImpl(queries)
	commandRepo := userrepo.NewCommandRepoImpl(queries)

	//services
	passwordService := authservice.Password()
	jwtService := authservice.NewJWTService(config.AppConfig)
	authService := authservice.NewAuthService(
		authRepo,
		passwordService,
		jwtService,
		conn,
	)
	userService := userservice.NewUserService(
		commandRepo,
		userRepo,
	)

	//controllers
	authController := authcontroller.NewAuthController(authService)
	userController := usercontroller.NewUserController(userService)

	//router
	router := gin.Default()
	//cors
	router.Use(middleware.CORSMiddleware())
	// health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "auth-service running",
		})
	})

	//app routes
	authroutes.RegisterAuthRoutes(router, authController, jwtService)
	userroutes.RegisterAdminRoutes(router, userController, jwtService)

	// start server
	log.Println("Server listening on port:", config.AppConfig.ServerPort)
	if err := router.Run(":" + config.AppConfig.ServerPort); err != nil {
		log.Fatal(err)
	}
}
