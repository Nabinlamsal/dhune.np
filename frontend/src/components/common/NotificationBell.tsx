"use client";

import { useNotifications } from "@/src/hooks/notifications/useNotifications";
import { NotificationItem } from "@/src/types/notifications/notifications";
import { cn } from "@/lib/utils";
import { Bell, CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type PortalRole = "admin" | "vendor";
type Theme = "dark" | "light";

const formatNotificationTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
};

const getNotificationHref = (role: PortalRole, item: NotificationItem) => {
    switch (item.entity_type) {
        case "request":
            return role === "admin" ? "/admin/requests" : "/vendor/marketplace";
        case "offer":
            return role === "admin" ? "/admin/offers" : "/vendor/my-offers";
        case "order":
            return role === "admin" ? "/admin/orders" : "/vendor/my-orders";
        case "user":
            return "/admin/users";
        default:
            return role === "admin" ? "/admin" : "/vendor";
    }
};

export default function NotificationBell({
    role,
    theme = "light",
    className,
}: {
    role: PortalRole;
    theme?: Theme;
    className?: string;
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        isMarkingAllRead,
    } = useNotifications(role);

    const hasUnread = unreadCount > 0;
    const unreadLabel = unreadCount > 99 ? "99+" : String(unreadCount);

    const shellClassName = useMemo(
        () =>
            theme === "dark"
                ? "border-[#13206e] bg-[#0a1154] text-slate-100 shadow-2xl"
                : "border-slate-200 bg-white text-slate-900 shadow-xl"
        ,
        [theme]
    );

    const mutedClassName = theme === "dark" ? "text-slate-300" : "text-slate-500";
    const itemClassName =
        theme === "dark"
            ? "border-[#13206e] hover:bg-white/5"
            : "border-slate-100 hover:bg-slate-50";

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const handleOpenNotification = async (item: NotificationItem) => {
        if (!item.is_read) {
            await markAsRead(item.id);
        }
        setOpen(false);
        router.push(getNotificationHref(role, item));
    };

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className={cn(
                    "relative rounded-lg p-2 transition",
                    theme === "dark"
                        ? "text-slate-300 hover:bg-amber-300/15 hover:text-amber-100"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
                aria-label="Open notifications"
                aria-expanded={open}
            >
                <Bell className="h-4 w-4" />
                {hasUnread && (
                    <span
                        className={cn(
                            "absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                            theme === "dark"
                                ? "bg-amber-300 text-[#040947]"
                                : "bg-orange-500 text-white"
                        )}
                    >
                        {unreadLabel}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className={cn(
                        "absolute right-0 z-50 mt-2 w-[22rem] rounded-2xl border p-3",
                        shellClassName
                    )}
                >
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold">Notifications</p>
                            <p className={cn("text-xs", mutedClassName)}>
                                {unreadCount} unread
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => markAllAsRead()}
                            disabled={!hasUnread || isMarkingAllRead}
                            className={cn(
                                "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition",
                                theme === "dark"
                                    ? "bg-white/10 text-slate-100 hover:bg-white/15 disabled:opacity-40"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                            )}
                        >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Mark all read
                        </button>
                    </div>

                    <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                        {!isLoading && notifications.length === 0 && (
                            <div
                                className={cn(
                                    "rounded-xl border px-3 py-6 text-center text-sm",
                                    theme === "dark"
                                        ? "border-[#13206e] bg-white/5 text-slate-300"
                                        : "border-slate-100 bg-slate-50 text-slate-500"
                                )}
                            >
                                No notifications yet.
                            </div>
                        )}

                        {notifications.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => void handleOpenNotification(item)}
                                className={cn(
                                    "w-full rounded-xl border px-3 py-3 text-left transition",
                                    itemClassName,
                                    !item.is_read &&
                                        (theme === "dark"
                                            ? "bg-amber-300/10"
                                            : "bg-orange-50")
                                )}
                            >
                                <div className="mb-1 flex items-start justify-between gap-3">
                                    <p className="text-sm font-semibold leading-5">{item.title}</p>
                                    {!item.is_read && (
                                        <span
                                            className={cn(
                                                "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                                                theme === "dark" ? "bg-amber-300" : "bg-orange-500"
                                            )}
                                        />
                                    )}
                                </div>
                                <p className={cn("text-xs leading-5", mutedClassName)}>{item.body}</p>
                                <p className={cn("mt-2 text-[11px]", mutedClassName)}>
                                    {formatNotificationTime(item.created_at)}
                                </p>
                            </button>
                        ))}
                    </div>

                    <div className="mt-3 border-t pt-3 text-right">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className={cn(
                                "text-xs font-medium transition",
                                theme === "dark"
                                    ? "text-amber-200 hover:text-amber-100"
                                    : "text-slate-600 hover:text-slate-900"
                            )}
                        >
                            Close panel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
