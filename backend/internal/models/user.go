package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	FullName        string `gorm:"type:varchar(255);not null" json:"full_name"`
	PhoneNumber     string `gorm:"type:varchar(255);not null" json:"phone_number"`
	Email           string `gorm:"type:varchar(255);not null" json:"email"`
	PasswordHash    string `gorm:"type:varchar(255);not null" json:"password"`
	IsVerified      bool   `gorm:"type:boolean;not null" json:"is_verified"`
	IsEmailVerified bool   `gorm:"type:boolean;not null" json:"is_email_verified"`
	IsPhoneVerified bool   `gorm:"type:boolean;not null" json:"is_phone_verified"`

	Roles []UserRole `gorm:"foreignKey:UserID"`
}

type Role struct {
	Id           uint   `gorm:"primary_key;AUTO_INCREMENT" json:"id"`
	Name         string `gorm:"type:varchar(255);not null" json:"name"`
	IdentityType string `gorm:"type:varchar(255);not null" json:"identity_type"`
}

type UserRole struct {
	gorm.Model
	UserID  uint    `gorm:"not null"`
	RoleID  uint    `gorm:"not null"`
	Context *string `gorm:"type:varchar(255)" json:"context"`
}
