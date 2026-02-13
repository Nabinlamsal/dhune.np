package handler

import (
	"encoding/json"
	"net/http"
	"time"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/orders/dto"
	"github.com/Nabinlamsal/dhune.np/internal/orders/service"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type RequestHandler struct {
	service *service.RequestService
}

func NewRequestHandler(service *service.RequestService) *RequestHandler {
	return &RequestHandler{service: service}
}
func (h *RequestHandler) Create(c *gin.Context) {
	var req dto.CreateRequestDTO

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	userID := c.MustGet("user_id").(uuid.UUID)

	pickupFrom, err := time.Parse(time.RFC3339, req.PickupTimeFrom)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid pickup_time_from")
		return
	}

	pickupTo, err := time.Parse(time.RFC3339, req.PickupTimeTo)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid pickup_time_to")
		return
	}

	var services []service.CreateRequestServiceInput

	for _, s := range req.Services {
		categoryID, err := uuid.Parse(s.CategoryID)
		if err != nil {
			utils.Error(c, http.StatusBadRequest, "invalid category_id")
			return
		}

		var itemsJSON []byte
		if s.ItemsJSON != nil {
			bytes, err := json.Marshal(s.ItemsJSON)
			if err != nil {
				utils.Error(c, http.StatusBadRequest, "invalid items_json")
				return
			}
			itemsJSON = bytes
		}

		var desc *string
		if s.Description != "" {
			desc = &s.Description
		}

		services = append(services, service.CreateRequestServiceInput{
			CategoryID:    categoryID,
			SelectedUnit:  db.PricingUnit(s.SelectedUnit),
			QuantityValue: s.QuantityValue,
			ItemsJSON:     itemsJSON,
			Description:   desc,
		})
	}

	input := service.CreateRequestInput{
		UserID:         userID,
		PickupAddress:  req.PickupAddress,
		PickupTimeFrom: pickupFrom,
		PickupTimeTo:   pickupTo,
		PaymentMethod:  db.PaymentMethod(req.PaymentMethod),
		Services:       services,
	}

	result, err := h.service.Create(c.Request.Context(), input)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Created(c, h.mapDetailToDTO(result))
}
func (h *RequestHandler) GetByID(c *gin.Context) {
	requestID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid request id")
		return
	}

	result, err := h.service.GetDetail(c.Request.Context(), requestID)
	if err != nil {
		utils.Error(c, http.StatusNotFound, err.Error())
		return
	}

	utils.Success(c, h.mapDetailToDTO(result))
}
func (h *RequestHandler) Cancel(c *gin.Context) {
	requestID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid request id")
		return
	}

	if err := h.service.Cancel(c.Request.Context(), requestID); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, dto.MessageResponseDTO{
		Message: "request cancelled successfully",
	})
}
func (h *RequestHandler) ListMy(c *gin.Context) {
	userID := c.MustGet("user_id").(uuid.UUID)

	limit, offset := parsePagination(c)

	requests, err := h.service.ListByUser(
		c.Request.Context(),
		userID,
		limit,
		offset,
	)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, h.mapSummaryList(requests))
}
func (h *RequestHandler) ListMarketplace(c *gin.Context) {
	limit, offset := parsePagination(c)

	requests, err := h.service.ListMarketplace(
		c.Request.Context(),
		limit,
		offset,
	)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, h.mapSummaryList(requests))
}
func (h *RequestHandler) ListAdmin(c *gin.Context) {
	var status *db.RequestsStatus

	if s := c.Query("status"); s != "" {
		tmp := db.RequestsStatus(s)
		status = &tmp
	}

	limit, offset := parsePagination(c)

	requests, err := h.service.ListAdmin(
		c.Request.Context(),
		status,
		limit,
		offset,
	)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, h.mapSummaryList(requests))
}
