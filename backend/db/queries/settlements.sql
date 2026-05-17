-- name: CreateVendorSettlement :one
INSERT INTO vendor_settlements (
    vendor_id,
    amount,
    payment_method,
    reference
) VALUES (
    $1, $2, $3, $4
) RETURNING *;

-- name: GetVendorSettlementByID :one
SELECT * FROM vendor_settlements WHERE id = $1 LIMIT 1;

-- name: UpdateVendorSettlementStatus :one
UPDATE vendor_settlements
SET status = $2,
    paid_at = CASE WHEN $2 = 'VERIFIED'::settlement_status AND paid_at IS NULL THEN now() ELSE paid_at END,
    updated_at = now()
WHERE id = $1
RETURNING *;

-- name: ListVendorSettlements :many
SELECT * FROM vendor_settlements
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: ListVendorSettlementsByVendor :many
SELECT * FROM vendor_settlements
WHERE vendor_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;
