"use client"

import { cn } from "@/lib/utils"

/**
 * UI-level status (visual intent)
 * DO NOT put domain meanings here
 */
export type Status =
    | "success"
    | "warning"
    | "error"
    | "neutral"
    | "info"

/**
 * Optional domain aliases
 * (to keep backward compatibility)
 */
type DomainStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "active"
    | "disabled"
    | "suspended"

/**
 * Combined accepted inputs
 */
type StatusBadgeProps = {
    status: Status | DomainStatus
}

/* ---------------- style map ---------------- */

const STATUS_STYLES: Record<Status, string> = {
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
    neutral: "bg-gray-200 text-gray-600",
    info: "bg-blue-100 text-blue-700",
}

/* ---------------- domain → ui mapping ---------------- */

function normalizeStatus(status: Status | DomainStatus): Status {
    switch (status) {
        case "approved":
        case "active":
            return "success"

        case "pending":
            return "warning"

        case "rejected":
        case "suspended":
            return "error"

        case "disabled":
            return "neutral"

        default:
            return status
    }
}

//comonens

export function StatusBadge({ status }: StatusBadgeProps) {
    const normalized = normalizeStatus(status)

    return (
        <span
            className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold capitalize",
                STATUS_STYLES[normalized]
            )}
        >
            {status.replace("_", " ")}
        </span>
    )
}
