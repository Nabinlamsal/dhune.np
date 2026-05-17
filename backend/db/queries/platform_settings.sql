-- name: GetPlatformSettings :one
SELECT * FROM platform_settings WHERE id = 1 LIMIT 1;

-- name: UpdateCommissionPercentage :one
UPDATE platform_settings
SET commission_percentage = $1,
    updated_at = now()
WHERE id = 1
RETURNING *;
