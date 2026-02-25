package dto

type CreateOfferDTO struct {
	RequestID      string   `json:"request_id" binding:"required,uuid"`
	BidPrice       float64  `json:"bid_price" binding:"required,gt=0"`
	CompletionTime string   `json:"completion_time" binding:"required"`
	Description    string   `json:"description"`
	ServiceOptions []string `json:"service_options"`
}

type UpdateOfferDTO struct {
	BidPrice       float64  `json:"bid_price" binding:"required,gt=0"`
	CompletionTime string   `json:"completion_time" binding:"required"`
	Description    string   `json:"description"`
	ServiceOptions []string `json:"service_options"`
}
type OfferResponseDTO struct {
	ID             string   `json:"id"`
	RequestID      string   `json:"request_id"`
	BidPrice       float64  `json:"bid_price"`
	Status         string   `json:"status"`
	CompletionTime string   `json:"completion_time"`
	ServiceOptions []string `json:"service_options"`
	Description    string   `json:"description,omitempty"`
}
type AcceptOfferDTO struct {
	OfferID string `json:"offer_id" binding:"required,uuid"`
}
type OfferAdminFilterDTO struct {
	Status    string `form:"status"`
	VendorID  string `form:"vendor_id"`
	RequestID string `form:"request_id"`
	Limit     int32  `form:"limit"`
	Offset    int32  `form:"offset"`
}
type AcceptedOfferResponseDTO struct {
	OfferResponseDTO
	User UserSummaryDTO `json:"user"`
}
type OfferStatsDTO struct {
	Total     int64 `json:"total"`
	Pending   int64 `json:"pending"`
	Accepted  int64 `json:"accepted"`
	Rejected  int64 `json:"rejected"`
	Withdrawn int64 `json:"withdrawn"`
	Expired   int64 `json:"expired"`
}
