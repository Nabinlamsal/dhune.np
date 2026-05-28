package service

import (
	"context"
	"errors"

	"github.com/Nabinlamsal/dhune.np/internal/events"
	"github.com/Nabinlamsal/dhune.np/internal/utils"
	"github.com/google/uuid"
)

func sendAccountStatusEmail(email, name, title, message, status string) {
	utils.SendEmailAsync(email, title, utils.BuildDhuneEmail(utils.DhuneEmailInput{
		Title:   title,
		Message: message,
		Details: []utils.EmailDetailRow{
			{Label: "Account", Value: name},
			{Label: "Status", Value: status},
		},
	}))
}

func (s *UserService) ApproveVendor(ctx context.Context, userId uuid.UUID) error {
	user, err := s.userRepo.GetUserDetails(ctx, userId)
	if err != nil {
		return err
	}
	if user.Role != "vendor" {
		return errors.New("user is not a vendor")
	}
	if user.VendorProfile.ApprovalStatus != "pending" {
		return errors.New("user must be in pending state")
	}
	if err := s.commandRepo.ApproveVendor(ctx, userId); err != nil {
		return err
	}

	events.EmitEvent(events.Event{
		Type: "VENDOR_APPROVED",
		Data: events.NotificationEvent{
			Title:   "Vendor account approved",
			Body:    "Your vendor account has been approved by admin.",
			UserIDs: []string{userId.String()},
			Persist: true,
			Push:    true,
			Data: map[string]interface{}{
				"user_id": userId.String(),
				"role":    user.Role,
			},
			EntityType: "user",
			EntityID:   userId.String(),
		},
	})
	sendAccountStatusEmail(user.Email, user.DisplayName, "Vendor account approved", "Your Dhune.np vendor account has been approved. You can now access your vendor workspace.", "Approved")

	return nil
}
func (s *UserService) RejectVendor(ctx context.Context, userId uuid.UUID) error {
	user, err := s.userRepo.GetUserDetails(ctx, userId)
	if err != nil {
		return err
	}
	if user.Role != "vendor" {
		return errors.New("user is not a vendor")
	}
	if user.VendorProfile.ApprovalStatus != "pending" {
		return errors.New("user must be in pending state")
	}
	if err := s.commandRepo.RejectVendor(ctx, userId); err != nil {
		return err
	}

	events.EmitEvent(events.Event{
		Type: "VENDOR_REJECTED",
		Data: events.NotificationEvent{
			Title:   "Vendor account rejected",
			Body:    "Your vendor account has been rejected by admin.",
			UserIDs: []string{userId.String()},
			Persist: true,
			Push:    true,
			Data: map[string]interface{}{
				"user_id": userId.String(),
				"role":    user.Role,
			},
			EntityType: "user",
			EntityID:   userId.String(),
		},
	})
	sendAccountStatusEmail(user.Email, user.DisplayName, "Vendor account rejected", "Your Dhune.np vendor account registration was rejected. Please contact support if you need help.", "Rejected")

	return nil
}

func (s *UserService) ApproveBusinessUser(ctx context.Context, userId uuid.UUID) error {
	user, err := s.userRepo.GetUserDetails(ctx, userId)
	if err != nil {
		return err
	}
	if user.Role != "business" {
		return errors.New("user is not a business")
	}
	if user.BusinessProfile.ApprovalStatus != "pending" {
		return errors.New("user must be in pending state")
	}
	if err := s.commandRepo.ApproveBusinessUser(ctx, userId); err != nil {
		return err
	}

	events.EmitEvent(events.Event{
		Type: "BUSINESS_APPROVED",
		Data: events.NotificationEvent{
			Title:   "Business account approved",
			Body:    "Your business account has been approved by admin.",
			UserIDs: []string{userId.String()},
			Persist: true,
			Push:    true,
			Data: map[string]interface{}{
				"user_id": userId.String(),
				"role":    user.Role,
			},
			EntityType: "user",
			EntityID:   userId.String(),
		},
	})
	sendAccountStatusEmail(user.Email, user.DisplayName, "Business account approved", "Your Dhune.np business account has been approved.", "Approved")

	return nil
}
func (s *UserService) RejectBusinessUser(ctx context.Context, userId uuid.UUID) error {
	user, err := s.userRepo.GetUserDetails(ctx, userId)
	if err != nil {
		return err
	}

	if user.Role != "business" {
		return errors.New("user is not a business")
	}

	if user.BusinessProfile.ApprovalStatus != "pending" {
		return errors.New("user must be in pending state")
	}

	if err := s.commandRepo.RejectBusinessUser(ctx, userId); err != nil {
		return err
	}

	events.EmitEvent(events.Event{
		Type: "BUSINESS_REJECTED",
		Data: events.NotificationEvent{
			Title:   "Business account rejected",
			Body:    "Your business account has been rejected by admin.",
			UserIDs: []string{userId.String()},
			Persist: true,
			Push:    true,
			Data: map[string]interface{}{
				"user_id": userId.String(),
				"role":    user.Role,
			},
			EntityType: "user",
			EntityID:   userId.String(),
		},
	})
	sendAccountStatusEmail(user.Email, user.DisplayName, "Business account rejected", "Your Dhune.np business account registration was rejected. Please contact support if you need help.", "Rejected")

	return nil
}

func (s *UserService) SuspendUser(ctx context.Context, userId uuid.UUID) error {
	user, err := s.userRepo.GetUserDetails(ctx, userId)
	if err != nil {
		return err
	}
	if user.Role == "admin" {
		return errors.New("you cant suspend admin")
	}
	if user.IsActive == false {
		return errors.New("user is already suspended or inactive")
	}
	if err := s.commandRepo.SuspendUser(ctx, userId); err != nil {
		return err
	}

	events.EmitEvent(events.Event{
		Type: "USER_SUSPENDED",
		Data: events.NotificationEvent{
			Title:   "Account suspended",
			Body:    "Your account has been suspended by admin.",
			UserIDs: []string{userId.String()},
			Persist: true,
			Push:    true,
			Data: map[string]interface{}{
				"user_id": userId.String(),
				"role":    user.Role,
			},
			EntityType: "user",
			EntityID:   userId.String(),
		},
	})
	sendAccountStatusEmail(user.Email, user.DisplayName, "Dhune.np account suspended", "Your Dhune.np account has been suspended by an administrator.", "Suspended")

	return nil
}
func (s *UserService) ReactivateUser(ctx context.Context, userId uuid.UUID) error {
	user, err := s.userRepo.GetUserDetails(ctx, userId)
	if err != nil {
		return err
	}
	if user.IsActive == true {
		return errors.New("user is already active")
	}
	if err := s.commandRepo.ReactivateUser(ctx, userId); err != nil {
		return err
	}

	events.EmitEvent(events.Event{
		Type: "USER_REACTIVATED",
		Data: events.NotificationEvent{
			Title:   "Account reactivated",
			Body:    "Your account has been reactivated by admin.",
			UserIDs: []string{userId.String()},
			Persist: true,
			Push:    true,
			Data: map[string]interface{}{
				"user_id": userId.String(),
				"role":    user.Role,
			},
			EntityType: "user",
			EntityID:   userId.String(),
		},
	})
	sendAccountStatusEmail(user.Email, user.DisplayName, "Dhune.np account reactivated", "Your Dhune.np account has been reactivated.", "Active")

	return nil
}
