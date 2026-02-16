package controller

import (
	"net/http"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/orders/service"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type OrderHandler struct {
	service *service.OrderService
}

func NewOrderHandler(service *service.OrderService) *OrderHandler {
	return &OrderHandler{service: service}
}
func (h *OrderHandler) GetByID(c *gin.Context) {

	orderID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid order id")
		return
	}

	order, err := h.service.GetByID(c.Request.Context(), orderID)
	if err != nil {
		utils.Error(c, http.StatusNotFound, err.Error())
		return
	}

	utils.Success(c, order)
}
func (h *OrderHandler) ListMy(c *gin.Context) {

	userIDStr := c.MustGet("user_id").(string)

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "invalid user id")
		return
	}
	limit, offset := parsePagination(c)

	orders, err := h.service.ListByUser(
		c.Request.Context(),
		userID,
		limit,
		offset,
	)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, orders)
}

func (h *OrderHandler) ListVendor(c *gin.Context) {

	vendorIDStr := c.MustGet("user_id").(string)

	vendorID, err := uuid.Parse(vendorIDStr)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "invalid user id")
		return
	}
	limit, offset := parsePagination(c)

	orders, err := h.service.ListByVendor(
		c.Request.Context(),
		vendorID,
		limit,
		offset,
	)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, orders)
}

func (h *OrderHandler) UpdateStatus(c *gin.Context) {

	orderID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid order id")
		return
	}

	var body struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	err = h.service.UpdateStatus(
		c.Request.Context(),
		service.UpdateOrderStatusInput{
			OrderID: orderID,
			Status:  body.Status,
		},
	)

	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, gin.H{"message": "order status updated"})
}
func (h *OrderHandler) Cancel(c *gin.Context) {

	orderID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid order id")
		return
	}

	err = h.service.Cancel(c.Request.Context(), orderID)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, gin.H{"message": "order cancelled"})
}
func (h *OrderHandler) ListAdmin(c *gin.Context) {

	var status *db.OrderStatus

	if s := c.Query("status"); s != "" {
		tmp := db.OrderStatus(s)
		status = &tmp
	}

	limit, offset := parsePagination(c)

	orders, err := h.service.ListAdmin(
		c.Request.Context(),
		status,
		limit,
		offset,
	)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, orders)
}
func (h *OrderHandler) GetStats(c *gin.Context) {

	stats, err := h.service.GetStats(c.Request.Context())
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, stats)
}
