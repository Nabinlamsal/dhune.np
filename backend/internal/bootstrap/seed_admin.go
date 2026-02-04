package bootstrap

import (
	"context"
	"database/sql"
	"fmt"
	"os"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func SeedAdmin(ctx context.Context, db *sql.DB) error {

	email := os.Getenv("ADMIN_EMAIL")
	password := os.Getenv("ADMIN_PASSWORD")
	name := os.Getenv("ADMIN_DISPLAY_NAME")
	phone := os.Getenv("ADMIN_PHONE")

	// If env not provided, skip seeding
	if email == "" || password == "" {
		fmt.Println("Admin seed skipped (env not set)")
		return nil
	}

	// Check if admin already exists
	var exists bool
	err := db.QueryRowContext(ctx, `
		SELECT EXISTS (
			SELECT 1 FROM users
			WHERE email = $1 AND role = 'admin'
		)
	`, email).Scan(&exists)

	if err != nil {
		return err
	}

	if exists {
		fmt.Println("Admin already exists:", email)
		return nil
	}

	// Hash password
	hash, err := bcrypt.GenerateFromPassword(
		[]byte(password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return err
	}

	// Insert admin
	_, err = db.ExecContext(ctx, `
		INSERT INTO users (
			id,
			display_name,
			email,
			phone,
			password_hash,
			role,
			is_active,
			created_at
		) VALUES (
			$1, $2, $3, $4, $5, 'admin', true, NOW()
		)
	`,
		uuid.New(),
		name,
		email,
		phone,
		string(hash),
	)

	if err != nil {
		return err
	}

	fmt.Println("Admin seeded successfully:", email)
	return nil
}
