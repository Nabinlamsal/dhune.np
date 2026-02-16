package controller

import (
	"strconv"
	"time"

	"github.com/Nabinlamsal/dhune.np/internal/orders/dto"
	"github.com/Nabinlamsal/dhune.np/internal/orders/service"
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

func (h *RequestHandler) mapSummaryList(
	requests []service.RequestSummary,
) []dto.RequestSummaryDTO {

	var response []dto.RequestSummaryDTO

	for _, r := range requests {
		response = append(response, dto.RequestSummaryDTO{
			ID:            r.ID.String(),
			PickupAddress: r.PickupAddress,
			Status:        string(r.Status),
			CreatedAt:     r.CreatedAt.Format(time.RFC3339),
		})
	}

	return response
}

func (h *RequestHandler) mapDetailToDTO(
	r *service.RequestDetail,
) dto.RequestDetailsDTO {

	var services []dto.RequestServiceDTO

	for _, s := range r.Services {
		services = append(services, dto.RequestServiceDTO{
			CategoryID:    s.CategoryID.String(),
			SelectedUnit:  string(s.SelectedUnit),
			QuantityValue: s.QuantityValue,
			Description:   derefString(s.Description),
		})
	}

	return dto.RequestDetailsDTO{
		RequestResponseDTO: dto.RequestResponseDTO{
			ID:             r.ID.String(),
			PickupAddress:  r.PickupAddress,
			PickupTimeFrom: r.PickupTimeFrom.Format(time.RFC3339),
			PickupTimeTo:   r.PickupTimeTo.Format(time.RFC3339),
			PaymentMethod:  string(r.PaymentMethod),
			Status:         string(r.Status),
			CreatedAt:      r.CreatedAt.Format(time.RFC3339),
		},
		Services: services,
	}
}

func derefString(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}
