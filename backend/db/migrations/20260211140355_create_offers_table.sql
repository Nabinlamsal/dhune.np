-- +goose Up
-- +goose StatementBegin

CREATE TYPE offer_status AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'EXPIRED'
    );

CREATE TABLE offers (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                        request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
                        vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

                        bid_price NUMERIC(12,2) NOT NULL CHECK (bid_price > 0),

                        completion_time TIMESTAMPTZ NOT NULL,

                        service_options JSONB,

                        description TEXT,

                        status offer_status NOT NULL DEFAULT 'PENDING',

                        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

                        UNIQUE(request_id, vendor_id)
);

CREATE INDEX idx_offers_request_id ON offers(request_id);
CREATE INDEX idx_offers_vendor_id ON offers(vendor_id);
CREATE INDEX idx_offers_status ON offers(status);

-- +goose StatementEnd


-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS offers;
DROP TYPE IF EXISTS offer_status;

-- +goose StatementEnd