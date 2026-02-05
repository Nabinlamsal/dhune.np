"use client"

import { MoreVertical } from "lucide-react"
import { Button } from "@/src/components/ui/button"

interface ActionMenuProps {
    onView?: () => void
    onApprove?: () => void
    onReject?: () => void
    onDelete?: () => void
    onSuspend?: () => void
}

export function ActionMenu({
    onView,
    onApprove,
    onReject,
    onDelete,
    onSuspend
}: ActionMenuProps) {
    return (
        <div className="relative group" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
            </Button>

            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition">
                {onView && (
                    <button
                        onClick={onView}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        View Details
                    </button>
                )}
                {onApprove && (
                    <button
                        onClick={onApprove}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        Approve
                    </button>
                )}
                {onReject && (
                    <button
                        onClick={onReject}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                        Reject
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                        Delete
                    </button>
                )}
                {onSuspend && (
                    <button
                        onClick={onReject}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                        Reject
                    </button>
                )}
            </div>
        </div>
    )
}
