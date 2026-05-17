-- name: CreateCommission :one
INSERT INTO commissions (
    order_id,
    vendor_id,
    order_amount,
    commission_percent,
    commission_amount
) VALUES (
    $1, $2, $3, $4, $5
) RETURNING *;

-- name: GetCommissionByOrderID :one
SELECT * FROM commissions WHERE order_id = $1 LIMIT 1;

-- name: ListCommissionsByVendor :many
SELECT * FROM commissions
WHERE vendor_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: MarkCommissionsAsPaid :many
UPDATE commissions
SET status = 'PAID',
    paid_at = now()
WHERE vendor_id = $1 AND status = 'PENDING'
RETURNING *;