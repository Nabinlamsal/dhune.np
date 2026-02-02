-- +goose Up
-- +goose StatementBegin

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                       display_name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       phone VARCHAR(20) NOT NULL UNIQUE,

                       password_hash TEXT NOT NULL,

                       role VARCHAR(20) NOT NULL
                           CHECK (role IN ('user', 'business', 'vendor', 'admin')),

                       is_verified BOOLEAN NOT NULL DEFAULT FALSE,
                       is_active BOOLEAN NOT NULL DEFAULT TRUE,

                       created_at TIMESTAMP NOT NULL DEFAULT now(),
                       updated_at TIMESTAMP NOT NULL DEFAULT now()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
