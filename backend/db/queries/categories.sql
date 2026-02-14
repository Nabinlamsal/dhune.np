-- name: CreateCategory :one
INSERT INTO categories (
    name,
    allowed_units,
    description,
    is_active,
    created_at,
    updated_at
) VALUES (
             $1,
             $2,
             $3,
             TRUE,
             NOW(),
             NOW()
         )
RETURNING *;

-- name: GetCategoryByID :one
SELECT *
FROM categories
WHERE id = $1;

-- name: ListActiveCategories :many
SELECT *
FROM categories
WHERE is_active = TRUE
ORDER BY name ASC;

-- name: UpdateCategory :one
UPDATE categories
SET
    name = $2,
    allowed_units = $3,
    description=$4,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: SetCategoryActiveStatus :exec
UPDATE categories
SET
    is_active = $2,
    updated_at = NOW()
WHERE id = $1;