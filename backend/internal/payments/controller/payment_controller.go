package handler

import (
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/Nabinlamsal/dhune.np/internal/config"
	"github.com/Nabinlamsal/dhune.np/internal/payments/service"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
)

type PaymentHandler struct {
	service *service.PaymentService
}

func NewPaymentHandler(service *service.PaymentService) *PaymentHandler {
	return &PaymentHandler{service: service}
}

type PayCashDTO struct {
	OrderID uuid.UUID `json:"order_id" binding:"required"`
}

type InitiateKhaltiDTO struct {
	OrderID      uuid.UUID `json:"order_id" binding:"required"`
	Amount       float64   `json:"amount"`
	PurchaseID   string    `json:"purchase_order_id"`
	PurchaseName string    `json:"purchase_order_name"`
	ReturnURL    string    `json:"return_url"`
}

type VerifyKhaltiDTO struct {
	Pidx string `json:"pidx" binding:"required"`
}

func (h *PaymentHandler) PayCash(c *gin.Context) {
	userID, err := utils.GetUserIDFromContext(c)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req PayCashDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	payment, err := h.service.PayCash(c.Request.Context(), req.OrderID, userID)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, payment)
}

func (h *PaymentHandler) InitiateKhalti(c *gin.Context) {
	userID, err := utils.GetUserIDFromContext(c)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req InitiateKhaltiDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := h.service.InitiateKhalti(c.Request.Context(), userID, service.InitiateKhaltiInput{
		OrderID:      req.OrderID,
		Amount:       req.Amount,
		PurchaseID:   req.PurchaseID,
		PurchaseName: req.PurchaseName,
		ReturnURL:    req.ReturnURL,
	})
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, resp)
}

func (h *PaymentHandler) VerifyKhalti(c *gin.Context) {
	userID, err := utils.GetUserIDFromContext(c)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req VerifyKhaltiDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	payment, err := h.service.VerifyKhalti(c.Request.Context(), userID, service.KhaltiVerifyInput{
		Pidx: req.Pidx,
	})
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, payment)
}

func (h *PaymentHandler) KhaltiCallback(c *gin.Context) {
	pidx := c.Query("pidx")
	status := c.Query("status")
	orderID := c.Query("purchase_order_id")

	if pidx == "" || !strings.EqualFold(status, "Completed") {
		redirectPaymentResult(c, "failed", orderID, pidx)
		return
	}

	payment, err := h.service.VerifyKhaltiCallback(c.Request.Context(), pidx)
	if err != nil {
		redirectPaymentResult(c, "failed", orderID, pidx)
		return
	}

	if orderID == "" {
		orderID = payment.OrderID.String()
	}
	redirectPaymentResult(c, "success", orderID, pidx)
}

func redirectPaymentResult(c *gin.Context, paymentStatus, orderID, pidx string) {
	deepLink := strings.TrimSpace(config.AppConfig.MobileDeepLink)
	if deepLink == "" {
		deepLink = "dhunemobile://payment-result"
	}

	redirectURL, err := url.Parse(deepLink)
	if err != nil {
		redirectURL, _ = url.Parse("dhunemobile://payment-result")
	}

	query := redirectURL.Query()
	query.Set("payment", paymentStatus)
	if orderID != "" {
		query.Set("order_id", orderID)
	}
	if pidx != "" {
		query.Set("pidx", pidx)
	}
	redirectURL.RawQuery = query.Encode()

	c.Redirect(http.StatusFound, redirectURL.String())
}
