-- Used by: Vendor (Submit Bid)
-- name: CreateOffer :one
INSERT INTO offers (
    request_id,
    vendor_id,
    bid_price,
    completion_time,
    service_options,
    description
) VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;



-- Used by: Vendor (Edit Bid while PENDING)
-- name: UpdateOffer :one
UPDATE offers
SET bid_price = $2,
    completion_time = $3,
    service_options = $4,
    description = $5,
    updated_at = now()
WHERE id = $1
  AND status = 'PENDING'
RETURNING *;



-- Used by: Vendor (Withdraw Bid)
-- name: WithdrawOffer :exec
UPDATE offers
SET status = 'WITHDRAWN',
    updated_at = now()
WHERE id = $1
  AND status = 'PENDING';



-- Used by: User (View offers on my request) / Admin
-- name: ListOffersByRequest :many
SELECT
    o.id,
    o.request_id,
    o.vendor_id,
    o.bid_price,
    o.completion_time,
    o.service_options,
    o.description,
    o.status,
    o.created_at,
    o.updated_at,
    u.display_name AS vendor_name,
    COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0)::double precision AS average_rating,
    COUNT(r.id)::bigint AS total_ratings
FROM offers o
JOIN users u ON u.id = o.vendor_id
LEFT JOIN ratings r ON r.vendor_id = o.vendor_id
WHERE o.request_id = $1
GROUP BY
    o.id,
    o.request_id,
    o.vendor_id,
    o.bid_price,
    o.completion_time,
    o.service_options,
    o.description,
    o.status,
    o.created_at,
    o.updated_at,
    u.display_name
ORDER BY o.created_at DESC;



-- Used by: Vendor Dashboard
-- name: ListOffersByVendor :many
SELECT *
FROM offers
WHERE vendor_id = $1
  AND (
    sqlc.narg(status)::offer_status IS NULL
        OR status = sqlc.narg(status)::offer_status
    )
ORDER BY
    CASE
        WHEN sqlc.arg(sort_by) = 'expiring'
            THEN completion_time
        END ASC,
    created_at DESC
LIMIT $2 OFFSET $3;

-- Used inside: Offer Acceptance Transaction (Concurrency Safe)
-- name: AcceptOffer :one
UPDATE offers
SET status = 'ACCEPTED',
    updated_at = now()
WHERE id = $1
  AND status = 'PENDING'
RETURNING *;


-- Used inside: Offer Acceptance Transaction (Reject Others)
-- name: RejectOtherOffers :exec
UPDATE offers
SET status = 'REJECTED',
    updated_at = now()
WHERE request_id = $1
  AND id <> $2
  AND status = 'PENDING';



-- Not exposed as public API (Background Expiry Job)
-- name: ExpireOffers :exec
UPDATE offers
SET status = 'EXPIRED',
    updated_at = now()
WHERE status = 'PENDING'
  AND completion_time < now();


-- Used by: Admin, Users and Vendors
-- name: GetOfferStatsFiltered :one
SELECT
    COUNT(*) AS total_offers,

    COUNT(*) FILTER (WHERE status = 'PENDING')   AS pending_offers,
    COUNT(*) FILTER (WHERE status = 'ACCEPTED')  AS accepted_offers,
    COUNT(*) FILTER (WHERE status = 'REJECTED')  AS rejected_offers,
    COUNT(*) FILTER (WHERE status = 'WITHDRAWN') AS withdrawn_offers,
    COUNT(*) FILTER (WHERE status = 'EXPIRED')   AS expired_offers

FROM offers
WHERE
    (
        sqlc.narg(vendor_id)::uuid IS NULL
            OR vendor_id = sqlc.narg(vendor_id)::uuid
        )
  AND
    (
        sqlc.narg(request_id)::uuid IS NULL
            OR request_id = sqlc.narg(request_id)::uuid
        );


-- Used by: Admin Panel (Global Offer Listing with Filters)
-- name: ListOffersAdmin :many
SELECT *
FROM offers
WHERE (
    sqlc.narg(status)::offer_status IS NULL
        OR status = sqlc.narg(status)::offer_status
    )
  AND (
    sqlc.narg(vendor_id)::uuid IS NULL
        OR vendor_id = sqlc.narg(vendor_id)::uuid
    )
  AND (
    sqlc.narg(request_id)::uuid IS NULL
        OR request_id = sqlc.narg(request_id)::uuid
    )
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: GetOfferByID :one
SELECT *
FROM offers
WHERE id = $1;
