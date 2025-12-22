-- name: CreateUser :one
INSERT INTO users (
    display_name,
    email,
    phone,
    password_hash,
    role
) VALUES (
             $1, $2, $3, $4, $5
         )
RETURNING *;

-- name: GetUserByEmail :one
SELECT *
FROM users
WHERE email = $1
LIMIT 1;

-- name: GetUserByID :one
SELECT *
FROM users
WHERE id = $1
LIMIT 1;

-- name: GetUserByPhone :one
SELECT *
FROM users
WHERE phone = $1
LIMIT 1;

-- name: CreateBusinessUserProfile :one
INSERT INTO business_profiles(
        user_id,
        owner_name,
        business_type,
        registration_number
) VALUES (
        $1, $2, $3, $4
         )
RETURNING *;

-- name: GetBusinessProfileByUserID :one
SELECT *
FROM business_profiles
WHERE user_id = $1
LIMIT 1;

-- name: CreateVendorProfile :one
INSERT INTO vendor_profiles (
    user_id,
    owner_name,
    address,
    registration_number
) VALUES (
             $1, $2, $3, $4
         )
RETURNING *;


-- name: GetVendorProfileByUserID :one
SELECT *
FROM vendor_profiles
WHERE user_id = $1
LIMIT 1;


-- name: CreateDocument :one
INSERT INTO documents (
    user_id,
    document_type,
    document_url
) VALUES (
             $1, $2, $3
         )
RETURNING *;

-- name: GetDocumentsByUserID :many
SELECT *
FROM documents
WHERE user_id = $1
ORDER BY created_at ASC;

