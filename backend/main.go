package main

import (
	"context"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"

	// config & db
	"github.com/Nabinlamsal/dhune.np/internal/config"
	db "github.com/Nabinlamsal/dhune.np/internal/database"

	// bootstrap
	"github.com/Nabinlamsal/dhune.np/internal/bootstrap"

	// middleware
	"github.com/Nabinlamsal/dhune.np/internal/auth/middleware"

	// AUTH
	authcontroller "github.com/Nabinlamsal/dhune.np/internal/auth/controller"
	authrepo "github.com/Nabinlamsal/dhune.np/internal/auth/repository"
	authroutes "github.com/Nabinlamsal/dhune.np/internal/auth/routes"
	authservice "github.com/Nabinlamsal/dhune.np/internal/auth/service"

	// USERS
	usercontroller "github.com/Nabinlamsal/dhune.np/internal/users/controller"
	userrepo "github.com/Nabinlamsal/dhune.np/internal/users/repository"
	userroutes "github.com/Nabinlamsal/dhune.np/internal/users/routes"
	userservice "github.com/Nabinlamsal/dhune.np/internal/users/service"

	// CATALOG
	categorycontroller "github.com/Nabinlamsal/dhune.np/internal/catalog/controller"
	categoryrepo "github.com/Nabinlamsal/dhune.np/internal/catalog/repository"
	categoryroutes "github.com/Nabinlamsal/dhune.np/internal/catalog/routes"
	categoryservice "github.com/Nabinlamsal/dhune.np/internal/catalog/service"

	// ORDERS MODULE (import once)
	ordercontroller "github.com/Nabinlamsal/dhune.np/internal/orders/controller"
	orderrepo "github.com/Nabinlamsal/dhune.np/internal/orders/repository"
	orderroutes "github.com/Nabinlamsal/dhune.np/internal/orders/routes"
	orderservice "github.com/Nabinlamsal/dhune.np/internal/orders/service"
)

func main() {

	fmt.Println("Dhune.np Backend Starting...")

	config.LoadEnv()

	conn, err := config.ConnectDB(&config.AppConfig)
	if err != nil {
		log.Fatal("DB connection failed:", err)
	}
	defer conn.Close()

	if err := bootstrap.SeedAdmin(context.Background(), conn); err != nil {
		log.Fatal("Admin seeding failed:", err)
	}

	queries := db.New(conn)

	//repositories
	authRepo := authrepo.NewAuthRepository(queries)
	userRepo := userrepo.NewUserRepoImpl(queries)
	commandRepo := userrepo.NewCommandRepoImpl(queries)

	categoryRepo := categoryrepo.NewCategoryRepository(queries)

	orderRepo := orderrepo.NewOrderRepository(queries)
	requestRepo := orderrepo.NewRequestRepositoryImpl(queries)
	offerRepo := orderrepo.NewOfferRepositoryImpl(queries)

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

	categoryService := categoryservice.NewCategoryService(categoryRepo)

	orderService := orderservice.NewOrderService(orderRepo)

	requestService := orderservice.NewRequestService(
		conn,
		requestRepo,
		categoryService, // CategoryValidator injection
	)

	offerService := orderservice.NewOfferService(
		conn,
		offerRepo,
		orderRepo,
		requestRepo,
	)

	//controllers
	authController := authcontroller.NewAuthController(authService)
	userController := usercontroller.NewUserController(userService)

	categoryController := categorycontroller.NewCategoryHandler(categoryService)

	// Orders sub-controllers (from same package)
	requestController := ordercontroller.NewRequestHandler(requestService)
	offerController := ordercontroller.NewOfferHandler(offerService)
	orderController := ordercontroller.NewOrderHandler(orderService)

	//routes
	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "dhune backend running"})
	})

	//routes
	authroutes.RegisterAuthRoutes(router, authController, jwtService)
	userroutes.RegisterAdminRoutes(router, userController, jwtService)

	categoryroutes.RegisterCategoryRoutes(router, categoryController, jwtService)

	orderroutes.RegisterRequestRoutes(router, requestController, jwtService)
	orderroutes.RegisterOfferRoutes(router, offerController, jwtService)
	orderroutes.RegisterOrderRoutes(router, orderController, jwtService)

	//start server
	log.Println("Server listening on port:", config.AppConfig.ServerPort)

	if err := router.Run(":" + config.AppConfig.ServerPort); err != nil {
		log.Fatal(err)
	}
}
