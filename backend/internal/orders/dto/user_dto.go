package dto

// for future
type VendorRating struct {
	ID            string  `json:"id" binding:"required"`
	AverageRating float64 `json:"average_rating" binding:"required"`
	Description   string  `json:"description"`
}

type UserSummaryDTO struct {
	ID     string         `json:"id"`
	Name   string         `json:"name"`
	Phone  string         `json:"phone"`
	Role   string         `json:"role"`
	Rating []VendorRating `json:"rating"`
}
