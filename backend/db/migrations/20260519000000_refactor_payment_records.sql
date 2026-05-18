-- +goose Up
-- +goose StatementBegin

CREATE TYPE payment_record_type AS ENUM (
    'ORDER_PAYMENT',
    'COMMISSION_PAYMENT'
);

ALTER TABLE payments
    ADD COLUMN payment_type payment_record_type NOT NULL DEFAULT 'ORDER_PAYMENT';

ALTER TABLE payments
    ALTER COLUMN order_id DROP NOT NULL;

ALTER TABLE payments
    DROP CONSTRAINT IF EXISTS payments_order_id_key;

CREATE UNIQUE INDEX idx_payments_order_payment_once
    ON payments(order_id)
    WHERE payment_type = 'ORDER_PAYMENT' AND order_id IS NOT NULL;

CREATE INDEX idx_payments_payment_type ON payments(payment_type);
CREATE UNIQUE INDEX idx_payments_gateway_reference
    ON payments(gateway_reference)
    WHERE gateway_reference IS NOT NULL;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP INDEX IF EXISTS idx_payments_gateway_reference;
DROP INDEX IF EXISTS idx_payments_payment_type;
DROP INDEX IF EXISTS idx_payments_order_payment_once;

ALTER TABLE payments
    ADD CONSTRAINT payments_order_id_key UNIQUE(order_id);

ALTER TABLE payments
    ALTER COLUMN order_id SET NOT NULL;

ALTER TABLE payments
    DROP COLUMN IF EXISTS payment_type;

DROP TYPE IF EXISTS payment_record_type;

-- +goose StatementEnd
