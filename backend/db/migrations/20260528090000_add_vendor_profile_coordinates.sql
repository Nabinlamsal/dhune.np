-- +goose Up
-- +goose StatementBegin

ALTER TABLE vendor_profiles
    ADD COLUMN business_latitude DECIMAL(10, 8) NULL,
    ADD COLUMN business_longitude DECIMAL(11, 8) NULL,
    ADD COLUMN service_radius_km DECIMAL(6, 2) NULL DEFAULT 5.00;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

ALTER TABLE vendor_profiles
    DROP COLUMN IF EXISTS service_radius_km,
    DROP COLUMN IF EXISTS business_longitude,
    DROP COLUMN IF EXISTS business_latitude;

-- +goose StatementEnd
