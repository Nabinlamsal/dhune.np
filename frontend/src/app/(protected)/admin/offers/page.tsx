// "use client"

// import { useState } from "react"

// import { StatCard } from "@/src/components/dashboard/StatCard"
// import { DataTable } from "@/src/components/dashboard/table/DataTable"
// import { StatusBadge } from "@/src/components/common/StatusBadge"
// import { DetailsDrawer } from "@/src/components/common/DetailsDrawer"
// import { FilterTabs } from "@/src/components/common/FilterTabs"



// type OfferStatus =
//     | "submitted"
//     | "accepted"
//     | "rejected"
//     | "expired"
//     | "withdrawn"

// interface AdminOffer {
//     id: string
//     requestId: string
//     vendorName: string
//     vendorId: string
//     price: number
//     estimatedDays: number
//     status: OfferStatus
//     createdAt: string
// }


// const OFFERS: AdminOffer[] = [
//     {
//         id: "OF-001",
//         requestId: "REQ-1001",
//         vendorName: "CleanX Laundry",
//         vendorId: "V-01",
//         price: 850,
//         estimatedDays: 2,
//         status: "submitted",
//         createdAt: "2025-01-10",
//     },
//     {
//         id: "OF-002",
//         requestId: "REQ-1002",
//         vendorName: "Washmandu",
//         vendorId: "V-02",
//         price: 1200,
//         estimatedDays: 3,
//         status: "accepted",
//         createdAt: "2025-01-09",
//     },
//     {
//         id: "OF-003",
//         requestId: "REQ-1003",
//         vendorName: "Sparkle Cleaners",
//         vendorId: "V-03",
//         price: 950,
//         estimatedDays: 2,
//         status: "rejected",
//         createdAt: "2025-01-08",
//     },
//     {
//         id: "OF-004",
//         requestId: "REQ-1004",
//         vendorName: "QuickWash",
//         vendorId: "V-04",
//         price: 700,
//         estimatedDays: 1,
//         status: "expired",
//         createdAt: "2025-01-07",
//     },
// ]

// /* ---------------- helpers ---------------- */

// function mapOfferStatusToBadge(status: OfferStatus) {
//     switch (status) {
//         case "accepted":
//             return "success"
//         case "submitted":
//             return "info"
//         case "rejected":
//         case "withdrawn":
//             return "error"
//         case "expired":
//             return "neutral"
//         default:
//             return "neutral"
//     }
// }

// /* ---------------- page ---------------- */

// export default function AdminOffersPage() {
//     const [filter, setFilter] = useState<
//         "all" | "submitted" | "accepted" | "rejected"
//     >("all")

//     const [selectedOffer, setSelectedOffer] =
//         useState<AdminOffer | null>(null)

//     const filteredOffers =
//         filter === "all"
//             ? OFFERS
//             : OFFERS.filter((o) => o.status === filter)

//     const columns = [
//         { key: "id", header: "Offer ID" },
//         { key: "requestId", header: "Request ID" },
//         { key: "vendorName", header: "Vendor" },
//         {
//             key: "price",
//             header: "Price (NPR)",
//             render: (o: AdminOffer) => `Rs. ${o.price}`,
//         },
//         {
//             key: "estimatedDays",
//             header: "ETA",
//             render: (o: AdminOffer) => `${o.estimatedDays} days`,
//         },
//         {
//             key: "status",
//             header: "Status",
//             render: (o: AdminOffer) => (
//                 <StatusBadge status={mapOfferStatusToBadge(o.status)} />
//             ),
//         },
//         { key: "createdAt", header: "Submitted On" },
//     ]

//     /* ---------------- stats ---------------- */

//     const totalOffers = OFFERS.length
//     const acceptedOffers = OFFERS.filter(
//         (o) => o.status === "accepted"
//     ).length
//     const pendingOffers = OFFERS.filter(
//         (o) => o.status === "submitted"
//     ).length
//     const rejectedOffers = OFFERS.filter(
//         (o) => o.status === "rejected"
//     ).length

