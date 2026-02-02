"use client"

import { VerifiableDocument, DocumentVerificationPanel } from "@/src/components/dashboard/action/DocsVerificationPanel"
import { StatusBadge } from "@/src/components/dashboard/StatusBadge"

interface AdminVendorDetails {
    id: string
    displayName: string
    email: string
    phone: string
    ownerName: string
    address: string
    registrationNumber: string
    approvalStatus: "pending" | "approved" | "rejected"
    isActive: boolean
    createdAt: string
    documents: VerifiableDocument[]
}

// static mock (API later)
const vendor: AdminVendorDetails = {
    id: "v1",
    displayName: "CleanMax Laundry",
    email: "cleanmax@gmail.com",
    phone: "9800001111",
    ownerName: "Ram Bahadur",
    address: "Kathmandu, Nepal",
    registrationNumber: "REG-8899",
    approvalStatus: "pending",
    isActive: true,
    createdAt: "2024-12-10",
    documents: [
        {
            id: "d1",
            documentType: "vendor_registration",
            documentUrl: "https://example.com/vendor-reg.pdf",
            status: "pending",
            verified: false,
        },
        {
            id: "d2",
            documentType: "tax_clearance",
            documentUrl: "https://example.com/tax-clearance.pdf",
            status: "approved",
            verified: true,
        },
    ],
}

export default function VendorDetailsPage() {
    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">{vendor.displayName}</h2>
                <div className="mt-2">
                    <StatusBadge status={vendor.approvalStatus} />
                </div>
            </div>

            {/* Vendor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <Detail label="Owner Name" value={vendor.ownerName} />
                <Detail label="Email" value={vendor.email} />
                <Detail label="Phone" value={vendor.phone} />
                <Detail label="Address" value={vendor.address} />
                <Detail
                    label="Registration Number"
                    value={vendor.registrationNumber}
                />
                <Detail label="Joined" value={vendor.createdAt} />
            </div>

            {/* Documents Verification */}
            <DocumentVerificationPanel
                entityLabel="Vendor"
                documents={vendor.documents}
                onApprove={(doc, comment) => {
                    console.log("Approve vendor document", doc, comment)
                }}
                onReject={(doc, comment) => {
                    console.log("Reject vendor document", doc, comment)
                }}
            />
        </div>
    )
}

function Detail({
    label,
    value,
}: {
    label: string
    value?: string
}) {
    return (
        <div>
            <p className="text-gray-500">{label}</p>
            <p className="font-medium">{value ?? "—"}</p>
        </div>
    )
}
