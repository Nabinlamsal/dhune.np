package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"mime/multipart"
	"strconv"
	"strings"

	db "github.com/Nabinlamsal/dhune.np/internal/database"
	"github.com/Nabinlamsal/dhune.np/internal/disputes/repository"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/google/uuid"
)

type Service struct {
	repo repository.Repository
}

func NewService(repo repository.Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Create(ctx context.Context, input CreateDisputeInput) (*DisputeSummary, error) {
	orderID, err := uuid.Parse(input.OrderID)
	if err != nil {
		return nil, errors.New("invalid order id")
	}

	raisedByID, err := uuid.Parse(input.RaisedByID)
	if err != nil {
		return nil, errors.New("invalid user id")
	}

	raisedBy, err := mapRaisedBy(input.RaisedBy)
	if err != nil {
		return nil, err
	}

	order, err := s.repo.GetOrderParty(ctx, orderID)
	if err != nil {
		return nil, errors.New("order not found")
	}

	switch raisedBy {
	case db.DisputeRaisedByUSER:
		if order.UserID != raisedByID {
			return nil, errors.New("unauthorized dispute create")
		}
	case db.DisputeRaisedByVENDOR:
		if order.VendorID != raisedByID {
			return nil, errors.New("unauthorized dispute create")
		}
		if order.OrderStatus == db.OrderStatusCOMPLETED {
			return nil, errors.New("vendors can only raise disputes before order is completed")
		}
	}

	disputeType := db.DisputeType(strings.TrimSpace(input.DisputeType))

	imageURL, err := resolveDisputeImage(ctx, input.ImageURL, input.ImageFile)
	if err != nil {
		return nil, err
	}

	row, err := s.repo.Create(ctx, db.CreateDisputeParams{
		OrderID:     orderID,
		RaisedBy:    raisedBy,
		RaisedByID:  raisedByID,
		DisputeType: disputeType,
		Description: input.Description,
		ImageUrl:    toNullString(imageURL),
	})
	if err != nil {
		return nil, err
	}

	return mapDispute(row, string(order.OrderStatus)), nil
}

func (s *Service) ListMy(
	ctx context.Context,
	role string,
	userID string,
	limit int32,
	offset int32,
) ([]DisputeSummary, error) {
	raisedBy, err := mapRaisedBy(role)
	if err != nil {
		return nil, err
	}

	raisedByID, err := uuid.Parse(userID)
	if err != nil {
		return nil, errors.New("invalid user id")
	}

	rows, err := s.repo.ListMy(ctx, raisedBy, raisedByID, limit, offset)
	if err != nil {
		return nil, err
	}

	result := make([]DisputeSummary, 0, len(rows))
	for _, row := range rows {
		result = append(result, *mapMyDispute(row))
	}

	return result, nil
}

func (s *Service) ListAdmin(
	ctx context.Context,
	status *string,
	limit int32,
	offset int32,
) ([]DisputeAdminSummary, error) {
	var dbStatus db.NullDisputeStatus
	if status != nil {
		dbStatus = db.NullDisputeStatus{
			DisputeStatus: db.DisputeStatus(*status),
			Valid:         true,
		}
	}

	rows, err := s.repo.ListAdmin(ctx, dbStatus, limit, offset)
	if err != nil {
		return nil, err
	}

	result := make([]DisputeAdminSummary, 0, len(rows))
	for _, row := range rows {
		result = append(result, *mapAdminDispute(row))
	}

	return result, nil
}

func (s *Service) GetAdminDetail(
	ctx context.Context,
	disputeID string,
) (*DisputeDetail, error) {
	id, err := uuid.Parse(disputeID)
	if err != nil {
		return nil, errors.New("invalid dispute id")
	}

	row, err := s.repo.GetDetailAdmin(ctx, id)
	if err != nil {
		return nil, errors.New("dispute not found")
	}

	return mapDetail(row), nil
}

func (s *Service) Resolve(
	ctx context.Context,
	input ResolveDisputeInput,
) (*DisputeSummary, error) {
	disputeID, err := uuid.Parse(input.DisputeID)
	if err != nil {
		return nil, errors.New("invalid dispute id")
	}

	status, err := resolveStatus(input.Decision)
	if err != nil {
		return nil, err
	}

	row, err := s.repo.Resolve(ctx, db.ResolveDisputeParams{
		ID:               disputeID,
		Status:           status,
		AdminDecision:    sql.NullString{String: buildAdminDecision(input.Decision, input.AdminNote), Valid: true},
		AdjustmentAmount: toNullAmount(input.AdjustmentAmount),
	})
	if err != nil {
		return nil, err
	}

	return mapDispute(row, ""), nil
}

func mapRaisedBy(role string) (db.DisputeRaisedBy, error) {
	switch strings.ToLower(role) {
	case "user":
		return db.DisputeRaisedByUSER, nil
	case "vendor":
		return db.DisputeRaisedByVENDOR, nil
	default:
		return "", errors.New("only users or vendors can create disputes")
	}
}

func resolveStatus(decision string) (db.DisputeStatus, error) {
	switch strings.ToUpper(strings.TrimSpace(decision)) {
	case "APPROVE_USER", "APPROVE_VENDOR":
		return db.DisputeStatusRESOLVED, nil
	case "REJECT":
		return db.DisputeStatusREJECTED, nil
	default:
		return "", errors.New("invalid decision")
	}
}

func buildAdminDecision(decision, note string) string {
	trimmedNote := strings.TrimSpace(note)
	if trimmedNote == "" {
		return strings.ToUpper(strings.TrimSpace(decision))
	}
	return fmt.Sprintf("%s: %s", strings.ToUpper(strings.TrimSpace(decision)), trimmedNote)
}

func mapDispute(row db.Dispute, orderStatus string) *DisputeSummary {
	return &DisputeSummary{
		ID:               row.ID.String(),
		OrderID:          row.OrderID.String(),
		RaisedBy:         string(row.RaisedBy),
		RaisedByID:       row.RaisedByID.String(),
		DisputeType:      string(row.DisputeType),
		Description:      row.Description,
		ImageURL:         nullStringPtr(row.ImageUrl),
		Status:           string(row.Status),
		AdminDecision:    nullStringPtr(row.AdminDecision),
		AdjustmentAmount: nullAmountPtr(row.AdjustmentAmount),
		OrderStatus:      orderStatus,
		CreatedAt:        row.CreatedAt,
		UpdatedAt:        row.UpdatedAt,
	}
}

func mapMyDispute(row db.ListMyDisputesRow) *DisputeSummary {
	return &DisputeSummary{
		ID:               row.ID.String(),
		OrderID:          row.OrderID.String(),
		RaisedBy:         string(row.RaisedBy),
		RaisedByID:       row.RaisedByID.String(),
		DisputeType:      string(row.DisputeType),
		Description:      row.Description,
		ImageURL:         nullStringPtr(row.ImageUrl),
		Status:           string(row.Status),
		AdminDecision:    nullStringPtr(row.AdminDecision),
		AdjustmentAmount: nullAmountPtr(row.AdjustmentAmount),
		OrderStatus:      string(row.OrderStatus),
		CreatedAt:        row.CreatedAt,
		UpdatedAt:        row.UpdatedAt,
	}
}

func mapAdminDispute(row db.ListDisputesAdminRow) *DisputeAdminSummary {
	return &DisputeAdminSummary{
		DisputeSummary: DisputeSummary{
			ID:               row.ID.String(),
			OrderID:          row.OrderID.String(),
			RaisedBy:         string(row.RaisedBy),
			RaisedByID:       row.RaisedByID.String(),
			DisputeType:      string(row.DisputeType),
			Description:      row.Description,
			ImageURL:         nullStringPtr(row.ImageUrl),
			Status:           string(row.Status),
			AdminDecision:    nullStringPtr(row.AdminDecision),
			AdjustmentAmount: nullAmountPtr(row.AdjustmentAmount),
			OrderStatus:      string(row.OrderStatus),
			CreatedAt:        row.CreatedAt,
			UpdatedAt:        row.UpdatedAt,
		},
		FinalPrice: row.FinalPrice,
		UserName:   row.UserName,
		VendorName: row.VendorName,
	}
}

func mapDetail(row db.GetDisputeDetailAdminRow) *DisputeDetail {
	return &DisputeDetail{
		DisputeSummary: DisputeSummary{
			ID:               row.ID.String(),
			OrderID:          row.OrderID.String(),
			RaisedBy:         string(row.RaisedBy),
			RaisedByID:       row.RaisedByID.String(),
			DisputeType:      string(row.DisputeType),
			Description:      row.Description,
			ImageURL:         nullStringPtr(row.ImageUrl),
			Status:           string(row.Status),
			AdminDecision:    nullStringPtr(row.AdminDecision),
			AdjustmentAmount: nullAmountPtr(row.AdjustmentAmount),
			OrderStatus:      string(row.OrderStatus),
			CreatedAt:        row.CreatedAt,
			UpdatedAt:        row.UpdatedAt,
		},
		Order: DisputeOrderInfo{
			ID:            row.OrderID.String(),
			RequestID:     row.RequestID.String(),
			OfferID:       row.OfferID.String(),
			OrderStatus:   string(row.OrderStatus),
			PaymentStatus: string(row.PaymentStatus),
			FinalPrice:    row.FinalPrice,
		},
		User: DisputePartyInfo{
			ID:    row.UserID.String(),
			Name:  row.UserName,
			Email: row.UserEmail,
			Phone: row.UserPhone,
		},
		Vendor: DisputePartyInfo{
			ID:    row.VendorID.String(),
			Name:  row.VendorName,
			Email: row.VendorEmail,
			Phone: row.VendorPhone,
		},
	}
}

func toNullString(value *string) sql.NullString {
	if value == nil || strings.TrimSpace(*value) == "" {
		return sql.NullString{}
	}
	return sql.NullString{
		String: strings.TrimSpace(*value),
		Valid:  true,
	}
}

func resolveDisputeImage(
	ctx context.Context,
	imageURL *string,
	imageFile *multipart.FileHeader,
) (*string, error) {
	if imageFile != nil {
		url, err := utils.UploadDocumentToCloudinary(
			ctx,
			imageFile,
			"dhune/dispute-proofs",
		)
		if err != nil {
			return nil, err
		}
		return &url, nil
	}

	return imageURL, nil
}

func toNullAmount(amount *float64) sql.NullString {
	if amount == nil {
		return sql.NullString{}
	}
	return sql.NullString{
		String: strconv.FormatFloat(*amount, 'f', 2, 64),
		Valid:  true,
	}
}

func nullStringPtr(value sql.NullString) *string {
	if !value.Valid {
		return nil
	}
	result := value.String
	return &result
}

func nullAmountPtr(value sql.NullString) *float64 {
	if !value.Valid {
		return nil
	}
	parsed, err := strconv.ParseFloat(value.String, 64)
	if err != nil {
		return nil
	}
	return &parsed
}
