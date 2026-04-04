package controller

import (
	"strconv"
	"time"

	disputedto "github.com/Nabinlamsal/dhune.np/internal/disputes/dto"
	disputeservice "github.com/Nabinlamsal/dhune.np/internal/disputes/service"
	"github.com/gin-gonic/gin"
)

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

func mapSummary(item disputeservice.DisputeSummary) disputedto.DisputeSummaryDTO {
	return disputedto.DisputeSummaryDTO{
		ID:               item.ID,
		OrderID:          item.OrderID,
		RaisedBy:         item.RaisedBy,
		RaisedByID:       item.RaisedByID,
		DisputeType:      item.DisputeType,
		Description:      item.Description,
		ImageURL:         derefString(item.ImageURL),
		Status:           item.Status,
		AdminDecision:    derefString(item.AdminDecision),
		AdjustmentAmount: item.AdjustmentAmount,
		OrderStatus:      item.OrderStatus,
		CreatedAt:        item.CreatedAt.Format(time.RFC3339),
		UpdatedAt:        item.UpdatedAt.Format(time.RFC3339),
	}
}

func mapSummaryList(items []disputeservice.DisputeSummary) []disputedto.DisputeSummaryDTO {
	response := make([]disputedto.DisputeSummaryDTO, 0, len(items))
	for _, item := range items {
		response = append(response, mapSummary(item))
	}
	return response
}

func mapAdminSummaryList(items []disputeservice.DisputeAdminSummary) []disputedto.DisputeAdminSummaryDTO {
	response := make([]disputedto.DisputeAdminSummaryDTO, 0, len(items))
	for _, item := range items {
		response = append(response, disputedto.DisputeAdminSummaryDTO{
			DisputeSummaryDTO: mapSummary(item.DisputeSummary),
			FinalPrice:        item.FinalPrice,
			UserName:          item.UserName,
			VendorName:        item.VendorName,
		})
	}
	return response
}

func mapDetail(item *disputeservice.DisputeDetail) disputedto.DisputeDetailDTO {
	return disputedto.DisputeDetailDTO{
		DisputeSummaryDTO: mapSummary(item.DisputeSummary),
		Order: disputedto.DisputeOrderInfoDTO{
			ID:            item.Order.ID,
			RequestID:     item.Order.RequestID,
			OfferID:       item.Order.OfferID,
			OrderStatus:   item.Order.OrderStatus,
			PaymentStatus: item.Order.PaymentStatus,
			FinalPrice:    item.Order.FinalPrice,
		},
		User: disputedto.DisputePartyInfoDTO{
			ID:    item.User.ID,
			Name:  item.User.Name,
			Email: item.User.Email,
			Phone: item.User.Phone,
		},
		Vendor: disputedto.DisputePartyInfoDTO{
			ID:    item.Vendor.ID,
			Name:  item.Vendor.Name,
			Email: item.Vendor.Email,
			Phone: item.Vendor.Phone,
		},
	}
}

func derefString(value *string) string {
	if value == nil {
		return ""
	}
	return *value
}
