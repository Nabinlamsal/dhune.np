"use client"

import { useState } from "react"
import RequestCard from "@/src/components/vendor/RequestCard"
import { FilterTabs } from "@/src/components/common/FilterTabs"
import { DetailsDrawer } from "@/src/components/common/DetailsDrawer"

export default function VendorMarketplacePage() {

    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [filter, setFilter] = useState("OPEN")

    // Temporary mock data
    const mockRequests = [
        {
            id: "abc123456789",
            categorySummary: "Laundry + Ironing",
            quantitySummary: "12 kg total",
            pickupAddress: "Kathmandu, Nepal",
            completionTime: new Date().toISOString(),
            expiresInMinutes: 25,
        },
        {
            id: "def987654321",
            categorySummary: "Dry Cleaning",
            quantitySummary: "8 items",
            pickupAddress: "Lalitpur, Nepal",
            completionTime: new Date().toISOString(),
            expiresInMinutes: 90,
        },
    ]

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

                {mockRequests.map((r) => (
                    <RequestCard
                        key={r.id}
                        {...r}
                        onView={() => setSelectedId(r.id)}
                        onBid={() => alert("Open Bid Modal")}
                    />
                ))}

            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center mt-10 gap-2">
                <button className="px-4 py-2 border rounded-lg text-sm">
                    Previous
                </button>
                <button className="px-4 py-2 border rounded-lg text-sm bg-orange-500 text-white">
                    1
                </button>
                <button className="px-4 py-2 border rounded-lg text-sm">
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