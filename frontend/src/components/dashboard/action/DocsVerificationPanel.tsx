"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { StatusBadge } from "@/src/components/dashboard/StatusBadge"
import { ApprovalDialog } from "./ApprovalDialog"

export type DocumentStatus = "pending" | "approved" | "rejected"

export interface VerifiableDocument {
    id: string
    documentType: string
    documentUrl: string
    status: DocumentStatus
    verified: boolean
}

interface DocumentVerificationPanelProps {
    title?: string
    entityLabel: string        // "Vendor", "Business User", "User"
    documents: VerifiableDocument[]

    // optional hooks (backend later)
    onApprove?: (doc: VerifiableDocument, comment?: string) => void
    onReject?: (doc: VerifiableDocument, comment?: string) => void
}

export function DocumentVerificationPanel({
    title = "Documents Verification",
    entityLabel,
    documents,
    onApprove,
    onReject,
}: DocumentVerificationPanelProps) {
    const [dialog, setDialog] = useState<{
        doc: VerifiableDocument
        action: "approve" | "reject"
    } | null>(null)

    return (
        <div className="bg-white rounded-xl border shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-gray-500">
                    Verify uploaded documents for this {entityLabel.toLowerCase()}
                </p>
            </div>

            {/* Documents */}
            <div className="p-6 space-y-4">
                {documents.length === 0 && (
                    <p className="text-sm text-gray-400">
                        No documents uploaded yet.
                    </p>
                )}

                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                    >
                        {/* Left */}
                        <div className="space-y-1">
                            <p className="font-medium text-sm">
                                {humanize(doc.documentType)}
                            </p>
                            <a
                                href={doc.documentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-600 underline"
                            >
                                View document
                            </a>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-4">
                            <StatusBadge status={doc.status} />

                            {doc.status === "pending" && (
                                <>
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            setDialog({ doc, action: "approve" })
                                        }
                                    >
                                        Approve
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                            setDialog({ doc, action: "reject" })
                                        }
                                    >
                                        Reject
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Approval / Rejection Dialog */}
            <ApprovalDialog
                open={!!dialog}
                action={dialog?.action ?? "approve"}
                entityLabel={`${entityLabel} Document`}
                targetName={humanize(dialog?.doc.documentType ?? "")}
                onClose={() => setDialog(null)}
                onConfirm={({ action, comment }) => {
                    if (!dialog) return

                    if (action === "approve") {
                        onApprove?.(dialog.doc, comment)
                    } else {
                        onReject?.(dialog.doc, comment)
                    }

                    setDialog(null)
                }}
            />
        </div>
    )
}
function humanize(value: string) {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
}
