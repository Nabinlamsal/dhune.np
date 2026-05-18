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

-- name: MarkCommissionsAsPaidThrough :many
UPDATE commissions
SET status = 'PAID',
    paid_at = now()
WHERE vendor_id = $1
  AND status = 'PENDING'
  AND created_at <= $2
RETURNING *;

-- name: ListCommissionsAdmin :many
SELECT * FROM commissions
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: ListVendorCommissionDues :many
SELECT
    vendor_id,
    COALESCE(SUM(commission_amount) FILTER (WHERE status = 'PENDING'), 0)::numeric AS commission_due,
    COALESCE(SUM(commission_amount) FILTER (WHERE status = 'PAID'), 0)::numeric AS commission_paid,
    COALESCE(SUM(order_amount), 0)::numeric AS total_order_earnings
FROM commissions
GROUP BY vendor_id
HAVING COALESCE(SUM(commission_amount) FILTER (WHERE status = 'PENDING'), 0) > 0
ORDER BY commission_due DESC;
