"use client";

import { getMyOrders, cancelOrder, getVendorOrders, updateOrderStatus, getOrderById, getAdminOrders, getOrderStats } from "@/src/services/orders/order_service";
import { CancelOrderPayload, UpdateOrderStatusPayload } from "@/src/types/orders/orders";
import { OrderStatus } from "@/src/types/orders/orders-enums";
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

export const useVendorOrders = ({
    status,
    sort = "newest",
    limit = 10,
    offset = 0,
}: {
    status?: OrderStatus;
    sort?: "newest" | "pickup";
    limit?: number;
    offset?: number;
}) => {
    return useQuery({
        queryKey: ["vendor-orders", status, sort, limit, offset],
        queryFn: async () => {
            const res = await getVendorOrders({
                status,
                sort,
                limit,
                offset,
            });

            return res.data;
        },
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


export const useOrderDetail = (orderId?: string) => {
    return useQuery({
        queryKey: ["orders", "detail", orderId],
        queryFn: () => getOrderById(orderId as string),
        enabled: !!orderId, // only run if exists
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