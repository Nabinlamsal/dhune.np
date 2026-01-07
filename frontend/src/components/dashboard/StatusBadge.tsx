"use client"

import { cn } from "@/lib/utils"

type Status =
    | "pending"
    | "approved"
    | "rejected"
    | "disabled"
    | "active"
    | "suspended"

const statusStyles: Record<Status, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-emerald-100 text-emerald-700",
    active: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    disabled: "bg-gray-200 text-gray-600",
    suspended: "bg-red-100 text-red-700",
}

export function StatusBadge({ status }: { status: Status }) {
    return (
        <span
            className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold capitalize",
                statusStyles[status]
            )}
        >
            {status}
        </span>
    )
}
