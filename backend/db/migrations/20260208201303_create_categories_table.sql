-- +goose Up
-- +goose StatementBegin
CREATE TYPE pricing_unit AS ENUM (
    'KG',
    'SQFT',
    'ITEMS'
    );

CREATE TABLE categories (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            name TEXT NOT NULL,
                            description TEXT,
                            allowed_units pricing_unit[] NOT NULL,
                            is_active BOOLEAN NOT NULL DEFAULT TRUE,
                            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- +goose StatementEnd


-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS categories;
DROP TYPE IF EXISTS pricing_unit;

-- +goose StatementEnd