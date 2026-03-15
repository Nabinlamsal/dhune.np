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
-- name: GetOrderDetail :one
SELECT
    o.id,
    o.request_id,
    o.final_price,
    o.order_status,
    o.payment_status,
    o.pickup_time,
    o.delivery_time,
    o.created_at,

    u.id AS user_id,
    u.display_name AS user_name,
    u.email AS user_email,
    u.phone AS user_phone,

    v.id AS vendor_id,
    v.display_name AS vendor_name,
    v.email AS vendor_email,
    v.phone AS vendor_phone,

    r.pickup_address,
    r.pickup_lat,
    r.pickup_lng,
    r.pickup_time_from,
    r.pickup_time_to,
    r.payment_method,

    COALESCE(s.services_json, '[]'::jsonb) AS services_json

FROM orders o

         JOIN users u ON u.id = o.user_id
         JOIN users v ON v.id = o.vendor_id
         JOIN requests r ON r.id = o.request_id

         LEFT JOIN LATERAL (
    SELECT jsonb_agg(
                   jsonb_build_object(
                           'category_id', c.id,
                           'category_name', c.name,
                           'selected_unit', rs.selected_unit,
                           'quantity_value', rs.quantity_value,
                           'items_json', rs.items_json,
                           'description', rs.description
                   )
           ) AS services_json
    FROM request_services rs
             JOIN categories c ON c.id = rs.category_id
    WHERE rs.request_id = o.request_id
    ) s ON true

WHERE o.id = $1;


-- Used by: User / Vendor / Admin (Order Detail Page)
-- name: ListOrdersByUser :many
SELECT
    o.id,
    o.request_id,
    o.final_price,
    o.order_status,
    o.payment_status,
    o.created_at,

    v.display_name AS vendor_name,
    v.phone        AS vendor_phone,

    r.pickup_address,
    r.pickup_lat,
    r.pickup_lng,

    COALESCE(s.services_json, '[]'::jsonb) AS services_json

FROM orders o

         JOIN users v
              ON v.id = o.vendor_id

         JOIN requests r
              ON r.id = o.request_id

         LEFT JOIN LATERAL (
    SELECT jsonb_agg(
                   jsonb_build_object(
                           'category_id', c.id,
                           'category_name', c.name,
                           'selected_unit', rs.selected_unit,
                           'quantity_value', rs.quantity_value
                   )
           ) AS services_json
    FROM request_services rs
             JOIN categories c ON c.id = rs.category_id
    WHERE rs.request_id = o.request_id
    ) s ON true

WHERE o.user_id = $1

ORDER BY o.created_at DESC
LIMIT $2 OFFSET $3;


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
SELECT
    o.id,
    o.final_price,
    o.order_status,
    o.payment_status,
    o.created_at,

    u.display_name AS user_name,
    v.display_name AS vendor_name,

    r.pickup_address,
    r.pickup_lat,
    r.pickup_lng,

    COALESCE(s.services_json, '[]'::jsonb) AS services_json

FROM orders o

         JOIN users u ON u.id = o.user_id
         JOIN users v ON v.id = o.vendor_id
         JOIN requests r ON r.id = o.request_id

         LEFT JOIN LATERAL (
    SELECT jsonb_agg(
                   jsonb_build_object(
                           'category_id', c.id,
                           'category_name', c.name,
                           'selected_unit', rs.selected_unit,
                           'quantity_value', rs.quantity_value
                   )
           ) AS services_json
    FROM request_services rs
             JOIN categories c ON c.id = rs.category_id
    WHERE rs.request_id = o.request_id
    ) s ON true

WHERE (
          sqlc.narg(status)::order_status IS NULL
              OR o.order_status = sqlc.narg(status)::order_status
          )

ORDER BY o.created_at DESC
LIMIT $1 OFFSET $2;

-- name: ListOrdersByVendor :many
SELECT
    o.id,
    o.request_id,
    o.final_price,
    o.order_status,
    o.payment_status,
    o.pickup_time,
    o.created_at,

    u.display_name AS user_name,
    u.phone        AS user_phone,

    r.pickup_address,
    r.pickup_lat,
    r.pickup_lng,
    r.pickup_time_from,
    r.pickup_time_to,

    COALESCE(s.services_json, '[]'::jsonb) AS services_json

FROM orders o

         JOIN users u
              ON u.id = o.user_id

         JOIN requests r
              ON r.id = o.request_id

         LEFT JOIN LATERAL (
    SELECT jsonb_agg(
                   jsonb_build_object(
                           'category_id', c.id,
                           'category_name', c.name,
                           'selected_unit', rs.selected_unit,
                           'quantity_value', rs.quantity_value
                   )
           ) AS services_json
    FROM request_services rs
             JOIN categories c ON c.id = rs.category_id
    WHERE rs.request_id = o.request_id
    ) s ON true

WHERE o.vendor_id = $1
  AND (
    sqlc.narg(status)::order_status IS NULL
        OR o.order_status = sqlc.narg(status)::order_status
    )

ORDER BY o.created_at DESC
LIMIT $2 OFFSET $3;



-- Used by: Admin Dashboard (Order Stats)
-- name: GetOrderStatsFiltered :one
SELECT
    COUNT(*) AS total_orders,

    COUNT(*) FILTER (WHERE order_status = 'ACCEPTED')    AS accepted_orders,
    COUNT(*) FILTER (WHERE order_status = 'PICKED_UP')   AS picked_up_orders,
    COUNT(*) FILTER (WHERE order_status = 'IN_PROGRESS') AS in_progress_orders,
    COUNT(*) FILTER (WHERE order_status = 'DELIVERING')  AS delivering_orders,
    COUNT(*) FILTER (WHERE order_status = 'COMPLETED')   AS completed_orders,
    COUNT(*) FILTER (WHERE order_status = 'CANCELLED')   AS cancelled_orders

FROM orders
WHERE
    (
        sqlc.narg(user_id)::uuid IS NULL
            OR user_id = sqlc.narg(user_id)::uuid
        )
  AND
    (
        sqlc.narg(vendor_id)::uuid IS NULL
            OR vendor_id = sqlc.narg(vendor_id)::uuid
        );
