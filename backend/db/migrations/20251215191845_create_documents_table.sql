-- +goose Up
-- +goose StatementBegin

CREATE TABLE documents (
                           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           user_id UUID NOT NULL,

                           document_type VARCHAR(50) NOT NULL
                               CHECK (document_type IN ('business_registration', 'vendor_registration')),

                           document_url TEXT NOT NULL,

                           verified BOOLEAN NOT NULL DEFAULT FALSE,

                           created_at TIMESTAMP NOT NULL DEFAULT now(),
                           updated_at TIMESTAMP NOT NULL DEFAULT now(),

                           CONSTRAINT fk_document_user
                               FOREIGN KEY (user_id)
                                   REFERENCES users(id)
                                   ON DELETE CASCADE
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS documents;
-- +goose StatementEnd
