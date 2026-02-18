import { ApiResponse } from "../api";
import { AdminUserSummary } from "../users/admin-user-summary";
import { OrderStatus, PaymentStatus } from "./orders-enums";

export interface OrderListItem {
    id: string;
    requestId: string;
    offerId: string;

    finalPrice: number;

    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;

    createdAt: string;

    user?: AdminUserSummary;
    vendor?: AdminUserSummary;
}

export interface OrderDetail {
    id: string;

    requestId: string;
    offerId: string;

    finalPrice: number;

    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;

    pickupTime?: string;
    deliveryTime?: string;

    createdAt: string;

    user: AdminUserSummary;
    vendor: AdminUserSummary;

    pickupAddress?: string;
    pickupTimeFrom?: string;
    pickupTimeTo?: string;
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
export type OrderResponse = ApiResponse<OrderDetail>;
export type OrderStatsResponse = ApiResponse<OrderStats>;
export type OrderMessageResponse = ApiResponse<{ message: string }>;