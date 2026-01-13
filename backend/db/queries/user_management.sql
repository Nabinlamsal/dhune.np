-- users and business users
-- name: GetAllUsers :many
    SELECT * FROM users WHERE role IN ('user', 'business');

-- name: GetUsersByRole :many
    SELECT * FROM users WHERE role = ANY($1::text[]);

-- name: GetUsersByStatus :many
    SELECT u.*
    FROM users u
    LEFT JOIN business_profiles bp ON bp.user_id = u.id
    WHERE u.role IN ('user', 'business')
    AND (
    ($1 = 'active' AND u.is_active = TRUE AND (u.role = 'user' OR bp.approval_status = 'approved'))
        OR ($1 = 'suspended' AND u.is_active = FALSE)
        OR ($1 = 'pending' AND u.role = 'business' AND bp.approval_status = 'pending')
        OR ($1 = 'approved' AND u.role = 'business' AND bp.approval_status = 'approved')
        OR ($1 = 'rejected' AND u.role = 'business' AND bp.approval_status = 'rejected')
    );


-- name: SearchUsersByEmail :many
    SELECT * FROM users
    WHERE role IN ('user', 'business')
    AND email ILIKE '%' || $1 || '%';

-- vendors
-- name: GetAllVendors :many
    SELECT * FROM users WHERE role IN ('vendor');

-- name: GetVendorsByStatus :many
    SELECT u.*
    FROM users u
         JOIN vendor_profiles vp ON vp.user_id = u.id
    WHERE u.role = 'vendor'
    AND (
    ($1 = 'active' AND u.is_active = TRUE AND vp.approval_status = 'approved')
        OR ($1 = 'suspended' AND u.is_active = FALSE)
        OR ($1 = 'pending' AND vp.approval_status = 'pending')
        OR ($1 = 'approved' AND vp.approval_status = 'approved')
        OR ($1 = 'rejected' AND vp.approval_status = 'rejected')
    );

-- name: SearchVendorsByEmail :many
    SELECT * FROM users
    WHERE role IN ('vendor')
    AND email ILIKE '%' || $1 || '%';


-- details
-- name: GetUserDetail :one

-- name: GetUserDocuments :many


-- governance
-- name: ApproveUser :one
-- name: RejectUser :one


-- for approved users
-- name: SuspendUser :one

-- name: ReactivateUser :one

-- name: DisableUser :one

-- name: ChangeUserRole :one
    ALTER TABLE dhune_db.public.users

-- name: GetSuspendedUsers :many

-- self view
-- name: GetMyAccountStatus :one

