-- Used by: User / Vendor
-- name: CreateDispute :one
INSERT INTO disputes (
    order_id,
    raised_by,
    raised_by_id,
    dispute_type,
    description,
    image_url
) VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- Used by: Service validation
-- name: GetOrderDisputeParty :one
SELECT
    id,
    user_id,
    vendor_id,
    order_status
FROM orders
WHERE id = $1;

-- Used by: User / Vendor
-- name: ListMyDisputes :many
SELECT
    d.id,
    d.order_id,
    d.raised_by,
    d.raised_by_id,
    d.dispute_type,
    d.description,
    d.image_url,
    d.status,
    d.admin_decision,
    d.adjustment_amount,
    d.created_at,
    d.updated_at,
    o.order_status
FROM disputes d
JOIN orders o ON o.id = d.order_id
WHERE d.raised_by = $1
  AND d.raised_by_id = $2
ORDER BY d.created_at DESC
LIMIT $3 OFFSET $4;

-- Used by: Admin
-- name: ListDisputesAdmin :many
SELECT
    d.id,
    d.order_id,
    d.raised_by,
    d.raised_by_id,
    d.dispute_type,
    d.description,
    d.image_url,
    d.status,
    d.admin_decision,
    d.adjustment_amount,
    d.created_at,
    d.updated_at,
    o.order_status,
    o.final_price,
    u.display_name AS user_name,
    v.display_name AS vendor_name
FROM disputes d
JOIN orders o ON o.id = d.order_id
JOIN users u ON u.id = o.user_id
JOIN users v ON v.id = o.vendor_id
WHERE (
    sqlc.narg(status)::dispute_status IS NULL
        OR d.status = sqlc.narg(status)::dispute_status
    )
ORDER BY d.created_at DESC
LIMIT $1 OFFSET $2;

-- Used by: Admin
-- name: GetDisputeDetailAdmin :one
SELECT
    d.id,
    d.order_id,
    d.raised_by,
    d.raised_by_id,
    d.dispute_type,
    d.description,
    d.image_url,
    d.status,
    d.admin_decision,
    d.adjustment_amount,
    d.created_at,
    d.updated_at,
    o.request_id,
    o.offer_id,
    o.order_status,
    o.payment_status,
    o.final_price,
    u.id AS user_id,
    u.display_name AS user_name,
    u.email AS user_email,
    u.phone AS user_phone,
    v.id AS vendor_id,
    v.display_name AS vendor_name,
    v.email AS vendor_email,
    v.phone AS vendor_phone
FROM disputes d
JOIN orders o ON o.id = d.order_id
JOIN users u ON u.id = o.user_id
JOIN users v ON v.id = o.vendor_id
WHERE d.id = $1;

-- Used by: Admin
-- name: ResolveDispute :one
UPDATE disputes
SET status = $2,
    admin_decision = $3,
    adjustment_amount = $4,
    updated_at = now()
WHERE id = $1
RETURNING *;
