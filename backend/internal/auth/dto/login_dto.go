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
