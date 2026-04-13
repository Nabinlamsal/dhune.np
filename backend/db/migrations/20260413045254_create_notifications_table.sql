-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS notifications (
                                             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                             user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                             type VARCHAR(100) NOT NULL,
                                             title TEXT NOT NULL,
                                             body TEXT NOT NULL,
                                             entity_type VARCHAR(100),
                                             entity_id UUID,
                                             actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
                                             data JSONB NOT NULL DEFAULT '{}'::jsonb,
                                             is_read BOOLEAN NOT NULL DEFAULT FALSE,
                                             read_at TIMESTAMP NULL,
                                             created_at TIMESTAMP NOT NULL DEFAULT now(),
                                             updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created_at
    ON notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_is_read
    ON notifications(user_id, is_read);

CREATE TABLE IF NOT EXISTS push_device_tokens (
                                                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                                  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                                  platform VARCHAR(20) NOT NULL CHECK (platform IN ('android', 'ios')),
                                                  token TEXT NOT NULL UNIQUE,
                                                  device_id VARCHAR(255),
                                                  is_active BOOLEAN NOT NULL DEFAULT TRUE,
                                                  last_seen_at TIMESTAMP NOT NULL DEFAULT now(),
                                                  created_at TIMESTAMP NOT NULL DEFAULT now(),
                                                  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_push_device_tokens_user_id
    ON push_device_tokens(user_id, is_active);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS push_device_tokens;
DROP TABLE IF EXISTS notifications;
-- +goose StatementEnd
