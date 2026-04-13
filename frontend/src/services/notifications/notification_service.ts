import { api } from "@/src/libs/api";
import { ApiResponse } from "@/src/types/api";
import {
    NotificationItem,
    NotificationUnreadCount,
} from "@/src/types/notifications/notifications";

export const getNotifications = async (
    limit = 20,
    offset = 0,
    unreadOnly = false
): Promise<ApiResponse<NotificationItem[]>> => {
    return api<ApiResponse<NotificationItem[]>>(
        `/notifications?limit=${limit}&offset=${offset}&unread_only=${unreadOnly}`,
        { method: "GET" }
    );
};

export const getUnreadNotificationCount = async (): Promise<ApiResponse<NotificationUnreadCount>> => {
    return api<ApiResponse<NotificationUnreadCount>>(
        "/notifications/unread-count",
        { method: "GET" }
    );
};

export const markNotificationRead = async (
    notificationId: string
): Promise<ApiResponse<{ message: string }>> => {
    return api<ApiResponse<{ message: string }>>(
        `/notifications/${notificationId}/read`,
        { method: "PATCH" }
    );
};

export const markAllNotificationsRead = async (): Promise<ApiResponse<{ message: string }>> => {
    return api<ApiResponse<{ message: string }>>(
        "/notifications/read-all",
        { method: "PATCH" }
    );
};
