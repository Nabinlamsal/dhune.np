"use client";

import { getWebSocketUrl } from "@/src/libs/api";
import {
    getNotifications,
    getUnreadNotificationCount,
    markAllNotificationsRead,
    markNotificationRead,
} from "@/src/services/notifications/notification_service";
import { NotificationItem, WebSocketMessage } from "@/src/types/notifications/notifications";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const notificationKeys = {
    all: ["notifications"] as const,
    list: (limit: number, offset: number, unreadOnly: boolean) =>
        [...notificationKeys.all, "list", limit, offset, unreadOnly] as const,
    unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

type PortalRole = "admin" | "vendor";

const invalidatePortalQueries = (
    queryClient: ReturnType<typeof useQueryClient>,
    role: PortalRole,
    messageType: string,
    entityType?: string
) => {
    const keySet = new Set<string>();

    if (role === "admin") {
        keySet.add(JSON.stringify(["admin-orders"]));
        keySet.add(JSON.stringify(["orders", "admin", "stats"]));
        keySet.add(JSON.stringify(["admin-offers"]));
        keySet.add(JSON.stringify(["offers", "admin", "stats"]));
        keySet.add(JSON.stringify(["admin-requests"]));
        keySet.add(JSON.stringify(["requests", "admin", "stats"]));
    }

    if (role === "vendor") {
        keySet.add(JSON.stringify(["vendor-orders"]));
        keySet.add(JSON.stringify(["orders", "vendor", "stats"]));
        keySet.add(JSON.stringify(["vendor-offers"]));
        keySet.add(JSON.stringify(["offers", "vendor", "stats"]));
        keySet.add(JSON.stringify(["marketplace-requests"]));
    }

    if (role === "admin" && (entityType === "user" || messageType === "USER_REGISTERED")) {
        keySet.add(JSON.stringify(["admin-users"]));
    }

    if (entityType === "order" || messageType.startsWith("ORDER_")) {
        if (role === "vendor") {
            keySet.add(JSON.stringify(["orders", "detail"]));
        }
    }

    if (entityType === "offer" || messageType.startsWith("OFFER_")) {
        keySet.add(JSON.stringify(["offers-by-request"]));
    }

    if (entityType === "request" || messageType.startsWith("REQUEST_")) {
        keySet.add(JSON.stringify(["request-detail"]));
    }

    for (const rawKey of keySet) {
        queryClient.invalidateQueries({
            queryKey: JSON.parse(rawKey) as readonly unknown[],
        });
    }
};

const getToastBody = (message: WebSocketMessage) => {
    const body = message.data.body;
    return typeof body === "string" && body.trim() ? body : undefined;
};

const getToastTitle = (message: WebSocketMessage) => {
    const title = message.data.title;
    if (typeof title === "string" && title.trim()) {
        return title;
    }
    return message.type.replaceAll("_", " ");
};

export const useNotifications = (
    role: PortalRole,
    {
        limit = 20,
        offset = 0,
        unreadOnly = false,
        enabled = true,
    }: {
        limit?: number;
        offset?: number;
        unreadOnly?: boolean;
        enabled?: boolean;
    } = {}
) => {
    const queryClient = useQueryClient();
    const reconnectTimeoutRef = useRef<number | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const notificationsQuery = useQuery<NotificationItem[]>({
        queryKey: notificationKeys.list(limit, offset, unreadOnly),
        queryFn: async () => {
            const res = await getNotifications(limit, offset, unreadOnly);
            return res.data;
        },
        enabled,
    });

    const unreadCountQuery = useQuery<number>({
        queryKey: notificationKeys.unreadCount(),
        queryFn: async () => {
            const res = await getUnreadNotificationCount();
            return res.data.unread_count;
        },
        enabled,
    });

    const markReadMutation = useMutation({
        mutationFn: markNotificationRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });

    const markAllReadMutation = useMutation({
        mutationFn: markAllNotificationsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });

    useEffect(() => {
        if (!enabled || typeof window === "undefined") {
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }

        let disposed = false;

        const clearReconnect = () => {
            if (reconnectTimeoutRef.current !== null) {
                window.clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };

        const connect = () => {
            clearReconnect();

            const socket = new WebSocket(getWebSocketUrl(token));
            wsRef.current = socket;

            socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data) as WebSocketMessage;
                    const entityType =
                        typeof message.data.entity_type === "string"
                            ? message.data.entity_type
                            : undefined;

                    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
                    invalidatePortalQueries(queryClient, role, message.type, entityType);

                    const description = getToastBody(message);
                    if (description) {
                        toast.info(getToastTitle(message), {
                            description,
                        });
                    } else {
                        toast.info(getToastTitle(message));
                    }
                } catch {
                    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
                }
            };

            socket.onclose = () => {
                wsRef.current = null;
                if (disposed) {
                    return;
                }
                reconnectTimeoutRef.current = window.setTimeout(connect, 3000);
            };

            socket.onerror = () => {
                socket.close();
            };
        };

        connect();

        return () => {
            disposed = true;
            clearReconnect();
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [enabled, queryClient, role]);

    return {
        notifications: notificationsQuery.data ?? [],
        unreadCount: unreadCountQuery.data ?? 0,
        isLoading: notificationsQuery.isLoading || unreadCountQuery.isLoading,
        isFetching: notificationsQuery.isFetching || unreadCountQuery.isFetching,
        markAsRead: markReadMutation.mutateAsync,
        markAllAsRead: markAllReadMutation.mutateAsync,
        isMarkingAllRead: markAllReadMutation.isPending,
    };
};
