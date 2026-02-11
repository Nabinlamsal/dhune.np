-- +goose Up
-- +goose StatementBegin

CREATE TABLE request_services (
                                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
                                  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,

                                  selected_unit pricing_unit NOT NULL,

                                  quantity_value DOUBLE PRECISION NOT NULL CHECK (quantity_value > 0),

                                  items_json JSONB,

                                  description TEXT,

                                  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_request_services_request_id ON request_services(request_id);
CREATE INDEX idx_request_services_category_id ON request_services(category_id);

-- +goose StatementEnd


-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS request_services;

-- +goose StatementEnd