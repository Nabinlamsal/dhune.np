"use client"

import { useState } from "react"

import { DataTable } from "@/src/components/dashboard/table/DataTable"
import { StatusBadge } from "@/src/components/common/StatusBadge"
import { FilterTabs } from "@/src/components/common/FilterTabs"

/* ---------------- types ---------------- */

type RequestStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "disabled"
    | "active"
    | "suspended"

interface AdminRequest {
    id: string
    userName: string
    category: string
    itemCount: number
    offersCount: number
    status: RequestStatus
    createdAt: string

    // details (drawer)
    pickupAddress: string
    preferredTime: string
    notes?: string
}

/* ---------------- static mock ---------------- */

const REQUESTS: AdminRequest[] = [
    {
        id: "REQ-1001",
        userName: "Ramesh Shrestha",
        category: "Laundry",
        itemCount: 12,
        offersCount: 4,
        status: "pending",
        createdAt: "2024-12-10",
        pickupAddress: "Tokha, Kathmandu",
        preferredTime: "Tomorrow morning",
        notes: "Please handle whites carefully",
    },
    {
        id: "REQ-1002",
        userName: "Everest Hostel",
        category: "Bulk Laundry",
        itemCount: 85,
        offersCount: 6,
        status: "approved",
        createdAt: "2024-12-09",
        pickupAddress: "Baneshwor, Kathmandu",
        preferredTime: "Evening",
    },
    {
        id: "REQ-1003",
        userName: "Sita Sharma",
        category: "Dry Cleaning",
        itemCount: 5,
        offersCount: 0,
        status: "disabled",
        createdAt: "2024-12-05",
        pickupAddress: "Lalitpur",
        preferredTime: "Anytime",
    },
]

/* ---------------- page ---------------- */

export default function AdminRequestsPage() {
    const [filter, setFilter] = useState<
        "all" | RequestStatus
    >("all")

    const [selectedRequest, setSelectedRequest] =
        useState<AdminRequest | null>(null)

    const filteredRequests =
        filter === "all"
            ? REQUESTS
            : REQUESTS.filter((r) => r.status === filter)

    const columns = [
        {
            key: "id",
            header: "Request ID",
        },
        {
            key: "userName",
            header: "User",
        },
        {
            key: "category",
            header: "Category",
        },
        {
            key: "itemCount",
            header: "Items",
        },
        {
            key: "offersCount",
            header: "Offers",
        },
        {
            key: "status",
            header: "Status",
            render: (req: AdminRequest) => (
                <StatusBadge status={req.status} />
            ),
        },
        {
            key: "createdAt",
            header: "Created",
        },
    ]

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Requests
                </h2>
                <p className="text-sm text-gray-500">
                    User service requests before vendor engagement
                </p>
            </div>

            {/* Filters */}
            <FilterTabs
                tabs={[
                    { label: "All", value: "all" },
                    { label: "Open", value: "open" },
                    { label: "Offer Accepted", value: "offer_accepted" },
                    { label: "Expired", value: "expired" },
                    { label: "Cancelled", value: "cancelled" },
                ]}
                active={filter}
                onChange={(v) =>
                    setFilter(v as "all" | RequestStatus)
                }
            />

            {/* Table */}
            <DataTable
                columns={columns}
                data={filteredRequests}
                onRowClick={(req) => setSelectedRequest(req)}
            />

            {/* Details Drawer */}
            <DetailsDrawer
                open={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                title="Request Details"
            >
                {selectedRequest && (
                    <div className="space-y-4 text-sm">
                        <Detail label="Request ID" value={selectedRequest.id} />
                        <Detail label="User" value={selectedRequest.userName} />
                        <Detail label="Category" value={selectedRequest.category} />
                        <Detail
                            label="Items / Weight"
                            value={String(selectedRequest.itemCount)}
                        />
                        <Detail
                            label="Offers Received"
                            value={String(selectedRequest.offersCount)}
                        />
                        <Detail
                            label="Pickup Address"
                            value={selectedRequest.pickupAddress}
                        />
                        <Detail
                            label="Preferred Time"
                            value={selectedRequest.preferredTime}
                        />
                        <Detail
                            label="Status"
                            value={selectedRequest.status}
                        />

                        {selectedRequest.notes && (
                            <Detail
                                label="User Notes"
                                value={selectedRequest.notes}
                            />
                        )}
                    </div>
                )}
            </DetailsDrawer>
        </>
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
