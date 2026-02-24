"use client"

import { useState, useMemo } from "react"
import RequestCard from "@/src/components/vendor/RequestCard"
import { FilterTabs } from "@/src/components/common/FilterTabs"
import { DetailsDrawer } from "@/src/components/common/DetailsDrawer"
import { Button } from "@/src/components/ui/button"
import { useMarketplaceRequests } from "@/src/hooks/orders/useRequest"
import { MarketplaceRequest } from "@/src/types/orders/requests"
import VendorSendOfferModal from "@/src/components/vendor/VendorSendOfferModal"
import { Detail } from "@/src/components/common/DetailItem"

export default function VendorMarketplacePage() {

    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [offerRequestId, setOfferRequestId] = useState<string | null>(null)
    const [filter, setFilter] = useState("OPEN")
    const [page, setPage] = useState(0)

    const limit = 9
    const offset = page * limit

    const { data, isLoading } = useMarketplaceRequests({
        limit,
        offset,
    })

    const requests: MarketplaceRequest[] = data || []

    const selectedRequest = useMemo(
        () => requests.find(r => r.id === selectedId),
        [selectedId, requests]
    )

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

            {/* Filter */}
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
                        onBid={() => setOfferRequestId(r.id)} //direct open
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

            {/* Details Drawer */}
            <DetailsDrawer
                open={!!selectedRequest}
                onClose={() => setSelectedId(null)}
                title="Request Details"
            >
                {selectedRequest && (
                    <div className="space-y-6 text-sm">

                        <Detail
                            label="Pickup Address"
                            value={selectedRequest.pickup_address}
                        />

                        <Detail
                            label="Pickup Window"
                            value={`${new Date(
                                selectedRequest.pickup_time_from
                            ).toLocaleString()} - ${new Date(
                                selectedRequest.pickup_time_to
                            ).toLocaleString()}`}
                        />

                        <Detail
                            label="Expires At"
                            value={new Date(
                                selectedRequest.expires_at
                            ).toLocaleString()}
                        />

                        <Detail
                            label="Created At"
                            value={new Date(
                                selectedRequest.created_at
                            ).toLocaleString()}
                        />

                        <Detail
                            label="Total Quantity"
                            value={`${selectedRequest.total_quantity}`}
                        />

                        <Detail
                            label="Service Count"
                            value={`${selectedRequest.service_count}`}
                        />

                        {/* Services */}
                        <div className="pt-4">
                            <h4 className="font-semibold mb-2">
                                Requested Services
                            </h4>

                            <div className="space-y-2">
                                {selectedRequest.services.map((s, i) => (
                                    <div key={i} className="border rounded-md p-3">
                                        <Detail
                                            label="Category"
                                            value={s.category_name}
                                        />
                                        <Detail
                                            label="Quantity"
                                            value={`${s.quantity_value} ${s.selected_unit}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action */}
                        <div className="pt-6 flex justify-end">
                            <Button
                                onClick={() => {
                                    setOfferRequestId(selectedRequest.id)
                                }}
                            >
                                Send Offer
                            </Button>
                        </div>

                    </div>
                )}
            </DetailsDrawer>

            {/* Offer Modal */}
            <VendorSendOfferModal
                requestId={offerRequestId}
                open={!!offerRequestId}
                onClose={() => setOfferRequestId(null)}
            />
        </>
    )
}