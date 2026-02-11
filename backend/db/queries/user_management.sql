-- all the users
-- name: GetUsersAdminView :many
SELECT
    u.*,
    bp.approval_status AS business_approval_status,
    vp.approval_status AS vendor_approval_status
FROM users u
         LEFT JOIN business_profiles bp ON bp.user_id = u.id
         LEFT JOIN vendor_profiles vp ON vp.user_id = u.id
WHERE
    (
        sqlc.narg(roles)::text[] IS NULL
            OR u.role = ANY(sqlc.narg(roles)::text[])
        )

  AND (
    sqlc.narg(status)::text IS NULL

        OR (
        sqlc.narg(status)::text = 'pending'
            AND (
            bp.approval_status = 'pending'
                OR vp.approval_status = 'pending'
            )
        )

        OR (
        sqlc.narg(status)::text = 'rejected'
            AND (
            bp.approval_status = 'rejected'
                OR vp.approval_status = 'rejected'
            )
        )

        OR (
        sqlc.narg(status)::text = 'approved'
            AND u.is_active = TRUE
            AND (
            u.role = 'user'
                OR bp.approval_status = 'approved'
                OR vp.approval_status = 'approved'
            )
        )

        OR (
        sqlc.narg(status)::text = 'suspended'
            AND u.is_active = FALSE
        )
    )

  AND (
    sqlc.narg(search)::text IS NULL
        OR u.email ILIKE '%' || sqlc.narg(search)::text || '%'
    )
ORDER BY u.created_at DESC
LIMIT $1 OFFSET $2;

-- details
-- name: GetUserDetail :one
SELECT
    -- user core
    u.id,
    u.display_name,
    u.email,
    u.phone,
    u.role,
    u.is_active,
    u.is_verified,
    u.created_at,

    -- business profile (nullable)
    bp.id AS business_profile_id,
    bp.owner_name AS business_owner_name,
    bp.business_type,
    bp.registration_number AS business_registration_number,
    bp.approval_status AS business_approval_status,

    -- vendor profile (nullable)
    vp.id AS vendor_profile_id,
    vp.owner_name AS vendor_owner_name,
    vp.address AS vendor_address,
    vp.registration_number AS vendor_registration_number,
    vp.approval_status AS vendor_approval_status,
    vp.is_active AS vendor_is_active

FROM users u
         LEFT JOIN business_profiles bp
                   ON bp.user_id = u.id
                       AND u.role = 'business'
         LEFT JOIN vendor_profiles vp
                   ON vp.user_id = u.id
                       AND u.role = 'vendor'
WHERE u.id = $1
LIMIT 1;

-- name: GetUserDocuments :many
SELECT
    id,
    document_type,
    document_url,
    verified,
    created_at
FROM documents
WHERE user_id = $1
ORDER BY created_at ASC;

--business and vendors management
-- name: ApproveBusinessUser :exec
UPDATE business_profiles bp
SET approval_status = 'approved',
    updated_at = now()
FROM users u
WHERE bp.user_id = u.id
  AND u.role = 'business'
  AND bp.user_id = $1
  AND bp.approval_status = 'pending';


-- name: RejectBusinessUser :exec
UPDATE business_profiles bp
SET approval_status = 'rejected',
    updated_at = now()
FROM users u
WHERE bp.user_id = u.id
  AND u.role = 'business'
  AND bp.user_id = $1
  AND bp.approval_status = 'pending';


-- name: ApproveVendor :exec
UPDATE vendor_profiles vp
SET approval_status = 'approved',
    is_active = TRUE,
    updated_at = now()
FROM users u
WHERE vp.user_id = u.id
  AND u.role = 'vendor'
  AND vp.user_id = $1
  AND vp.approval_status = 'pending';

-- name: RejectVendor :exec
UPDATE vendor_profiles vp
SET approval_status = 'rejected',
    is_active = FALSE,
    updated_at = now()
FROM users u
WHERE vp.user_id = u.id
  AND u.role = 'vendor'
  AND vp.user_id = $1
  AND vp.approval_status = 'pending';


-- governance
-- for approved users
-- name: SuspendUser :exec
    UPDATE users
    SET is_active = FALSE,
    updated_at=now()
    WHERE id=$1;

-- name: ReactivateUser :exec
    UPDATE users
    SET is_active = TRUE, updated_at = now()
    WHERE id = $1;

-- name: DisableUser :exec
    UPDATE users
    SET is_active = FALSE, updated_at = now()
    WHERE id = $1;


