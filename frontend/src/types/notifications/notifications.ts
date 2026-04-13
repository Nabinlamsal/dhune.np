export type NotificationEntityType =
    | "user"
    | "request"
    | "offer"
    | "order"
    | string;

export interface NotificationItem {
    id: string;
    type: string;
    title: string;
    body: string;
    entity_type?: NotificationEntityType;
    entity_id?: string;
    actor_user_id?: string;
    data?: Record<string, unknown>;
    is_read: boolean;
    read_at?: string | null;
    created_at: string;
}

export interface NotificationUnreadCount {
    unread_count: number;
}

export interface WebSocketMessage {
    type: string;
    data: Record<string, unknown>;
}
