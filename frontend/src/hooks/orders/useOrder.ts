"use client";

import { getMyOrders, cancelOrder, getVendorOrders, updateOrderStatus, getOrderById, getAdminOrders, getOrderStats } from "@/src/services/orders/order_service";
import { CancelOrderPayload, UpdateOrderStatusPayload } from "@/src/types/orders/orders";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const useMyOrders = (limit = 10, offset = 0) => {
    return useQuery({
        queryKey: ["orders", "my", limit, offset],
        queryFn: () => getMyOrders(limit, offset),
    });
};

export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            payload,
        }: {
            orderId: string;
            payload?: CancelOrderPayload;
        }) => cancelOrder(orderId, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
};

export const useVendorOrders = (limit = 10, offset = 0) => {
    return useQuery({
        queryKey: ["orders", "vendor", limit, offset],
        queryFn: () => getVendorOrders(limit, offset),
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            payload,
        }: {
            orderId: string;
            payload: UpdateOrderStatusPayload;
        }) => updateOrderStatus(orderId, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
};

export const useOrderDetail = (orderId: string) => {
    return useQuery({
        queryKey: ["orders", "detail", orderId],
        queryFn: () => getOrderById(orderId),
        enabled: !!orderId,
    });
};


export const useAdminOrders = (
    status?: string,
    limit = 10,
    offset = 0
) => {
    return useQuery({
        queryKey: ["orders", "admin", status, limit, offset],
        queryFn: () => getAdminOrders(status, limit, offset),
    });
};

export const useOrderStats = () => {
    return useQuery({
        queryKey: ["orders", "stats"],
        queryFn: getOrderStats,
    });
};