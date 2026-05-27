-- +goose Up
-- +goose StatementBegin

CREATE TABLE chatbot_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT,
    user_id UUID,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    source TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chatbot_messages_session_id ON chatbot_messages (session_id);
CREATE INDEX idx_chatbot_messages_created_at ON chatbot_messages (created_at);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS chatbot_messages;

-- +goose StatementEnd
