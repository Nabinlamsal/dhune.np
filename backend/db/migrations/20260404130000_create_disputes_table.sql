-- +goose Up
-- +goose StatementBegin

CREATE TYPE dispute_raised_by AS ENUM (
    'USER',
    'VENDOR'
    );

CREATE TYPE dispute_type AS ENUM (
    'quantity',
    'damage',
    'missing',
    'pricing'
    );

CREATE TYPE dispute_status AS ENUM (
    'OPEN',
    'UNDER_REVIEW',
    'RESOLVED',
    'REJECTED'
    );

CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    raised_by dispute_raised_by NOT NULL,
    raised_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dispute_type dispute_type NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    status dispute_status NOT NULL DEFAULT 'OPEN',
    admin_decision TEXT,
    adjustment_amount NUMERIC(12,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_disputes_order_id ON disputes(order_id);
CREATE INDEX idx_disputes_raised_by_id ON disputes(raised_by_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_created_at ON disputes(created_at DESC);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS disputes;
DROP TYPE IF EXISTS dispute_status;
DROP TYPE IF EXISTS dispute_type;
DROP TYPE IF EXISTS dispute_raised_by;

-- +goose StatementEnd
