package dto

type CreateRequestDTO struct {
	PickupAddress  string              `json:"pickup_address" binding:"required"`
	PickupTimeFrom string              `json:"pickup_time_from" binding:"required"`
	PickupTimeTo   string              `json:"pickup_time_to" binding:"required"`
	PaymentMethod  string              `json:"payment_method" binding:"required"`
	Services       []RequestServiceDTO `json:"services" binding:"required,dive"`
}
type RequestResponseDTO struct {
	ID             string `json:"id"`
	PickupAddress  string `json:"pickup_address"`
	PickupTimeFrom string `json:"pickup_time_from"`
	PickupTimeTo   string `json:"pickup_time_to"`
	PaymentMethod  string `json:"payment_method"`
	Status         string `json:"status"`
	CreatedAt      string `json:"created_at"`
}
type RequestServiceDTO struct {
	CategoryID    string  `json:"category_id" binding:"required,uuid"`
	SelectedUnit  string  `json:"selected_unit" binding:"required"`
	QuantityValue float64 `json:"quantity_value" binding:"required,gt=0"`
	ItemsJSON     any     `json:"items_json,omitempty"`
	Description   string  `json:"description,omitempty"`
}
type RequestDetailsDTO struct {
	RequestResponseDTO
	Services []RequestServiceDTO `json:"services"`
}
type RequestAdminFilterDTO struct {
	Status string `form:"status"`
	Limit  int32  `form:"limit"`
	Offset int32  `form:"offset"`
}

type MessageResponseDTO struct {
	Message string `json:"message"`
}
type RequestSummaryDTO struct {
	ID            string `json:"id"`
	PickupAddress string `json:"pickup_address"`
	Status        string `json:"status"`
	CreatedAt     string `json:"created_at"`
}
type MarketplaceServiceDTO struct {
	CategoryID    string  `json:"category_id"`
	CategoryName  string  `json:"category_name"`
	SelectedUnit  string  `json:"selected_unit"`
	QuantityValue float64 `json:"quantity_value"`
}
type MarketplaceRequestSummaryDTO struct {
	ID             string                  `json:"id"`
	PickupAddress  string                  `json:"pickup_address"`
	PickupTimeFrom string                  `json:"pickup_time_from"`
	PickupTimeTo   string                  `json:"pickup_time_to"`
	ExpiresAt      string                  `json:"expires_at"`
	CreatedAt      string                  `json:"created_at"`
	ServiceCount   int64                   `json:"service_count"`
	TotalQuantity  float64                 `json:"total_quantity"`
	Services       []MarketplaceServiceDTO `json:"services"`
}
