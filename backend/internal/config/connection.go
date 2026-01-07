package config

import (
	"database/sql"
	_ "github.com/lib/pq"
	"log"
)

func ConnectDB(cfg *EnvConfig) (*sql.DB, error) {
	log.Println("CONNECTING TO", cfg.DatabaseURL)
	db, err := sql.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}
	return db, nil
}
