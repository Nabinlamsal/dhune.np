-- User can add/update rating for completed or delivering order
-- name: UpsertOrderRating :one
INSERT INTO ratings (
    order_id,
    user_id,
    vendor_id,
    rating,
    review
)
SELECT
    o.id,
    o.user_id,
    o.vendor_id,
    sqlc.arg(rating),
    NULLIF(trim(sqlc.arg(review)), '')
FROM orders o
WHERE o.id = sqlc.arg(order_id)
  AND o.user_id = sqlc.arg(user_id)
  AND o.order_status IN ('DELIVERING', 'COMPLETED')
ON CONFLICT (order_id)
DO UPDATE
SET rating = EXCLUDED.rating,
    review = EXCLUDED.review,
    updated_at = now()
RETURNING *;

-- Vendor dashboard ratings list
-- name: ListVendorRatings :many
SELECT
    r.id,
    r.order_id,
    r.user_id,
    u.display_name AS user_name,
    r.rating,
    r.review,
    r.created_at
FROM ratings r
JOIN users u ON u.id = r.user_id
WHERE r.vendor_id = $1
ORDER BY r.created_at DESC
LIMIT $2 OFFSET $3;

-- Vendor average rating summary
-- name: GetVendorRatingSummary :one
SELECT
    COUNT(*)::bigint AS total_ratings,
    COALESCE(ROUND(AVG(rating)::numeric, 2), 0)::text AS average_rating
FROM ratings
WHERE vendor_id = $1;

-- Admin top rated vendors
-- name: ListTopRatedVendors :many
SELECT
    r.vendor_id,
    u.display_name AS vendor_name,
    COUNT(*)::bigint AS total_ratings,
    COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0)::text AS average_rating
FROM ratings r
JOIN users u ON u.id = r.vendor_id
GROUP BY r.vendor_id, u.display_name
ORDER BY AVG(r.rating) DESC, COUNT(*) DESC
LIMIT $1 OFFSET $2;
