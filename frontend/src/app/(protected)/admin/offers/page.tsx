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
import { Detail } from "@/src/components/common/DetailItem"
import { ClipboardList, FileText, ShieldUser, UserRound, Wallet } from "lucide-react"
import { formatDisplayId } from "@/src/utils/display"


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

    const offers: Offer[] = data ?? []
    console.log("Offers:", offers)
    const columns = [
        {
            key: "id",
            header: "Offer ID",
            render: (o: Offer) =>
                o?.id ? formatDisplayId(o.id, "OFF") : "--",
        },
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
                <StatusBadge status={mapOfferStatus(o.status)} label={o.status} />
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
            <div className="flex gap-6 mb-6">
                <StatCard
                    title="Total Offers"
                    value={String(stats?.data?.total_offers ?? 0)}
                    trend=""
                    description="All submitted offers"
                />
                <StatCard
                    title="Pending"
                    value={String(stats?.data?.pending_offers ?? 0)}
                    trend=""
                    description="Awaiting user action"
                />
                <StatCard
                    title="Accepted"
                    value={String(stats?.data?.accepted_offers ?? 0)}
                    trend=""
                    description="Converted to orders"
                />
                <StatCard
                    title="Rejected"
                    value={String(stats?.data?.rejected_offers ?? 0)}
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
            ) : offers.length === 0 ? (
                <div className="p-6 text-gray-500">
                    No offers found
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
                    <div className="space-y-3 text-sm">

                        {/* Offer Information */}
                        <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                            <h4 className="flex items-center gap-2 font-semibold border-b border-[#040947]/15 pb-2 text-slate-900">
                                <ClipboardList className="size-4 text-[#040947]" />
                                Offer Information
                            </h4>

                            <Detail label="Offer ID" value={selectedOffer.id} />
                            <Detail label="Request ID" value={selectedOffer.request_id} />
                            <Detail label="Bid Amount" value={`Rs. ${selectedOffer.bid_price}`} />

                            <Detail
                                label="Completion Time"
                                value={new Date(selectedOffer.completion_time).toLocaleString()}
                            />

                            <Detail
                                label="Submitted On"
                                value={
                                    selectedOffer.created_at
                                        ? new Date(selectedOffer.created_at).toLocaleString()
                                        : "—"
                                }
                            />
                        </div>


                        {/* Vendor Details */}
                        {selectedOffer.vendor && (
                            <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                                <h4 className="flex items-center gap-2 font-semibold border-b border-[#040947]/15 pb-2 text-slate-900">
                                    <ShieldUser className="size-4 text-[#040947]" />
                                    Vendor Details
                                </h4>

                                <Detail label="Vendor Name" value={selectedOffer.vendor.DisplayName} />
                                <Detail label="Email" value={selectedOffer.vendor.Email} />
                                <Detail label="Phone" value={selectedOffer.vendor.Phone} />
                                <Detail label="Role" value={selectedOffer.vendor.Role} />
                                <Detail label="Account Active" value={selectedOffer.vendor.IsActive ? "Yes" : "No"} />

                                {selectedOffer.vendor.BusinessApprovalStatus && (
                                    <Detail
                                        label="Business Approval"
                                        value={selectedOffer.vendor.BusinessApprovalStatus}
                                    />
                                )}

                                {selectedOffer.vendor.VendorApprovalStatus && (
                                    <Detail
                                        label="Vendor Approval"
                                        value={selectedOffer.vendor.VendorApprovalStatus}
                                    />
                                )}

                            </div>
                        )}


                        {/* User Details */}
                        {selectedOffer.user && (
                            <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                                <h4 className="flex items-center gap-2 font-semibold border-b border-[#040947]/15 pb-2 text-slate-900">
                                    <UserRound className="size-4 text-[#040947]" />
                                    Customer Details
                                </h4>

                                <Detail label="Name" value={selectedOffer.user.DisplayName} />
                                <Detail label="Email" value={selectedOffer.user.Email} />
                                <Detail label="Phone" value={selectedOffer.user.Phone} />
                                <Detail label="Role" value={selectedOffer.user.Role} />
                                <Detail label="Account Active" value={selectedOffer.user.IsActive ? "Yes" : "No"} />

                            </div>
                        )}


                        {/* Status */}
                        <div className="rounded-xl border border-[#040947]/15 bg-white p-3">
                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-slate-900">
                                <Wallet className="size-4 text-[#040947]" />
                                Status
                            </h4>

                            <StatusBadge
                                status={mapOfferStatus(selectedOffer.status)}
                                label={selectedOffer.status}
                            />
                        </div>


                        {/* Description */}
                        {selectedOffer.description && (
                            <div className="rounded-xl border border-[#040947]/15 bg-white p-3">
                                <h4 className="font-semibold mb-2 flex items-center gap-2 text-slate-900">
                                    <FileText className="size-4 text-[#040947]" />
                                    Description
                                </h4>

                                <p className="text-gray-600 leading-relaxed">
                                    {selectedOffer.description}
                                </p>

                            </div>
                        )}

                    </div>
                )}
            </DetailsDrawer>
        </>
    )
}

