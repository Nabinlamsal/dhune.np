-- +goose Up
-- +goose StatementBegin

CREATE TYPE order_status AS ENUM (
    'ACCEPTED',
    'PICKED_UP',
    'IN_PROGRESS',
    'DELIVERING',
    'COMPLETED',
    'CANCELLED'
    );

CREATE TYPE payment_status AS ENUM (
    'UNPAID',
    'PAID',
    'REFUNDED'
    );

CREATE TABLE orders (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                        request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
                        offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,

                        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

                        final_price NUMERIC(12,2) NOT NULL CHECK (final_price > 0),

                        order_status order_status NOT NULL DEFAULT 'ACCEPTED',
                        payment_status payment_status NOT NULL DEFAULT 'UNPAID',

                        pickup_time TIMESTAMPTZ,
                        delivery_time TIMESTAMPTZ,

                        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

                        UNIQUE(request_id)
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(order_status);

-- +goose StatementEnd


-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS orders;
DROP TYPE IF EXISTS order_status;
DROP TYPE IF EXISTS payment_status;

-- +goose StatementEnd