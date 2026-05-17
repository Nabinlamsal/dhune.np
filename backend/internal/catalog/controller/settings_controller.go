package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/Nabinlamsal/dhune.np/internal/catalog/service"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
)

type SettingsHandler struct {
	service *service.SettingsService
}

func NewSettingsHandler(service *service.SettingsService) *SettingsHandler {
	return &SettingsHandler{service: service}
}

type UpdateSettingsDTO struct {
	CommissionPercentage float64 `json:"commission_percentage" binding:"required"`
}

func (h *SettingsHandler) Get(c *gin.Context) {
	result, err := h.service.GetPlatformSettings(c.Request.Context())
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, result)
}

func (h *SettingsHandler) Update(c *gin.Context) {
	var req UpdateSettingsDTO

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := h.service.UpdateCommissionPercentage(c.Request.Context(), service.UpdateSettingsInput{
		CommissionPercentage: req.CommissionPercentage,
	})
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, result)
}
