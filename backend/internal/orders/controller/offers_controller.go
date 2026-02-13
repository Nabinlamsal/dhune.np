package handler

import (
	"net/http"
	"strconv"
	"time"

	"github.com/Nabinlamsal/dhune.np/internal/orders/dto"
	"github.com/Nabinlamsal/dhune.np/internal/orders/service"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type OfferHandler struct {
	service *service.OfferService
}

func NewOfferHandler(service *service.OfferService) *OfferHandler {
	return &OfferHandler{service: service}
}

func (h *OfferHandler) Create(c *gin.Context) {

	var req dto.CreateOfferDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	vendorID := c.MustGet("user_id").(uuid.UUID)

	requestID, _ := uuid.Parse(req.RequestID)

	completionTime, err := time.Parse(time.RFC3339, req.CompletionTime)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid completion_time format")
		return
	}

	input := service.CreateOfferInput{
		RequestID:      requestID,
		VendorID:       vendorID,
		BidPrice:       req.BidPrice,
		CompletionTime: completionTime,
		Description:    &req.Description,
	}

	result, err := h.service.Create(c.Request.Context(), input)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Created(c, dto.OfferResponseDTO{
		ID:        result.ID.String(),
		RequestID: result.RequestID.String(),
		BidPrice:  result.BidPrice,
		Status:    result.Status,
	})
}
func (h *OfferHandler) Update(c *gin.Context) {

	offerID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid offer id")
		return
	}

	var req dto.UpdateOfferDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	completionTime, err := time.Parse(time.RFC3339, req.CompletionTime)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid completion_time")
		return
	}

	input := service.UpdateOfferInput{
		OfferID:        offerID,
		BidPrice:       req.BidPrice,
		CompletionTime: completionTime,
		Description:    &req.Description,
	}

	result, err := h.service.Update(c.Request.Context(), input)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, dto.OfferResponseDTO{
		ID:        result.ID.String(),
		RequestID: result.RequestID.String(),
		BidPrice:  result.BidPrice,
		Status:    result.Status,
	})
}
func (h *OfferHandler) Withdraw(c *gin.Context) {

	offerID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid offer id")
		return
	}

	err = h.service.Withdraw(c.Request.Context(), offerID)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, dto.MessageResponseDTO{
		Message: "offer withdrawn successfully",
	})
}
func (h *OfferHandler) Accept(c *gin.Context) {

	var req dto.AcceptOfferDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	userID := c.MustGet("user_id").(uuid.UUID)
	offerID, _ := uuid.Parse(req.OfferID)

	input := service.AcceptOfferInput{
		OfferID: offerID,
		UserID:  userID,
	}

	_, err := h.service.Accept(c.Request.Context(), input)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, dto.AcceptedOfferResponseDTO{
		OfferResponseDTO: dto.OfferResponseDTO{
			ID: req.OfferID,
		},
	})
}

func (h *OfferHandler) ListByRequest(c *gin.Context) {

	requestID, err := uuid.Parse(c.Param("request_id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid request id")
		return
	}

	offers, err := h.service.ListByRequest(c.Request.Context(), requestID)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	var response []dto.OfferResponseDTO

	for _, o := range offers {
		price, _ := strconv.ParseFloat(o.BidPrice, 64)

		response = append(response, dto.OfferResponseDTO{
			ID:             o.ID.String(),
			RequestID:      o.RequestID.String(),
			BidPrice:       price,
			Status:         string(o.Status),
			CompletionTime: o.CompletionTime.Format(time.RFC3339),
		})
	}

	utils.Success(c, response)
}
func (h *OfferHandler) ListMyOffers(c *gin.Context) {

	vendorID := c.MustGet("user_id").(uuid.UUID)

	limit, offset := parsePagination(c)

	offers, err := h.service.ListByVendor(
		c.Request.Context(),
		vendorID,
		limit,
		offset,
	)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, offers)
}

func (h *OfferHandler) ListAdmin(c *gin.Context) {

	var filter dto.OfferAdminFilterDTO
	if err := c.ShouldBindQuery(&filter); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	if filter.Status != "" {
		_ = &filter.Status
	}

	limit, offset := parsePagination(c)

	offers, err := h.service.ListAdmin(
		c.Request.Context(),
		statid,
		nil,
		nil,
		limit,
		offset,
	)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, offers)
}
