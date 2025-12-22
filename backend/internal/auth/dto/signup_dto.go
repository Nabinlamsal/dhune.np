package dto

type SignupRequestDTO struct {
	Role        string `json:"role" binding:"required,oneof=user business vendor"`
	DisplayName string `json:"display_name" binding:"required"`
	Email       string `json:"email" binding:"required,email"`
	Phone       string `json:"phone" binding:"required"`
	Password    string `json:"password" binding:"required,min=6"`

	// Owner / representative name (business & vendor)
	OwnerName *string `json:"owner_name,omitempty"`

	// Business-only fields (role = business)
	BusinessType *string `json:"business_type,omitempty"`

	// Vendor-only fields (role = vendor)
	Address *string `json:"address,omitempty"`

	// Common for business & vendor
	RegistrationNumber *string `json:"registration_number,omitempty"`

	// Documents (for business/vendor)
	Documents []SignupDocumentDTO `json:"documents,omitempty"`
}

type SignupDocumentDTO struct {
	DocumentType string `json:"document_type" binding:"required"` // business_registration | vendor_registration
	DocumentURL  string `json:"document_url" binding:"required,url"`
}
