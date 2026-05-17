-- +goose Up
-- +goose StatementBegin

CREATE TABLE platform_settings (
    id INT PRIMARY KEY DEFAULT 1,
    commission_percentage NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (id = 1)
);

-- Insert default setting
INSERT INTO platform_settings (id, commission_percentage) VALUES (1, 10.00);

CREATE TYPE payment_method_type AS ENUM (
    'CASH',
    'KHALTI',
    'ESEWA'
);

CREATE TYPE commission_status AS ENUM (
    'PENDING',
    'PAID'
);

CREATE TYPE settlement_status AS ENUM (
    'PENDING',
    'VERIFIED',
    'FAILED'
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    payment_method payment_method_type NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'UNPAID',
    
    gateway_reference VARCHAR(255),
    
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE(order_id)
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_payer_id ON payments(payer_id);
CREATE INDEX idx_payments_vendor_id ON payments(vendor_id);

CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    order_amount NUMERIC(12,2) NOT NULL,
    commission_percent NUMERIC(5,2) NOT NULL,
    commission_amount NUMERIC(12,2) NOT NULL,
    
    status commission_status NOT NULL DEFAULT 'PENDING',
    
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE(order_id)
);

CREATE INDEX idx_commissions_vendor_id ON commissions(vendor_id);
CREATE INDEX idx_commissions_status ON commissions(status);

CREATE TABLE vendor_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    payment_method payment_method_type NOT NULL,
    reference VARCHAR(255),
    
    status settlement_status NOT NULL DEFAULT 'PENDING',
    
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vendor_settlements_vendor_id ON vendor_settlements(vendor_id);
CREATE INDEX idx_vendor_settlements_status ON vendor_settlements(status);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS vendor_settlements;
DROP TABLE IF EXISTS commissions;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS platform_settings;

DROP TYPE IF EXISTS settlement_status;
DROP TYPE IF EXISTS commission_status;
DROP TYPE IF EXISTS payment_method_type;

-- +goose StatementEnd