//     return (
//         <>
//             {/* Header */}
//             <div className="mb-8">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                     Offers Management
//                 </h2>
//                 <p className="text-sm text-gray-500">
//                     Monitor vendor offers submitted against user requests
//                 </p>
//             </div>

//             {/* Stats */}
//             <div className="flex flex-4 gap-7 mb-6">
//                 <StatCard
//                     title="Total Offers"
//                     value={String(totalOffers)}
//                     trend=""
//                     description="All submitted offers"
//                 />
//                 <StatCard
//                     title="Pending Offers"
//                     value={String(pendingOffers)}
//                     trend=""
//                     description="Awaiting user action"
//                 />
//                 <StatCard
//                     title="Accepted Offers"
//                     value={String(acceptedOffers)}
//                     trend=""
//                     description="Converted to orders"
//                 />
//                 <StatCard
//                     title="Rejected Offers"
//                     value={String(rejectedOffers)}
//                     trend=""
//                     description="Declined by users"
//                 />
//             </div>

//             {/* Filters */}
//             <FilterTabs
//                 tabs={[
//                     { label: "All", value: "all" },
//                     { label: "Submitted", value: "submitted" },
//                     { label: "Accepted", value: "accepted" },
//                     { label: "Rejected", value: "rejected" },
//                 ]}
//                 active={filter}
//                 onChange={(v) =>
//                     setFilter(v as "all" | "submitted" | "accepted" | "rejected")
//                 }
//             />

//             {/* Table */}
//             <DataTable
//                 columns={columns}
//                 data={filteredOffers}
//                 onRowClick={(row) => setSelectedOffer(row)}
//             />

//             {/* Details Drawer */}
//             <DetailsDrawer
//                 open={!!selectedOffer}
//                 onClose={() => setSelectedOffer(null)}
//                 title="Offer Details"
//             >
//                 {selectedOffer && (
//                     <div className="space-y-4 text-sm">
//                         <Detail label="Offer ID" value={selectedOffer.id} />
//                         <Detail label="Request ID" value={selectedOffer.requestId} />
//                         <Detail label="Vendor" value={selectedOffer.vendorName} />
//                         <Detail
//                             label="Price"
//                             value={`Rs. ${selectedOffer.price}`}
//                         />
//                         <Detail
//                             label="Estimated Time"
//                             value={`${selectedOffer.estimatedDays} days`}
//                         />
//                         <Detail label="Status" value={selectedOffer.status} />
//                         <Detail
//                             label="Submitted On"
//                             value={selectedOffer.createdAt}
//                         />
//                     </div>
//                 )}
//             </DetailsDrawer>
//         </>
//     )
// }

// function Detail({
//     label,
//     value,
// }: {
//     label: string
//     value?: string
// }) {
//     return (
//         <div>
//             <p className="text-gray-500">{label}</p>
//             <p className="font-medium">{value ?? "—"}</p>
//         </div>
//     )
// }
"use client"

import { useState } from "react"

import { StatCard } from "@/src/components/dashboard/StatCard"
import { DataTable } from "@/src/components/dashboard/table/DataTable"
import { StatusBadge } from "@/src/components/common/StatusBadge"
import { DetailsDrawer } from "@/src/components/common/DetailsDrawer"
import { FilterTabs } from "@/src/components/common/FilterTabs"
import { useAdminOffers, useAdminOfferStats } from "@/src/hooks/orders/useOffer"
import { Offer } from "@/src/types/orders/offers"
import { OfferStatus } from "@/src/types/orders/orders-enums"

/* ---------------- Status → UI mapping ---------------- */

function mapOfferStatus(status: OfferStatus) {
    switch (status) {
        case "ACCEPTED":
            return "success"
        case "PENDING":
            return "warning"
        case "REJECTED":
        case "WITHDRAWN":
            return "error"
        case "EXPIRED":
            return "neutral"
        default:
            return "neutral"
    }
}

/* ---------------- page ---------------- */

