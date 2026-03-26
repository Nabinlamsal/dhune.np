package ratings

import (
	"context"
	"errors"

	"github.com/google/uuid"
)

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

type RatingInput struct {
	OrderID uuid.UUID
	UserID  uuid.UUID
	Rating  int16
	Review  string
}

type RatingSummary struct {
	ID        string `json:"id"`
	OrderID   string `json:"order_id"`
	UserID    string `json:"user_id"`
	UserName  string `json:"user_name"`
	Rating    int16  `json:"rating"`
	Review    string `json:"review,omitempty"`
	CreatedAt string `json:"created_at"`
}

type VendorRatingSummary struct {
	TotalRatings  int64  `json:"total_ratings"`
	AverageRating string `json:"average_rating"`
}

type TopRatedVendor struct {
	VendorID      string `json:"vendor_id"`
	VendorName    string `json:"vendor_name"`
	TotalRatings  int64  `json:"total_ratings"`
	AverageRating string `json:"average_rating"`
}

func (s *Service) AddOrUpdate(
	ctx context.Context,
	input RatingInput,
) error {
	if input.Rating < 1 || input.Rating > 5 {
		return errors.New("rating must be between 1 and 5")
	}

	_, err := s.repo.UpsertOrderRating(
		ctx,
		input.OrderID,
		input.Rating,
		input.Review,
		input.UserID,
	)
	if err != nil {
		return errors.New("order is not eligible for rating or not found")
	}

	return nil
}

func (s *Service) ListVendorRatings(
	ctx context.Context,
	vendorID uuid.UUID,
	limit int32,
	offset int32,
) ([]RatingSummary, VendorRatingSummary, error) {
	rows, err := s.repo.ListVendorRatings(ctx, vendorID, limit, offset)
	if err != nil {
		return nil, VendorRatingSummary{}, err
	}

	summary, err := s.repo.GetVendorRatingSummary(ctx, vendorID)
	if err != nil {
		return nil, VendorRatingSummary{}, err
	}

	result := make([]RatingSummary, 0, len(rows))
	for _, row := range rows {
		result = append(result, RatingSummary{
			ID:        row.ID.String(),
			OrderID:   row.OrderID.String(),
			UserID:    row.UserID.String(),
			UserName:  row.UserName,
			Rating:    row.Rating,
			Review:    row.Review.String,
			CreatedAt: row.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}

	return result, VendorRatingSummary{
		TotalRatings:  summary.TotalRatings,
		AverageRating: summary.AverageRating,
	}, nil
}

func (s *Service) ListTopRatedVendors(
	ctx context.Context,
	limit int32,
	offset int32,
) ([]TopRatedVendor, error) {
	rows, err := s.repo.ListTopRatedVendors(ctx, limit, offset)
	if err != nil {
		return nil, err
	}

	result := make([]TopRatedVendor, 0, len(rows))
	for _, row := range rows {
		result = append(result, TopRatedVendor{
			VendorID:      row.VendorID.String(),
			VendorName:    row.VendorName,
			TotalRatings:  row.TotalRatings,
			AverageRating: row.AverageRating,
		})
	}

	return result, nil
}
