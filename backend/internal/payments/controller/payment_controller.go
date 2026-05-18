package handler

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"html"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	authService "github.com/Nabinlamsal/dhune.np/internal/auth/service"
	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/payments/service"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
)

type PaymentHandler struct {
	service *service.PaymentService
	jwtSvc  authService.JWTService
}

func NewPaymentHandler(service *service.PaymentService, jwtSvc authService.JWTService) *PaymentHandler {
	return &PaymentHandler{service: service, jwtSvc: jwtSvc}
}

type PayCashDTO struct {
	OrderID uuid.UUID `json:"order_id" binding:"required"`
}

type InitiatePaymentDTO struct {
	Method string `json:"method" binding:"required"`
}

func (h *PaymentHandler) PayCash(c *gin.Context) {
	vendorID, err := utils.GetUserIDFromContext(c)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "unauthorized")
		return
	}
	var req PayCashDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	payment, err := h.service.PayCash(c.Request.Context(), req.OrderID, vendorID)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	utils.Success(c, payment)
}

func (h *PaymentHandler) InitiateOrderPayment(c *gin.Context) {
	userID, err := utils.GetUserIDFromContext(c)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "unauthorized")
		return
	}
	orderID, err := uuid.Parse(c.Param("order_id"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid order id")
		return
	}
	var req InitiatePaymentDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	resp, err := h.service.InitiateOrderPaymentURL(c.Request.Context(), userID, orderID, db.PaymentMethodType(strings.ToUpper(req.Method)))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	utils.Success(c, resp)
}

func (h *PaymentHandler) InitiateCommissionPayment(c *gin.Context) {
	vendorID, err := utils.GetUserIDFromContext(c)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "unauthorized")
		return
	}
	var req InitiatePaymentDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	resp, err := h.service.InitiateCommissionPaymentURL(c.Request.Context(), vendorID, db.PaymentMethodType(strings.ToUpper(req.Method)))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	utils.Success(c, resp)
}

func (h *PaymentHandler) OrderKhaltiCallback(c *gin.Context) {
	h.khaltiCallback(c, db.PaymentRecordTypeORDERPAYMENT)
}

func (h *PaymentHandler) CommissionKhaltiCallback(c *gin.Context) {
	h.khaltiCallback(c, db.PaymentRecordTypeCOMMISSIONPAYMENT)
}

func (h *PaymentHandler) khaltiCallback(c *gin.Context, paymentType db.PaymentRecordType) {
	pidx := c.Query("pidx")
	status := c.Query("status")
	if pidx == "" || !strings.EqualFold(status, "Completed") {
		renderPaymentResult(c, http.StatusOK, "Payment failed", "Payment failed. Please return to Dhune and retry.")
		return
	}
	if _, err := h.service.VerifyKhaltiCallback(c.Request.Context(), pidx, paymentType); err != nil {
		renderPaymentResult(c, http.StatusOK, "Payment verification failed", "Payment could not be verified. Please return to Dhune and retry.")
		return
	}
	renderPaymentResult(c, http.StatusOK, "Payment successful", "Payment verified. You can return to Dhune.")
}

func (h *PaymentHandler) OrderEsewaPayPage(c *gin.Context) {
	orderID, err := uuid.Parse(c.Param("order_id"))
	if err != nil {
		renderPaymentResult(c, http.StatusBadRequest, "Invalid order", "The order id is invalid.")
		return
	}
	userID, err := h.userIDFromPayRequest(c)
	if err != nil {
		renderPaymentResult(c, http.StatusUnauthorized, "Unauthorized", "Please sign in again and retry eSewa payment.")
		return
	}
	action, fields, err := h.service.RenderOrderEsewa(c.Request.Context(), userID, orderID)
	if err != nil {
		renderPaymentResult(c, http.StatusBadRequest, "Payment unavailable", err.Error())
		return
	}
	renderEsewaAutoSubmit(c, action, fields)
}

func (h *PaymentHandler) CommissionEsewaPayPage(c *gin.Context) {
	vendorID, err := h.userIDFromPayRequest(c)
	if err != nil {
		renderPaymentResult(c, http.StatusUnauthorized, "Unauthorized", "Please sign in again and retry eSewa payment.")
		return
	}
	action, fields, err := h.service.RenderCommissionEsewa(c.Request.Context(), vendorID)
	if err != nil {
		renderPaymentResult(c, http.StatusBadRequest, "Payment unavailable", err.Error())
		return
	}
	renderEsewaAutoSubmit(c, action, fields)
}

func (h *PaymentHandler) OrderEsewaCallback(c *gin.Context) {
	h.esewaCallback(c, db.PaymentRecordTypeORDERPAYMENT)
}

