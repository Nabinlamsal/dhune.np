package dto

type OrderResponseDTO struct {
	ID            string  `json:"id"`
	RequestID     string  `json:"request_id"`
	OfferID       string  `json:"offer_id"`
	FinalPrice    float64 `json:"final_price"`
	OrderStatus   string  `json:"order_status"`
	PaymentStatus string  `json:"payment_status"`

	User   UserSummaryDTO `json:"user"`
	Vendor UserSummaryDTO `json:"vendor"`

	CreatedAt string `json:"created_at"`
}

type UpdateOrderStatusDTO struct {
	Status string `json:"status" binding:"required"`
}

type CancelOrderDTO struct {
	Reason string `json:"reason"`
}

type OrderAdminFilterDTO struct {
	Status string `form:"status"`
	Limit  int32  `form:"limit"`
	Offset int32  `form:"offset"`
}
type OrderDetailResponseDTO struct {
	Order   OrderResponseDTO  `json:"order"`
	Request RequestDetailsDTO `json:"request"`
	User    UserSummaryDTO    `json:"user"`
	Vendor  UserSummaryDTO    `json:"vendor"`
}
