package dto

type LoginRequestDTO struct {
	EmailOrPhone string `json:"email_or_phone"`
	Password     string `json:"password"`
}
type LoginResponseDTO struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token,omitempty"`

	User struct {
		ID          string `json:"id"`
		DisplayName string `json:"display_name"`
		Role        string `json:"role"`
	} `json:"user"`

	Message string `json:"message"`
}

type ForgotPasswordRequestDTO struct {
	Email string `json:"email" binding:"required,email"`
}

type SendVerificationOTPRequestDTO struct {
	Email string `json:"email" binding:"required,email"`
}

type VerifyEmailRequestDTO struct {
	Email string `json:"email" binding:"required,email"`
	OTP   string `json:"otp" binding:"required,len=6"`
}

type ResetPasswordRequestDTO struct {
	Email       string `json:"email" binding:"required,email"`
	OTP         string `json:"otp" binding:"required,len=6"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type ChangePasswordRequestDTO struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type GoogleLoginRequestDTO struct {
	IDToken string `json:"id_token" binding:"required"`
}
