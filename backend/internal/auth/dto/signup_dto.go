package dto

type SignupRequestDTO struct {
	Role        string `form:"role" binding:"required,oneof=user business vendor"`
	DisplayName string `form:"display_name" binding:"required"`
	Email       string `form:"email" binding:"required,email"`
	Phone       string `form:"phone" binding:"required"`
	Password    string `form:"password" binding:"required,min=6"`

	OwnerName          *string `form:"owner_name"`
	BusinessType       *string `form:"business_type"`
	Address            *string `form:"address"`
	RegistrationNumber *string `form:"registration_number"`
}

type SignupDocumentDTO struct {
	DocumentType string `json:"document_type" binding:"required"` // business_registration | vendor_registration
	DocumentURL  string `json:"document_url" binding:"required,url"`
}

type SignupResponseDTO struct {
	UserId          string `json:"user_id"`
	Role            string `json:"role"`
	Status          string `json:"status"`
	ResponseMessage string `json:"message"`
}
