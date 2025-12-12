package domain

import (
	"github.com/Nabinlamsal/dhune.np/internal/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	Create(user *models.User) error
	FindByEmail(email string) (*models.User, error)
	FindByPhone(phone string) (*models.User, error)
}

// implementation
type GormUserRepository struct {
	db *gorm.DB
}

func NewGormUserRepository(db *gorm.DB) *GormUserRepository {
	return &GormUserRepository{db: db}
}
func (repo *GormUserRepository) Create(user *models.User) error {
	return repo.db.Create(user).Error
}
func (repo *GormUserRepository) FindByEmail(email string) (*models.User, error) {
	repo.db.Where("email = ?", email).First(&models.User{})
	return &models.User{}, repo.db.Error
}
func (repo *GormUserRepository) FindByPhone(phone string) (*models.User, error) {
	repo.db.Where("phone_number = ?", phone).First(&models.User{})
	return &models.User{}, repo.db.Error
}
