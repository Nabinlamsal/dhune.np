-- name: GetAdminFinanceStats :one
SELECT 
    COALESCE(SUM(c.order_amount), 0)::numeric AS total_completed_order_value,
    COUNT(c.id)::int AS total_completed_orders,
    COALESCE(SUM(c.commission_amount) FILTER (WHERE c.status = 'PAID'), 0)::numeric AS total_platform_earnings,
    COALESCE(SUM(c.commission_amount) FILTER (WHERE c.status = 'PENDING'), 0)::numeric AS total_pending_dues
FROM commissions c;

-- name: GetVendorFinanceStats :one
SELECT 
    COALESCE(SUM(c.order_amount), 0)::numeric AS total_order_value,
    COUNT(c.id)::int AS total_completed_orders,
    COALESCE(SUM(c.commission_amount), 0)::numeric AS total_commission,
    COALESCE(SUM(c.commission_amount) FILTER (WHERE c.status = 'PAID'), 0)::numeric AS total_paid_to_platform,
    COALESCE(SUM(c.commission_amount) FILTER (WHERE c.status = 'PENDING'), 0)::numeric AS total_pending_due
FROM commissions c
WHERE c.vendor_id = $1;
