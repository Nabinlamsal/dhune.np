package dto

type CreateDisputeDTO struct {
	OrderID     string `json:"order_id" form:"order_id" binding:"required,uuid"`
	DisputeType string `json:"dispute_type" form:"dispute_type" binding:"required"`
	Description string `json:"description" form:"description" binding:"required"`
	ImageURL    string `json:"image_url" form:"image_url"`
}

type ResolveDisputeDTO struct {
	Decision         string   `json:"decision" binding:"required"`
	AdjustmentAmount *float64 `json:"adjustment_amount"`
	AdminNote        string   `json:"admin_note"`
}

type DisputeAdminFilterDTO struct {
	Status string `form:"status"`
	Limit  int32  `form:"limit"`
	Offset int32  `form:"offset"`
}

type MessageResponseDTO struct {
	Message string `json:"message"`
}

type DisputeSummaryDTO struct {
	ID               string   `json:"id"`
	OrderID          string   `json:"order_id"`
	RaisedBy         string   `json:"raised_by"`
	RaisedByID       string   `json:"raised_by_id"`
	DisputeType      string   `json:"dispute_type"`
	Description      string   `json:"description"`
	ImageURL         string   `json:"image_url,omitempty"`
	Status           string   `json:"status"`
	AdminDecision    string   `json:"admin_decision,omitempty"`
	AdjustmentAmount *float64 `json:"adjustment_amount,omitempty"`
	OrderStatus      string   `json:"order_status,omitempty"`
	CreatedAt        string   `json:"created_at"`
	UpdatedAt        string   `json:"updated_at"`
}

type DisputeAdminSummaryDTO struct {
	DisputeSummaryDTO
	FinalPrice string `json:"final_price"`
	UserName   string `json:"user_name"`
	VendorName string `json:"vendor_name"`
}

type DisputeOrderInfoDTO struct {
	ID            string `json:"id"`
	RequestID     string `json:"request_id"`
	OfferID       string `json:"offer_id"`
	OrderStatus   string `json:"order_status"`
	PaymentStatus string `json:"payment_status"`
	FinalPrice    string `json:"final_price"`
}

type DisputePartyInfoDTO struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Phone string `json:"phone"`
}

type DisputeDetailDTO struct {
	DisputeSummaryDTO
	Order  DisputeOrderInfoDTO `json:"order"`
	User   DisputePartyInfoDTO `json:"user"`
	Vendor DisputePartyInfoDTO `json:"vendor"`
}
