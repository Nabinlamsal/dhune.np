package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/Nabinlamsal/dhune.np/internal/catalog/service"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
)

type CategoryHandler struct {
	service *service.CategoryService
}

func NewCategoryHandler(service *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{service: service}
}

type CreateCategoryDTO struct {
	Name         string   `json:"name" binding:"required"`
	Description  string   `json:"description"`
	AllowedUnits []string `json:"allowed_units" binding:"required"`
}

func (h *CategoryHandler) Create(c *gin.Context) {
	var req CreateCategoryDTO

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := h.service.Create(c.Request.Context(), service.CreateCategoryInput{
		Name:         req.Name,
		AllowedUnits: req.AllowedUnits,
		Description:  req.Description,
	})
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Created(c, result)
}

func (h *CategoryHandler) ListActive(c *gin.Context) {
	result, err := h.service.ListActive(c.Request.Context())
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, result)
}

func (h *CategoryHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid id")
		return
	}

	var req CreateCategoryDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := h.service.Update(c.Request.Context(), service.UpdateCategoryInput{
		ID:           id,
		Name:         req.Name,
		AllowedUnits: req.AllowedUnits,
		Description:  req.Description,
	})
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, result)
}

func (h *CategoryHandler) Deactivate(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid id")
		return
	}

	if err := h.service.SetActive(c.Request.Context(), id, false); err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, gin.H{"message": "category deactivated"})
}
