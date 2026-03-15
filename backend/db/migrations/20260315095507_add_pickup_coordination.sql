-- +goose Up
-- +goose StatementBegin
ALTER TABLE requests
ADD COLUMN pickup_lat DOUBLE PRECISION,
ADD COLUMN pickup_lng DOUBLE PRECISION;
-- +goose StatementEnd


-- +goose Down
-- +goose StatementBegin
ALTER TABLE requests
DROP COLUMN IF EXISTS pickup_lat,
DROP COLUMN IF EXISTS pickup_lng;
-- +goose StatementEnd