-- +goose Up
ALTER TYPE offer_status ADD VALUE IF NOT EXISTS 'WITHDRAWN';

-- +goose Down
-- PostgreSQL does NOT support removing enum values safely.
-- Manual rollback required if ever needed.
SELECT 'Enum value WITHDRAWN cannot be automatically removed';