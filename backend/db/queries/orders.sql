-- Used inside: Offer Acceptance Transaction (Create Order Snapshot)
-- name: CreateOrder :one
INSERT INTO orders (
    request_id,
    offer_id,
    user_id,
    vendor_id,
    final_price,
    pickup_time
) VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;


-- Used by: User (My Orders)
-- name: ListOrdersByUser :many
SELECT *
FROM orders
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;


-- Used by: Vendor (My Jobs)
-- name: ListOrdersByVendor :many
SELECT *
FROM orders
WHERE vendor_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;


-- Used by: User / Vendor / Admin (Order Detail Page)
-- name: GetOrderByID :one
SELECT *
FROM orders
WHERE id = $1;


-- Used by: Vendor (Status Progression)
-- name: UpdateOrderStatus :exec
UPDATE orders
SET order_status = $2,
    updated_at = now()
WHERE id = $1;


-- Used by: User (Cancel Before Pickup)
-- name: CancelOrder :exec
UPDATE orders
SET order_status = 'CANCELLED',
    updated_at = now()
WHERE id = $1
  AND order_status = 'ACCEPTED';


-- Used by: Vendor (Mark Completed)
-- name: CompleteOrder :exec
UPDATE orders
SET order_status = 'COMPLETED',
    delivery_time = now(),
    updated_at = now()
WHERE id = $1
  AND order_status = 'DELIVERING';


-- Used by: Payment Service (Mark Paid)
-- name: MarkOrderPaid :exec
UPDATE orders
SET payment_status = 'PAID',
    updated_at = now()
WHERE id = $1
  AND payment_status = 'UNPAID';


-- Used by: Payment Service (Refund)
-- name: MarkOrderRefunded :exec
UPDATE orders
SET payment_status = 'REFUNDED',
    updated_at = now()
WHERE id = $1
  AND payment_status = 'PAID';


-- Used by: Admin Dashboard (Global Orders with Filter)
-- name: ListOrdersAdmin :many
SELECT *
FROM orders
WHERE (
          sqlc.narg(status)::order_status IS NULL
              OR order_status = sqlc.narg(status)::order_status
          )
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- Used by: Admin Dashboard (Order Stats)
-- name: GetOrderStats :one
SELECT
    COUNT(*) AS total_orders,
    COUNT(*) FILTER (WHERE order_status = 'ACCEPTED') AS accepted_orders,
    COUNT(*) FILTER (WHERE order_status = 'PICKED_UP') AS picked_up_orders,
    COUNT(*) FILTER (WHERE order_status = 'IN_PROGRESS') AS in_progress_orders,
    COUNT(*) FILTER (WHERE order_status = 'DELIVERING') AS delivering_orders,
    COUNT(*) FILTER (WHERE order_status = 'COMPLETED') AS completed_orders,
    COUNT(*) FILTER (WHERE order_status = 'CANCELLED') AS cancelled_orders
FROM orders;