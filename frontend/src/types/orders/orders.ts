import { ApiResponse } from "../api";
import { AdminUserSummary } from "../users/admin-user-summary";
import { OrderStatus, PaymentStatus } from "./orders-enums";
import { RequestDetail } from "./requests";

export interface OrderListItem {
    id: string;
    request_id: string;
    offer_id: string;
    final_price: number;
    order_status: OrderStatus;
    payment_status: PaymentStatus;
    created_at: string;

    user?: AdminUserSummary;
    vendor?: AdminUserSummary;
}

export interface OrderDetailResponse {
    order: {
        id: string;
        request_id: string;
        offer_id: string;
        final_price: number;
        order_status: OrderStatus;
        payment_status: PaymentStatus;
        created_at: string;
    };

    request: RequestDetail;
    user: AdminUserSummary;
    vendor: AdminUserSummary;
}

export interface OrderStats {
    total_orders: number;
    accepted_orders: number;
    picked_up_orders: number;
    in_progress_orders: number;
    delivering_orders: number;
    completed_orders: number;
    cancelled_orders: number;
}

export interface UpdateOrderStatusPayload {
    status: OrderStatus;
}

export interface CancelOrderPayload {
    reason?: string;
}

export type ListOrdersResponse = ApiResponse<OrderListItem[]>;
export type OrderResponse = ApiResponse<OrderDetailResponse>;
export type OrderStatsResponse = ApiResponse<OrderStats>;
export type OrderMessageResponse = ApiResponse<{ message: string }>;