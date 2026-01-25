package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
)

func (s *UserService) ApproveVendor(ctx context.Context, userId uuid.UUID) error {
	user, err := s.userRepo.GetUserDetails(ctx, userId)
	if err != nil {
		return err
	}
	if user.VendorProfile.ApprovalStatus != "pending" {
		return errors.New("user must be in pending state")
	}

	if user.Role != "vendor" {
		return errors.New("user is not a vendor")
	}
	return s.commandRepo.ApproveVendor(ctx, userId)
}
func (s *UserService) RejectVendor(ctx context.Context, userId uuid.UUID) error {
	user, err := s.userRepo.GetUserDetails(ctx, userId)
	if err != nil {
		return err
	}
	if user.VendorProfile.ApprovalStatus != "pending" {
		return errors.New("user must be in pending state")
	}

	if user.Role != "vendor" {
		return errors.New("user is not a vendor")
	}
	return s.commandRepo.RejectVendor(ctx, userId)
}

func (s *UserService) ApproveBusinessUser(ctx context.Context, userId uuid.UUID) error {
	user, err := s.userRepo.GetUserDetails(ctx, userId)
	if err != nil {
		return err
	}
	if user.VendorProfile.ApprovalStatus != "pending" {
		return errors.New("user must be in pending state")
	}

	if user.Role != "business" {
		return errors.New("user is not a business")
	}
	return s.commandRepo.ApproveBusinessUser(ctx, userId)
}
func (s *UserService) RejectBusinessUser(ctx context.Context, userId uuid.UUID) error {
	user, err := s.userRepo.GetUserDetails(ctx, userId)
	if err != nil {
		return err
	}
	if user.VendorProfile.ApprovalStatus != "pending" {
		return errors.New("user must be in pending state")
	}

	if user.Role != "business" {
		return errors.New("user is not a business")
	}
	return s.commandRepo.RejectBusinessUser(ctx, userId)
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
	return s.commandRepo.SuspendUser(ctx, userId)
}
func (s *UserService) ReactivateUser(ctx context.Context, userId uuid.UUID) error {
	user, err := s.userRepo.GetUserDetails(ctx, userId)
	if err != nil {
		return err
	}
	if user.IsActive == true {
		return errors.New("user is already active")
	}
	return s.commandRepo.ReactivateUser(ctx, userId)
}
