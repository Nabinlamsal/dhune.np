package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/Nabinlamsal/dhune.np/internal/finance/service"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
)

type FinanceHandler struct {
	service *service.FinanceService
}

func NewFinanceHandler(service *service.FinanceService) *FinanceHandler {
	return &FinanceHandler{service: service}
}

func (h *FinanceHandler) GetAdminDashboardStats(c *gin.Context) {
	dashboard, err := h.service.GetAdminDashboard(c.Request.Context())
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	utils.Success(c, dashboard)
}

func (h *FinanceHandler) GetVendorDashboardStats(c *gin.Context) {
	vendorID, err := utils.GetUserIDFromContext(c)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	dashboard, err := h.service.GetVendorDashboard(c.Request.Context(), vendorID)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	utils.Success(c, dashboard)
}

func (h *FinanceHandler) CreateVendorSettlement(c *gin.Context) {
	vendorID, err := utils.GetUserIDFromContext(c)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req service.CreateSettlementInput
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	req.VendorID = vendorID

	settlement, err := h.service.CreateVendorSettlement(c.Request.Context(), req)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	utils.Success(c, settlement)
}

func (h *FinanceHandler) VerifySettlement(c *gin.Context) {
	idStr := c.Param("id")
	settlementID, err := uuid.Parse(idStr)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid settlement id")
		return
	}

	settlement, err := h.service.VerifyVendorSettlement(c.Request.Context(), settlementID)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, settlement)
}

func (h *FinanceHandler) ListAdminSettlements(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)

	settlements, err := h.service.ListVendorSettlements(c.Request.Context(), nil, int32(limit), int32(offset))
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	utils.Success(c, settlements)
}

func (h *FinanceHandler) ListVendorSettlements(c *gin.Context) {
	vendorID, err := utils.GetUserIDFromContext(c)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)

	settlements, err := h.service.ListVendorSettlements(c.Request.Context(), &vendorID, int32(limit), int32(offset))
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	utils.Success(c, settlements)
}

func (h *FinanceHandler) ListVendorCommissions(c *gin.Context) {
	vendorID, err := utils.GetUserIDFromContext(c)
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "unauthorized")
		return
	}

	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)

	commissions, err := h.service.ListCommissionsByVendor(c.Request.Context(), vendorID, int32(limit), int32(offset))
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	utils.Success(c, commissions)
}
