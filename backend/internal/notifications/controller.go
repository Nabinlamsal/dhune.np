package notifications

import (
	"net/http"
	"strconv"

	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/gin-gonic/gin"
)

type Controller struct {
	service *Service
}

func NewController(service *Service) *Controller {
	return &Controller{service: service}
}

func (c *Controller) ListMy(ctx *gin.Context) {
	userID := ctx.MustGet("user_id").(string)

	limit, offset := parsePagination(ctx)
	unreadOnly := ctx.Query("unread_only") == "true"

	items, err := c.service.ListByUser(ctx.Request.Context(), userID, limit, offset, unreadOnly)
	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, items)
}

func (c *Controller) UnreadCount(ctx *gin.Context) {
	userID := ctx.MustGet("user_id").(string)

	count, err := c.service.CountUnread(ctx.Request.Context(), userID)
	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, gin.H{"unread_count": count})
}

func (c *Controller) MarkRead(ctx *gin.Context) {
	userID := ctx.MustGet("user_id").(string)

	if err := c.service.MarkRead(ctx.Request.Context(), userID, ctx.Param("id")); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, gin.H{"message": "notification marked as read"})
}

func (c *Controller) MarkAllRead(ctx *gin.Context) {
	userID := ctx.MustGet("user_id").(string)

	if err := c.service.MarkAllRead(ctx.Request.Context(), userID); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, gin.H{"message": "all notifications marked as read"})
}

func (c *Controller) RegisterDeviceToken(ctx *gin.Context) {
	userID := ctx.MustGet("user_id").(string)

	var body DeviceTokenInput
	if err := ctx.ShouldBindJSON(&body); err != nil {
		utils.Error(ctx, http.StatusBadRequest, err.Error())
		return
	}

	if err := c.service.RegisterDeviceToken(ctx.Request.Context(), userID, body); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, gin.H{"message": "push device token registered"})
}

func (c *Controller) DeleteDeviceToken(ctx *gin.Context) {
	userID := ctx.MustGet("user_id").(string)

	var body DeviceTokenDeleteInput
	if err := ctx.ShouldBindJSON(&body); err != nil {
		utils.Error(ctx, http.StatusBadRequest, err.Error())
		return
	}

	if err := c.service.RemoveDeviceToken(ctx.Request.Context(), userID, body.Token); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, gin.H{"message": "push device token removed"})
}

func parsePagination(ctx *gin.Context) (int, int) {
	limit := 20
	offset := 0

	if raw := ctx.Query("limit"); raw != "" {
		if parsed, err := strconv.Atoi(raw); err == nil && parsed > 0 && parsed <= 100 {
			limit = parsed
		}
	}
	if raw := ctx.Query("offset"); raw != "" {
		if parsed, err := strconv.Atoi(raw); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	return limit, offset
}
