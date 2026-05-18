-- name: CreatePayment :one
INSERT INTO payments (
    payment_type,
    order_id,
    payer_id,
    vendor_id,
    amount,
    payment_method,
    payment_status,
    gateway_reference
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8
) RETURNING *;

-- name: GetPaymentByOrderID :one
SELECT * FROM payments WHERE order_id = $1 AND payment_type = 'ORDER_PAYMENT' LIMIT 1;

-- name: GetPaymentByID :one
SELECT * FROM payments WHERE id = $1 LIMIT 1;

-- name: GetPaymentByGatewayReference :one
SELECT * FROM payments WHERE gateway_reference = $1 LIMIT 1;

-- name: GetOpenCommissionPaymentByVendor :one
SELECT * FROM payments
WHERE vendor_id = $1
  AND payment_type = 'COMMISSION_PAYMENT'
  AND payment_status = 'UNPAID'
ORDER BY created_at DESC
LIMIT 1;

-- name: UpdatePaymentStatus :one
UPDATE payments
SET payment_status = $2,
    gateway_reference = COALESCE($3, gateway_reference),
    paid_at = CASE WHEN $2 = 'PAID'::payment_status AND paid_at IS NULL THEN now() ELSE paid_at END,
    updated_at = now()
WHERE id = $1
RETURNING *;

-- name: PrepareGatewayPayment :one
UPDATE payments
SET amount = $2,
    payment_method = $3,
    payment_status = 'UNPAID'::payment_status,
    gateway_reference = $4,
    paid_at = NULL,
    updated_at = now()
WHERE id = $1
RETURNING *;

-- name: ListCommissionPaymentsByVendor :many
SELECT * FROM payments
WHERE vendor_id = $1
  AND payment_type = 'COMMISSION_PAYMENT'
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: ListCommissionPaymentsAdmin :many
SELECT * FROM payments
WHERE payment_type = 'COMMISSION_PAYMENT'
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: UpdateOrderPaymentStatus :one
UPDATE orders
SET payment_status = $2,
    updated_at = now()
WHERE id = $1
RETURNING *;

-- name: ListPaymentsByUser :many
SELECT * FROM payments
WHERE payer_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;
