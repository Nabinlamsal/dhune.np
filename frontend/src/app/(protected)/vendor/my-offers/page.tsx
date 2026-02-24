"use client"

import { useState } from "react"

import { DataTable } from "@/src/components/dashboard/table/DataTable"
import { StatCard } from "@/src/components/dashboard/StatCard"
import { DetailsDrawer } from "@/src/components/common/DetailsDrawer"
import { FilterTabs } from "@/src/components/common/FilterTabs"
import { StatusBadge, Status } from "@/src/components/common/StatusBadge"

import {
    useVendorOffers,
    useVendorOfferStats,
} from "@/src/hooks/orders/useOffer"

import { Offer } from "@/src/types/orders/offers"
import { OfferStatus } from "@/src/types/orders/orders-enums"
import { Detail } from "@/src/components/common/DetailItem"

function mapOfferStatusToBadge(status: OfferStatus): Status {
    switch (status) {
        case "PENDING":
            return "warning"
        case "ACCEPTED":
            return "success"
        case "REJECTED":
            return "error"
        case "WITHDRAWN":
            return "neutral"
        case "EXPIRED":
            return "neutral"
        default:
            return "neutral"
    }
}

export default function VendorOffersPage() {
    const [filter, setFilter] = useState<OfferStatus | "ALL">("ALL")
    const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null)

    const {
        data: offers,
        isLoading: isOffersLoading,
    } = useVendorOffers({
        status: filter === "ALL" ? undefined : filter,
    })

    const { data: stats } = useVendorOfferStats()

    const selectedOffer = offers?.find(
        (o: Offer) => o.id === selectedOfferId
    )
    console.log("OFFERS DATA:", offers)
    const columns = [
        {
            key: "request_id",
            header: "Request ID",
            render: (o: Offer) =>
                o.request_id.slice(0, 8) + "...",
        },
        {
            key: "bid_price",
            header: "Bid Amount",
            render: (o: Offer) =>
                `Rs. ${o.bid_price}`,
        },
        {
            key: "completion_time",
            header: "Completion Time",
            render: (o: Offer) =>
                new Date(o.completion_time).toLocaleString(),
        },
        {
            key: "status",
            header: "Status",
            render: (o: Offer) => (
                <StatusBadge
                    status={mapOfferStatusToBadge(o.status)}
                />
            ),
        },
        {
            key: "created_at",
            header: "Created",
            render: (o: Offer) =>
                o.created_at
                    ? new Date(o.created_at).toLocaleDateString()
                    : "—",
        },
    ]

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    My Offers
                </h2>
                <p className="text-sm text-gray-500">
                    Track and manage your submitted bids
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
                <StatCard
                    title="Total"
                    value={String(stats?.data.total_offers ?? 0)}
                    trend=""
                    description="All offers"
                />
                <StatCard
                    title="Pending"
                    value={String(stats?.data.pending_offers ?? 0)}
                    trend=""
                    description="Awaiting response"
                />
                <StatCard
                    title="Accepted"
                    value={String(stats?.data.accepted_offers ?? 0)}
                    trend=""
                    description="Accepted bids"
                />
                <StatCard
                    title="Rejected"
                    value={String(stats?.data.rejected_offers ?? 0)}
                    trend=""
                    description="Rejected offers"
                />
                <StatCard
                    title="Withdrawn"
                    value={String(stats?.data.withdrawn_offers ?? 0)}
                    trend=""
                    description="Withdrawn offers"
                />
                <StatCard
                    title="Expired"
                    value={String(stats?.data.expired_offers ?? 0)}
                    trend=""
                    description="Expired offers"
                />
            </div>

            {/* Filters */}
            <FilterTabs
                tabs={[
                    { label: "All", value: "ALL" },
                    { label: "Pending", value: "PENDING" },
                    { label: "Accepted", value: "ACCEPTED" },
                    { label: "Rejected", value: "REJECTED" },
                    { label: "Withdrawn", value: "WITHDRAWN" },
                    { label: "Expired", value: "EXPIRED" },
                ]}
                active={filter}
                onChange={(v) =>
                    setFilter(v as OfferStatus | "ALL")
                }
            />

            {/* Table */}
            <div className="mt-4">
                {isOffersLoading ? (
                    <div className="text-sm text-gray-500 p-6">
                        Loading offers...
                    </div>
                ) : !offers || offers.length === 0 ? (
                    <div className="text-sm text-gray-500 p-6">
                        No offers found
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={offers}
                        onRowClick={(o: Offer) =>
                            setSelectedOfferId(o.id)
                        }
                    />
                )}
            </div>
            {/* Details Drawer */}
            <DetailsDrawer
                open={!!selectedOfferId}
                onClose={() => setSelectedOfferId(null)}
                title="Offer Details"
            >
                {selectedOffer && (
                    <div className="space-y-4 text-sm">

                        <Detail
                            label="Offer ID"
                            value={selectedOffer.id}
                        />

                        <Detail
                            label="Request ID"
                            value={selectedOffer.request_id}
                        />

                        <Detail
                            label="Bid Amount"
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
                            label="Description"
                            value={selectedOffer.description}
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