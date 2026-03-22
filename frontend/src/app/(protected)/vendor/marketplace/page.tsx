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
import { ClipboardList, ShoppingBag } from "lucide-react"
import { formatPickupDuration } from "@/src/utils/display"

export default function VendorMarketplacePage() {

    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [offerRequestId, setOfferRequestId] = useState<string | null>(null)
    const [filter, setFilter] = useState("OPEN")
    const [page, setPage] = useState(0)
    const [nowTs] = useState(() => Date.now())

    const limit = 9
    const offset = page * limit

    const { data, isLoading } = useMarketplaceRequests({
        limit,
        offset,
    })

    const requests = useMemo<MarketplaceRequest[]>(
        () => (Array.isArray(data) ? data : []),
        [data]
    )
    const filteredRequests = useMemo(() => {
        if (filter === "OPEN") return requests
        return requests.filter((request) => {
            const minutes = Math.floor((new Date(request.expires_at).getTime() - nowTs) / (1000 * 60))
            return minutes > 0 && minutes <= 120
        })
    }, [requests, filter, nowTs])

    const selectedRequest = useMemo(
        () => filteredRequests.find(r => r.id === selectedId) ?? requests.find(r => r.id === selectedId),
        [selectedId, filteredRequests, requests]
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
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                {isLoading && (
                    <p className="text-gray-500 col-span-full">
                        Loading requests...
                    </p>
                )}

                {!isLoading && filteredRequests.length === 0 && (
                    <p className="text-gray-500 col-span-full">
                        No requests available for this filter.
                    </p>
                )}

                {filteredRequests.map((r) => (
                    <RequestCard
                        key={r.id}
                        id={r.id}
                        pickupAddress={r.pickup_address}
                        pickupLat={r.pickup_lat}
                        pickupLng={r.pickup_lng}
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
                    disabled={filteredRequests.length < limit}
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
                    <div className="space-y-3 text-sm">
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                                <h4 className="flex items-center gap-2 border-b border-[#040947]/15 pb-2 font-semibold text-slate-900">
                                    <ClipboardList className="size-4 text-[#040947]" />
                                    Request Information
                                </h4>

                                <Detail label="Expires At" value={new Date(selectedRequest.expires_at).toLocaleString()} />
                                <Detail label="Created At" value={new Date(selectedRequest.created_at).toLocaleString()} />
                                <Detail label="Total Quantity" value={`${selectedRequest.total_quantity}`} />
                                <Detail label="Service Count" value={`${selectedRequest.service_count}`} />
                            </div>

                            <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                                <h4 className="flex items-center gap-2 border-b border-[#040947]/15 pb-2 font-semibold text-slate-900">
                                    <ClipboardList className="size-4 text-[#040947]" />
                                    Pickup Details
                                </h4>
                                <Detail label="Pickup Address" value={selectedRequest.pickup_address} />
                                <Detail label="Pickup Latitude" value={String(selectedRequest.pickup_lat)} />
                                <Detail label="Pickup Longitude" value={String(selectedRequest.pickup_lng)} />
                                <Detail
                                    label="Pickup Duration"
                                    value={formatPickupDuration(
                                        selectedRequest.pickup_time_from,
                                        selectedRequest.pickup_time_to
                                    )}
                                />
                            </div>
                        </div>

                        {/* Services */}
                        <div className="rounded-xl border border-[#040947]/15 bg-white p-3">
                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-slate-900">
                                <ShoppingBag className="size-4 text-[#040947]" />
                                Requested Services
                            </h4>

                            <div className="space-y-2">
                                {selectedRequest.services.map((s, i) => (
                                    <div key={i} className="rounded-md border border-[#040947]/15 p-2.5">
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
                        <div className="pt-3 flex justify-end">
                            <Button
                                className="bg-[#040947] hover:bg-[#030736] text-white"
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

