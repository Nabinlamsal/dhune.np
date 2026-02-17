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
SELECT *
FROM offers
WHERE request_id = $1
ORDER BY created_at DESC;



-- Used by: Vendor Dashboard
-- name: ListOffersByVendor :many
SELECT *
FROM offers
WHERE vendor_id = $1
ORDER BY created_at DESC
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


-- Used by: Admin Dashboard
-- name: GetOfferStats :one
SELECT
    COUNT(*) AS total_offers,
    COUNT(*) FILTER (WHERE status = 'PENDING') AS pending_offers,
    COUNT(*) FILTER (WHERE status = 'ACCEPTED') AS accepted_offers,
    COUNT(*) FILTER (WHERE status = 'REJECTED') AS rejected_offers,
    COUNT(*) FILTER (WHERE status = 'WITHDRAWN') AS withdrawn_offers,
    COUNT(*) FILTER (WHERE status = 'EXPIRED') AS expired_offers
FROM offers;

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