func (h *PaymentHandler) CommissionEsewaCallback(c *gin.Context) {
	h.esewaCallback(c, db.PaymentRecordTypeCOMMISSIONPAYMENT)
}

func (h *PaymentHandler) esewaCallback(c *gin.Context, paymentType db.PaymentRecordType) {
	data, err := parseEsewaSuccessData(c)
	if err != nil {
		renderPaymentResult(c, http.StatusBadRequest, "Payment verification failed", "Payment failed. Please return to Dhune and retry.")
		return
	}
	if _, err := h.service.VerifyEsewa(c.Request.Context(), data, paymentType); err != nil {
		renderPaymentResult(c, http.StatusBadRequest, "Payment verification failed", "Payment failed. Please return to Dhune and retry.")
		return
	}
	renderPaymentResult(c, http.StatusOK, "Payment successful", "Payment verified. You can return to Dhune.")
}

func (h *PaymentHandler) EsewaFailure(c *gin.Context) {
	renderPaymentResult(c, http.StatusOK, "Payment failed", "Payment failed. Please return to Dhune and retry.")
}

func (h *PaymentHandler) userIDFromPayRequest(c *gin.Context) (uuid.UUID, error) {
	token := strings.TrimSpace(c.Query("token"))
	if token == "" {
		authHeader := c.GetHeader("Authorization")
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) == 2 && strings.EqualFold(parts[0], "bearer") {
			token = strings.TrimSpace(parts[1])
		}
	}
	if token == "" {
		return uuid.Nil, fmt.Errorf("missing token")
	}
	claims, err := h.jwtSvc.ValidateToken(token)
	if err != nil {
		return uuid.Nil, err
	}
	return uuid.Parse(claims.Subject)
}

func parseEsewaSuccessData(c *gin.Context) (service.EsewaSuccessData, error) {
	encodedData := c.Query("data")
	if encodedData == "" {
		encodedData = c.PostForm("data")
	}
	if encodedData != "" {
		encodedData = strings.ReplaceAll(encodedData, " ", "+")
		dataBytes, err := base64.StdEncoding.DecodeString(encodedData)
		if err != nil {
			dataBytes, err = base64.RawStdEncoding.DecodeString(encodedData)
		}
		if err != nil {
			return service.EsewaSuccessData{}, fmt.Errorf("invalid esewa response data")
		}
		var data service.EsewaSuccessData
		if err := json.Unmarshal(dataBytes, &data); err != nil {
			return service.EsewaSuccessData{}, fmt.Errorf("invalid esewa response payload")
		}
		return data, nil
	}
	data := service.EsewaSuccessData{
		TransactionCode:  c.Query("transaction_code"),
		Status:           c.Query("status"),
		TotalAmount:      c.Query("total_amount"),
		TransactionUUID:  c.Query("transaction_uuid"),
		ProductCode:      c.Query("product_code"),
		Signature:        c.Query("signature"),
		SignedFieldNames: c.Query("signed_field_names"),
	}
	if data.TransactionUUID == "" || data.TotalAmount == "" {
		return service.EsewaSuccessData{}, fmt.Errorf("missing esewa response data")
	}
	return data, nil
}

func renderEsewaAutoSubmit(c *gin.Context, action string, fields map[string]string) {
	var inputs strings.Builder
	for key, value := range fields {
		inputs.WriteString(fmt.Sprintf(`<input type="hidden" name="%s" value="%s">`, html.EscapeString(key), html.EscapeString(value)))
	}
	page := fmt.Sprintf(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Redirecting to eSewa</title></head>
<body>
  <form id="esewa-payment-form" method="POST" action="%s">%s<noscript><button type="submit">Continue to eSewa</button></noscript></form>
  <script>document.getElementById("esewa-payment-form").submit();</script>
</body>
</html>`, html.EscapeString(action), inputs.String())
	c.Data(http.StatusOK, "text/html; charset=utf-8", []byte(page))
}

func renderPaymentResult(c *gin.Context, statusCode int, title, message string) {
	page := fmt.Sprintf(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>%s</title>
  <style>body{font-family:Arial,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center;background:#f8fafc;color:#0f172a}main{max-width:520px;padding:32px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;box-shadow:0 10px 30px rgba(15,23,42,.08)}h1{margin:0 0 12px;font-size:24px}p{margin:0;color:#475569;line-height:1.5}</style>
</head>
<body><main><h1>%s</h1><p>%s</p></main></body>
</html>`, html.EscapeString(title), html.EscapeString(title), html.EscapeString(message))
	c.Data(statusCode, "text/html; charset=utf-8", []byte(page))
}
