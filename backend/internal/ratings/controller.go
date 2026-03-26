package ratings

import (
	"net/http"
	"strconv"

	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Controller struct {
	service *Service
}

func NewController(service *Service) *Controller {
	return &Controller{service: service}
}

type CreateRatingDTO struct {
	OrderID string `json:"order_id" binding:"required"`
	Rating  int16  `json:"rating" binding:"required"`
	Review  string `json:"review"`
}

func (h *Controller) AddOrUpdate(c *gin.Context) {
	var body CreateRatingDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	userID, err := uuid.Parse(c.MustGet("user_id").(string))
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "invalid user id")
		return
	}

	orderID, err := uuid.Parse(body.OrderID)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid order id")
		return
	}

	err = h.service.AddOrUpdate(c.Request.Context(), RatingInput{
		OrderID: orderID,
		UserID:  userID,
		Rating:  body.Rating,
		Review:  body.Review,
	})
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, gin.H{"message": "rating saved"})
}

func (h *Controller) VendorDashboard(c *gin.Context) {
	vendorID, err := uuid.Parse(c.MustGet("user_id").(string))
	if err != nil {
		utils.Error(c, http.StatusUnauthorized, "invalid vendor id")
		return
	}

	limit, offset := parsePagination(c)

	ratings, summary, err := h.service.ListVendorRatings(
		c.Request.Context(),
		vendorID,
		limit,
		offset,
	)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, gin.H{
		"summary": summary,
		"ratings": ratings,
	})
}

func (h *Controller) AdminTopRated(c *gin.Context) {
	limit, offset := parsePagination(c)

	rows, err := h.service.ListTopRatedVendors(c.Request.Context(), limit, offset)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, rows)
}

func (h *Controller) AdminVendorReviews(c *gin.Context) {
	vendorID, err := uuid.Parse(c.Param("vendorId"))
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "invalid vendor id")
		return
	}

	limit, offset := parsePagination(c)

	ratings, summary, err := h.service.ListVendorRatings(
		c.Request.Context(),
		vendorID,
		limit,
		offset,
	)
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, gin.H{
		"summary": summary,
		"ratings": ratings,
	})
}

func parsePagination(c *gin.Context) (int32, int32) {
	limit := int32(10)
	offset := int32(0)

	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil {
			limit = int32(parsed)
		}
	}

	if o := c.Query("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil {
			offset = int32(parsed)
		}
	}

	return limit, offset
}
