package controller

import (
	"net/http"
	"strconv"
	"time"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
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

	vendorIDStr := c.MustGet("user_id").(string)

	vendorID, err := uuid.Parse(vendorIDStr)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "invalid user id")
		return
	}

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
		ID:             result.ID.String(),
		RequestID:      result.RequestID.String(),
		BidPrice:       result.BidPrice,
		Status:         result.Status,
		CompletionTime: result.CompletionTime.Format(time.RFC3339),
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
		ID:             result.ID.String(),
		RequestID:      result.RequestID.String(),
		BidPrice:       result.BidPrice,
		Status:         result.Status,
		CompletionTime: result.CompletionTime.Format(time.RFC3339),
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

	userIDStr := c.MustGet("user_id").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "invalid user id")
		return
	}

	offerID, err := uuid.Parse(req.OfferID)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid offer id")
		return
	}

	input := service.AcceptOfferInput{
		OfferID: offerID,
		UserID:  userID,
	}

	result, err := h.service.Accept(c.Request.Context(), input)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, gin.H{
		"order_id": result.OrderID.String(),
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

	vendorIDStr := c.MustGet("user_id").(string)
	vendorID, err := uuid.Parse(vendorIDStr)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "invalid user id")
		return
	}
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

	var status db.NullOfferStatus
	if filter.Status != "" {
		status = db.NullOfferStatus{
			OfferStatus: db.OfferStatus(filter.Status),
			Valid:       true,
		}
	}

	var vendorID uuid.NullUUID
	if filter.VendorID != "" {
		id, err := uuid.Parse(filter.VendorID)
		if err != nil {
			utils.Error(c, http.StatusBadRequest, "invalid vendor_id")
			return
		}
		vendorID = uuid.NullUUID{UUID: id, Valid: true}
	}

	var requestID uuid.NullUUID
	if filter.RequestID != "" {
		id, err := uuid.Parse(filter.RequestID)
		if err != nil {
			utils.Error(c, http.StatusBadRequest, "invalid request_id")
			return
		}
		requestID = uuid.NullUUID{UUID: id, Valid: true}
	}

	limit, offset := parsePagination(c)

	offers, err := h.service.ListAdmin(
		c.Request.Context(),
		status,
		vendorID,
		requestID,
		limit,
		offset,
	)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, offers)
}
func (h *OfferHandler) Stats(c *gin.Context) {

	stats, err := h.service.GetStats(c.Request.Context())
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, gin.H{
		"total_offers":     stats.TotalOffers,
		"pending_offers":   stats.PendingOffers,
		"accepted_offers":  stats.AcceptedOffers,
		"rejected_offers":  stats.RejectedOffers,
		"withdrawn_offers": stats.WithdrawnOffers,
		"expired_offers":   stats.ExpiredOffers,
	})
}
