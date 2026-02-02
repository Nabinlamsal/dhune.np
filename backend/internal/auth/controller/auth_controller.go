package controller

import (
	"net/http"

	"github.com/Nabinlamsal/dhune.np/internal/auth/dto"
	"github.com/Nabinlamsal/dhune.np/internal/auth/service"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	authService *service.AuthService
}

func NewAuthController(authService *service.AuthService) *AuthController {
	return &AuthController{authService: authService}
}

func (ac *AuthController) Signup(c *gin.Context) {
	var body dto.SignupRequestDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Error(c, 400, err.Error())
		return
	}

	resp, err := ac.authService.CreateUser(c.Request.Context(), body)
	if err != nil {
		utils.Error(c, 500, err.Error())
		return
	}
	utils.Created(c, resp)
}
func (ac *AuthController) Login(c *gin.Context) {
	var body dto.LoginRequestDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := ac.authService.Login(c.Request.Context(), body)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, err.Error())
		return
	}

	utils.Success(c, resp)
}
func (ac *AuthController) Me(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Error(c, http.StatusUnauthorized, "unauthorized")
		return
	}
	role, _ := c.Get("role")

	utils.Success(c, gin.H{
		"user_id": userID,
		"role":    role,
	})
}
