package dto

type VendorStatsDTO struct {
	TotalOffers    int64   `json:"total_offers"`
	AcceptedOffers int64   `json:"accepted_offers"`
	CompletionRate float64 `json:"completion_rate"`
	TotalRevenue   float64 `json:"total_revenue"`
}
type PlatformStatsDTO struct {
	TotalRequests   int64   `json:"total_requests"`
	TotalOrders     int64   `json:"total_orders"`
	Revenue         float64 `json:"revenue"`
	PendingDisputes int64   `json:"pending_disputes"`
}
