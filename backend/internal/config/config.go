package config

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type EnvConfig struct {
	DatabaseURL           string
	ServerPort            string
	JWTSecret             string
	JwtAccessMinutes      time.Duration
	JwtRefreshMinutes     time.Duration
	KhaltiSecretKey       string
	KhaltiPaymentURL      string
	KhaltiVerificationURL string
	EsewaProductCode      string
	EsewaSecretKey        string
	EsewaGatewayURL       string
	BackendURL            string
	WebsiteURL            string
	PublicBackendURL      string
	AppScheme             string
	GroqAPIKey            string
	GroqModel             string
}

var AppConfig EnvConfig

func LoadEnv() {
	// Try loading from current folder, then from project root
	if err := godotenv.Load(".env"); err != nil {
		godotenv.Load("../../.env")
	}

	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("DB_URL is required in .env")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET is required in .env")
	}
	jwtAccessMinutes, err := strconv.Atoi(os.Getenv("JWT_ACCESS_MINUTES"))
	if err != nil {
		log.Fatal("JWT_ACCESS_MINUTES is required in .env")
	}
	jwtRefreshMinutes, err := strconv.Atoi(os.Getenv("JWT_REFRESH_MINUTES"))
	if err != nil {
		log.Fatal("JWT_REFRESH_MINUTES is required in .env")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8111"
	}

	AppConfig = EnvConfig{
		DatabaseURL:           dbURL,
		ServerPort:            port,
		JWTSecret:             jwtSecret,
		JwtAccessMinutes:      time.Duration(jwtAccessMinutes) * time.Minute,
		JwtRefreshMinutes:     time.Duration(jwtRefreshMinutes) * time.Minute,
		KhaltiSecretKey:       os.Getenv("KHALTI_SECRET_KEY"),
		KhaltiPaymentURL:      os.Getenv("KHALTI_PAYMENT_URL"),
		KhaltiVerificationURL: os.Getenv("KHALTI_VERIFICATION_URL"),
		EsewaProductCode:      os.Getenv("ESEWA_PRODUCT_CODE"),
		EsewaSecretKey:        os.Getenv("ESEWA_SECRET_KEY"),
		EsewaGatewayURL:       os.Getenv("ESEWA_GATEWAY_URL"),
		BackendURL:            os.Getenv("BACKEND_URL"),
		WebsiteURL:            os.Getenv("WEBSITE_URL"),
		PublicBackendURL:      os.Getenv("PUBLIC_BACKEND_URL"),
		AppScheme:             os.Getenv("APP_SCHEME"),
		GroqAPIKey:            os.Getenv("GROQ_API_KEY"),
		GroqModel:             os.Getenv("GROQ_MODEL"),
	}

	if AppConfig.GroqModel == "" {
		AppConfig.GroqModel = "llama-3.1-8b-instant"
	}
}
