-- +goose Up
-- +goose StatementBegin

CREATE TABLE vendor_profiles (
                                 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                 user_id UUID NOT NULL UNIQUE,

                                 owner_name VARCHAR(255) NOT NULL,
                                 address VARCHAR(255) NOT NULL,
                                 registration_number VARCHAR(100) NOT NULL,

                                 approval_status VARCHAR(20) NOT NULL DEFAULT 'pending'
                                     CHECK (approval_status IN ('pending', 'approved', 'rejected')),

                                 is_active BOOLEAN NOT NULL DEFAULT TRUE,

                                 created_at TIMESTAMP NOT NULL DEFAULT now(),
                                 updated_at TIMESTAMP NOT NULL DEFAULT now(),

                                 CONSTRAINT fk_vendor_user
                                     FOREIGN KEY (user_id)
                                         REFERENCES users(id)
                                         ON DELETE CASCADE
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS vendor_profiles;
-- +goose StatementEnd
