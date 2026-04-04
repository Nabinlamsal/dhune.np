package controller

import (
	"net/http"

	disputedto "github.com/Nabinlamsal/dhune.np/internal/disputes/dto"
	disputeservice "github.com/Nabinlamsal/dhune.np/internal/disputes/service"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/gin-gonic/gin"
)

type Controller struct {
	service *disputeservice.Service
}

func NewController(service *disputeservice.Service) *Controller {
	return &Controller{service: service}
}

func (h *Controller) Create(c *gin.Context) {
	var body disputedto.CreateDisputeDTO
	if err := c.ShouldBind(&body); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	role := c.GetString("role")
	if role != "user" && role != "vendor" {
		utils.Error(c, http.StatusForbidden, "only users or vendors can create disputes")
		return
	}

	var imageURL *string
	if body.ImageURL != "" {
		imageURL = &body.ImageURL
	}

	file, _ := c.FormFile("image")

	result, err := h.service.Create(c.Request.Context(), disputeservice.CreateDisputeInput{
		OrderID:     body.OrderID,
		RaisedBy:    role,
		RaisedByID:  c.MustGet("user_id").(string),
		DisputeType: body.DisputeType,
		Description: body.Description,
		ImageURL:    imageURL,
		ImageFile:   file,
	})
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Created(c, mapSummary(*result))
}

func (h *Controller) ListMy(c *gin.Context) {
	role := c.GetString("role")
	if role != "user" && role != "vendor" {
		utils.Error(c, http.StatusForbidden, "only users or vendors can view disputes")
		return
	}

	limit, offset := parsePagination(c)

	rows, err := h.service.ListMy(
		c.Request.Context(),
		role,
		c.MustGet("user_id").(string),
		limit,
		offset,
	)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, mapSummaryList(rows))
}

func (h *Controller) ListAdmin(c *gin.Context) {
	var status *string
	if value := c.Query("status"); value != "" {
		status = &value
	}

	limit, offset := parsePagination(c)

	rows, err := h.service.ListAdmin(c.Request.Context(), status, limit, offset)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, mapAdminSummaryList(rows))
}

func (h *Controller) GetAdminDetail(c *gin.Context) {
	result, err := h.service.GetAdminDetail(c.Request.Context(), c.Param("id"))
	if err != nil {
		utils.Error(c, http.StatusNotFound, err.Error())
		return
	}

	utils.Success(c, mapDetail(result))
}

func (h *Controller) Resolve(c *gin.Context) {
	var body disputedto.ResolveDisputeDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := h.service.Resolve(c.Request.Context(), disputeservice.ResolveDisputeInput{
		DisputeID:        c.Param("id"),
		Decision:         body.Decision,
		AdjustmentAmount: body.AdjustmentAmount,
		AdminNote:        body.AdminNote,
	})
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, mapSummary(*result))
}
