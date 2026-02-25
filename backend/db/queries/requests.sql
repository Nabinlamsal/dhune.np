
-- Used by: User
-- name: CreateRequest :one
INSERT INTO requests (
    user_id,
    pickup_address,
    pickup_time_from,
    pickup_time_to,
    payment_method,
    expires_at
) VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;


-- Used immediately after CreateRequest
-- name: AddRequestService :one
INSERT INTO request_services (
    request_id,
    category_id,
    selected_unit,
    quantity_value,
    items_json,
    description
) VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;


-- Used by Vendor, Admin, and User
-- name: GetRequestWithServices :many
SELECT
    r.*,
    rs.id AS service_id,
    rs.category_id,
    rs.selected_unit,
    rs.quantity_value,
    rs.items_json,
    rs.description
FROM requests r
         LEFT JOIN request_services rs ON rs.request_id = r.id
WHERE r.id = $1;


-- Used by: User Dashboard
-- name: ListUserRequests :many
SELECT *
FROM requests
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;


-- Used by Vendor Dashboard
-- name: ListMarketplaceRequests :many
SELECT
    r.id,
    r.pickup_address,
    r.pickup_time_from,
    r.pickup_time_to,
    r.expires_at,
    r.created_at,

    COUNT(rs.id) AS service_count,
    COALESCE(SUM(rs.quantity_value), 0)::double precision AS total_quantity,

    COALESCE(
                    jsonb_agg(
                    jsonb_build_object(
                            'category_id', rs.category_id,
                            'category_name', c.name,
                            'selected_unit', rs.selected_unit,
                            'quantity_value', rs.quantity_value
                    )
                            ) FILTER (WHERE rs.id IS NOT NULL),
                    '[]'::jsonb
    )::jsonb AS services_json

FROM requests r
         LEFT JOIN request_services rs ON rs.request_id = r.id
         LEFT JOIN categories c ON c.id = rs.category_id

WHERE r.status = 'OPEN'
  AND r.expires_at > now()
  AND (
    sqlc.narg(category_id)::uuid IS NULL
        OR rs.category_id = sqlc.narg(category_id)::uuid
    )

GROUP BY r.id
ORDER BY r.created_at DESC
LIMIT $1 OFFSET $2;


-- Used by: Admin Panel
-- name: ListRequestsAdmin :many
SELECT id, user_id, pickup_address, pickup_time_from, pickup_time_to,
       payment_method, status, expires_at, created_at, updated_at
FROM requests
WHERE (
          sqlc.narg(status)::requests_status IS NULL
              OR status = sqlc.narg(status)::requests_status
          )
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;


-- Used by: User
-- name: CancelRequest :exec
UPDATE requests
SET status = 'CANCELLED',
    updated_at = now()
WHERE id = $1
  AND status = 'OPEN';


-- Prevents further bidding
-- name: SetRequestOrderCreated :exec
UPDATE requests
SET status = 'ORDER_CREATED',
    updated_at = now()
WHERE id = $1
  AND status = 'OPEN';


-- Not exposed as public API
-- name: ExpireRequests :exec
UPDATE requests
SET status = 'EXPIRED',
    updated_at = now()
WHERE status = 'OPEN'
  AND expires_at IS NOT NULL
  AND expires_at <= now();


-- Used by: Admin Dashboard
-- name: GetRequestStatsFiltered :one
SELECT
    COUNT(*) AS total_requests,

    COUNT(*) FILTER (WHERE status = 'OPEN')          AS open_requests,
    COUNT(*) FILTER (WHERE status = 'EXPIRED')       AS expired_requests,
    COUNT(*) FILTER (WHERE status = 'CANCELLED')     AS cancelled_requests,
    COUNT(*) FILTER (WHERE status = 'ORDER_CREATED') AS order_created_requests

FROM requests
WHERE
    (
        sqlc.narg(user_id)::uuid IS NULL
            OR user_id = sqlc.narg(user_id)::uuid
    );