"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardFooter } from "@/src/components/ui/card"
import { X } from "lucide-react"

type ActionType = "approve" | "reject"

interface ApprovalDialogProps {
    open: boolean
    onClose: () => void

    action: ActionType
    entityLabel: string // "User", "Vendor", "Business Account"
    targetName: string  // Display name

    onConfirm: (payload: {
        action: ActionType
        comment?: string
    }) => void
}

export function ApprovalDialog({
    open,
    onClose,
    action,
    entityLabel,
    targetName,
    onConfirm,
}: ApprovalDialogProps) {
    const [comment, setComment] = useState("")

    if (!open) return null

    const isReject = action === "reject"

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <Card className="w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="font-semibold text-lg">
                        {isReject ? "Reject" : "Approve"} {entityLabel}
                    </h3>
                    <button onClick={onClose}>
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <CardContent className="space-y-4 pt-6">
                    <p className="text-sm text-gray-600">
                        You are about to{" "}
                        <span className="font-medium">
                            {isReject ? "reject" : "approve"}
                        </span>{" "}
                        <strong>{targetName}</strong>.
                    </p>

                    <div>
                        <label className="text-sm font-medium">
                            Comment {isReject && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                            placeholder={
                                isReject
                                    ? "Reason for rejection (required)"
                                    : "Optional message for email notification"
                            }
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    {/* Email preview hint */}
                    <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-500">
                        This message will be included in the notification email.
                    </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        variant={isReject ? "destructive" : "default"}
                        disabled={isReject && comment.trim() === ""}
                        onClick={() =>
                            onConfirm({
                                action,
                                comment: comment || undefined,
                            })
                        }
                    >
                        Confirm {isReject ? "Rejection" : "Approval"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