export default function AdminOffersPage() {
    const [filter, setFilter] = useState<"all" | OfferStatus>("all")
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)

    const [page, setPage] = useState(0)
    const pageSize = 10

    const { data, isLoading } = useAdminOffers(
        filter === "all" ? undefined : filter,
        undefined,
        undefined,
        pageSize,
        page * pageSize
    )

    const { data: stats } = useAdminOfferStats()

    const offers: Offer[] = data?.data ?? []

    const columns = [
        { key: "id", header: "Offer ID" },
        { key: "request_id", header: "Request ID" },
        {
            key: "bid_price",
            header: "Price (NPR)",
            render: (o: Offer) => `Rs. ${o.bid_price}`,
        },
        {
            key: "completion_time",
            header: "Completion Time",
            render: (o: Offer) =>
                new Date(o.completion_time).toLocaleDateString(),
        },
        {
            key: "status",
            header: "Status",
            render: (o: Offer) => (
                <StatusBadge status={mapOfferStatus(o.status)} />
            ),
        },
        {
            key: "created_at",
            header: "Submitted On",
            render: (o: Offer) =>
                o.created_at
                    ? new Date(o.created_at).toLocaleDateString()
                    : "—",
        },
    ]

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    Offers Management
                </h2>
                <p className="text-sm text-gray-500">
                    Monitor vendor offers submitted against user requests
                </p>
            </div>

            {/* Stats */}
            <div className="flex flex-4 gap-7 mb-6">
                <StatCard
                    title="Total Offers"
                    value={String(stats?.data.total_offers ?? 0)}
                    trend=""
                    description="All submitted offers"
                />
                <StatCard
                    title="Pending Offers"
                    value={String(stats?.data.pending_offers ?? 0)}
                    trend=""
                    description="Awaiting user action"
                />
                <StatCard
                    title="Accepted Offers"
                    value={String(stats?.data.accepted_offers ?? 0)}
                    trend=""
                    description="Converted to orders"
                />
                <StatCard
                    title="Rejected Offers"
                    value={String(stats?.data.rejected_offers ?? 0)}
                    trend=""
                    description="Declined by users"
                />
            </div>

            {/* Filters */}
            <FilterTabs
                tabs={[
                    { label: "All", value: "all" },
                    { label: "Pending", value: "PENDING" },
                    { label: "Accepted", value: "ACCEPTED" },
                    { label: "Rejected", value: "REJECTED" },
                    { label: "Withdrawn", value: "WITHDRAWN" },
                    { label: "Expired", value: "EXPIRED" },
                ]}
                active={filter}
                onChange={(v) =>
                    setFilter(v as "all" | OfferStatus)
                }
            />

            {/* Table */}
            {isLoading ? (
                <div className="p-6 text-gray-500">
                    Loading offers…
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={offers}
                    onRowClick={(row: Offer) =>
                        setSelectedOffer(row)
                    }
                />
            )}

            {/* Pagination */}
            <div className="flex justify-end gap-2 mt-4">
                <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className="border px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                    Previous
                </button>

                <button
                    disabled={offers.length < pageSize}
                    onClick={() => setPage((p) => p + 1)}
                    className="border px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Details Drawer */}
            <DetailsDrawer
                open={!!selectedOffer}
                onClose={() => setSelectedOffer(null)}
                title="Offer Details"
            >
                {selectedOffer && (
                    <div className="space-y-4 text-sm">
                        <Detail label="Offer ID" value={selectedOffer.id} />
                        <Detail label="Request ID" value={selectedOffer.request_id} />
                        <Detail
                            label="Price"
                            value={`Rs. ${selectedOffer.bid_price}`}
                        />
                        <Detail
                            label="Completion Time"
                            value={new Date(
                                selectedOffer.completion_time
                            ).toLocaleString()}
                        />
                        <Detail
                            label="Status"
                            value={selectedOffer.status}
                        />
                        <Detail
                            label="Created At"
                            value={
                                selectedOffer.created_at
                                    ? new Date(
                                        selectedOffer.created_at
                                    ).toLocaleString()
                                    : "—"
                            }
                        />
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