-- +goose Up
-- +goose StatementBegin
    CREATE TYPE requests_status AS ENUM(
        'OPEN',
        'ON_BID',
        'EXPIRED',
        'CANCELLED',
        'ORDER_CREATED'
    );
CREATE TYPE payment_method AS ENUM (
    'CASH',
    'ONLINE'
    );

CREATE TABLE requests(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES dhune_db.public.users(id) ON DELETE  CASCADE,

    pickup_address TEXT NOT NULL,
    pickup_time_from TIMESTAMPTZ NOT NULL,
    pickup_time_to   TIMESTAMPTZ NOT NULL,
    payment_method payment_method NOT NULL DEFAULT 'CASH',
    status requests_status NOT NULL DEFAULT 'OPEN',

    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

);
CREATE INDEX idx_requests_user_id ON requests(user_id);
CREATE INDEX idx_requests_status ON requests(status);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS requests;
DROP TYPE IF EXISTS request_status;
DROP TYPE IF EXISTS payment_method;
-- +goose StatementEnd
