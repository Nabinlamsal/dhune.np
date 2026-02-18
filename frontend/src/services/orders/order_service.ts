import { api } from "@/src/libs/api";
import { ApiResponse } from "@/src/types/api";
import { OrderListItem, CancelOrderPayload, UpdateOrderStatusPayload, OrderDetail, OrderStats } from "@/src/types/orders/orders";



// GET /orders/my
export const getMyOrders = async (
    limit = 10,
    offset = 0
): Promise<ApiResponse<OrderListItem[]>> => {
    return api<ApiResponse<OrderListItem[]>>(
        `/orders/my?limit=${limit}&offset=${offset}`,
        { method: "GET" }
    );
};

// PATCH /orders/:id/cancel
export const cancelOrder = async (
    orderId: string,
    payload?: CancelOrderPayload
): Promise<ApiResponse<{ message: string }>> => {
    return api<ApiResponse<{ message: string }>>(
        `/orders/${orderId}/cancel`,
        {
            method: "PATCH",
            data: payload,
        }
    );
};

// GET /vendor/orders
export const getVendorOrders = async (
    limit = 10,
    offset = 0
): Promise<ApiResponse<OrderListItem[]>> => {
    return api<ApiResponse<OrderListItem[]>>(
        `/vendor/orders?limit=${limit}&offset=${offset}`,
        { method: "GET" }
    );
};

// PATCH /vendor/orders/:id/status
export const updateOrderStatus = async (
    orderId: string,
    payload: UpdateOrderStatusPayload
): Promise<ApiResponse<{ message: string }>> => {
    return api<ApiResponse<{ message: string }>>(
        `/vendor/orders/${orderId}/status`,
        {
            method: "PATCH",
            data: payload,
        }
    );
};

// GET /orders/:id
export const getOrderById = async (
    orderId: string
): Promise<ApiResponse<OrderDetail>> => {
    return api<ApiResponse<OrderDetail>>(
        `/orders/${orderId}`,
        { method: "GET" }
    );
};

// GET /admin/orders
export const getAdminOrders = async (
    status?: string,
    limit = 10,
    offset = 0
): Promise<ApiResponse<OrderListItem[]>> => {

    let url = `/admin/orders?limit=${limit}&offset=${offset}`;

    if (status) {
        url += `&status=${status}`;
    }

    return api<ApiResponse<OrderListItem[]>>(url, {
        method: "GET",
    });
};

// GET /admin/orders/stats
export const getOrderStats = async (): Promise<ApiResponse<OrderStats>> => {
    return api<ApiResponse<OrderStats>>(
        `/admin/orders/stats`,
        { method: "GET" }
    );
};