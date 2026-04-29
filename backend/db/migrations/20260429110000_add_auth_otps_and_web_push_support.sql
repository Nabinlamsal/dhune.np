-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS auth_otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    purpose VARCHAR(40) NOT NULL CHECK (purpose IN ('email_verification', 'password_reset')),
    code_hash TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    consumed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_otp_codes_user_purpose
    ON auth_otp_codes(user_id, purpose, created_at DESC);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS auth_otp_codes;
-- +goose StatementEnd
