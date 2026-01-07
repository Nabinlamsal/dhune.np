package dto

type SignupRequestDTO struct {
	Role        string `json:"role" binding:"required,oneof=user business vendor"`
	DisplayName string `json:"display_name" binding:"required"`
	Email       string `json:"email" binding:"required,email"`
	Phone       string `json:"phone" binding:"required"`
	Password    string `json:"password" binding:"required,min=6"`

	//business or vendor representative name
	OwnerName *string `json:"owner_name,omitempty"`

	//business users only
	BusinessType *string `json:"business_type,omitempty"`

	//vendors only
	Address *string `json:"address,omitempty"`

	//for business and vendors
	RegistrationNumber *string             `json:"registration_number,omitempty"`
	Documents          []SignupDocumentDTO `json:"documents,omitempty"`
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
