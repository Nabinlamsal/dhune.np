"use client"

import { useState } from "react"
import RequestCard from "@/src/components/vendor/RequestCard"
import { FilterTabs } from "@/src/components/common/FilterTabs"
import { DetailsDrawer } from "@/src/components/common/DetailsDrawer"
import { useMarketplaceRequests } from "@/src/hooks/orders/useRequest"

export default function VendorMarketplacePage() {

    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [filter, setFilter] = useState("OPEN")
    const [page, setPage] = useState(0)

    const limit = 9
    const offset = page * limit

    const { data, isLoading } = useMarketplaceRequests({
        limit,
        offset,
    })

    const requests = data || []

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                    Marketplace
                </h2>
                <p className="text-gray-500">
                    Browse open requests and submit competitive bids
                </p>
            </div>

            {/* Status Filter */}
            <FilterTabs
                tabs={[
                    { label: "Open Requests", value: "OPEN" },
                    { label: "Expiring Soon", value: "EXPIRING" },
                ]}
                active={filter}
                onChange={(v) => setFilter(v)}
            />

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {isLoading && (
                    <p className="text-gray-500 col-span-full">
                        Loading requests...
                    </p>
                )}

                {!isLoading && requests.length === 0 && (
                    <p className="text-gray-500 col-span-full">
                        No open requests available.
                    </p>
                )}

                {requests.map((r) => (
                    <RequestCard
                        key={r.id}
                        id={r.id}
                        pickupAddress={r.pickup_address}
                        pickupTimeFrom={r.pickup_time_from}
                        pickupTimeTo={r.pickup_time_to}
                        expiresAt={r.expires_at}
                        services={r.services}
                        onView={() => setSelectedId(r.id)}
                        onBid={() => alert("Open Bid Modal")}
                    />
                ))}

            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-2">
                <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
                >
                    Previous
                </button>

                <button className="px-4 py-2 border rounded-lg text-sm bg-orange-500 text-white">
                    {page + 1}
                </button>

                <button
                    disabled={requests.length < limit}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Drawer */}
            <DetailsDrawer
                open={!!selectedId}
                onClose={() => setSelectedId(null)}
                title="Request Details"
            >
                <div className="space-y-3 text-sm">
                    <p>Full request details will render here.</p>
                    <p>Services breakdown.</p>
                    <p>Pickup window.</p>
                    <p>Payment method.</p>
                </div>
            </DetailsDrawer>
        </>
    )
}