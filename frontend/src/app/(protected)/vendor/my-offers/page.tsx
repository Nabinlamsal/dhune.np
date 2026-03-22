"use client";

import { useState } from "react";
import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { DetailsDrawer } from "@/src/components/common/DetailsDrawer";
import { FilterTabs } from "@/src/components/common/FilterTabs";
import { StatusBadge } from "@/src/components/common/StatusBadge";
import { Detail } from "@/src/components/common/DetailItem";
import { useVendorOffers, useVendorOfferStats, useUpdateOffer, useWithdrawOffer } from "@/src/hooks/orders/useOffer";
import { Offer } from "@/src/types/orders/offers";
import { OfferStatus } from "@/src/types/orders/orders-enums";
import EditOfferModal from "@/src/components/vendor/EditOfferModel";
import { ClipboardList, FileText, ShieldCheck } from "lucide-react";
import { formatDisplayId } from "@/src/utils/display";

function mapOfferStatusToBadge(status: OfferStatus) {
    switch (status) {
        case "PENDING":
            return "pending";
        case "ACCEPTED":
            return "approved";
        case "REJECTED":
            return "rejected";
        case "WITHDRAWN":
        case "EXPIRED":
            return "disabled";
        default:
            return "neutral";
    }
}

export default function VendorOffersPage() {
    const [filter, setFilter] = useState<OfferStatus | "ALL">("ALL");
    const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);

    const { data: offers, isLoading, isError } = useVendorOffers({
        status: filter === "ALL" ? undefined : filter,
    });

    const { data: stats } = useVendorOfferStats();
    const { mutate: updateOffer } = useUpdateOffer();
    const { mutate: withdrawOffer } = useWithdrawOffer();

    const offerRows = Array.isArray(offers)
        ? offers
        : Array.isArray((offers as { data?: unknown[] } | undefined)?.data)
            ? ((offers as { data?: Offer[] }).data ?? [])
            : [];

    const selectedOffer = offerRows.find((offer) => offer.id === selectedOfferId);

    const columns = [
        {
            key: "request_id",
            header: "Request",
            render: (offer: Offer) => formatDisplayId(offer.request_id, "REQ"),
        },
        {
            key: "bid_price",
            header: "Bid",
            render: (offer: Offer) => `Rs. ${offer.bid_price}`,
        },
        {
            key: "completion_time",
            header: "Completion",
            render: (offer: Offer) => new Date(offer.completion_time).toLocaleDateString(),
        },
        {
            key: "status",
            header: "Status",
            render: (offer: Offer) => (
                <StatusBadge status={mapOfferStatusToBadge(offer.status)} label={offer.status} />
            ),
        },
    ];

    return (
        <>
            <h2 className="mb-5 text-2xl font-bold">My Offers</h2>

            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-center">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-lg font-semibold text-gray-900">{stats?.data.total_offers ?? 0}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-center">
                    <p className="text-xs text-gray-500">Pending</p>
                    <p className="text-lg font-semibold text-gray-900">{stats?.data.pending_offers ?? 0}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-center">
                    <p className="text-xs text-gray-500">Accepted</p>
                    <p className="text-lg font-semibold text-gray-900">{stats?.data.accepted_offers ?? 0}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-center">
                    <p className="text-xs text-gray-500">Rejected</p>
                    <p className="text-lg font-semibold text-gray-900">{stats?.data.rejected_offers ?? 0}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-center">
                    <p className="text-xs text-gray-500">Withdrawn</p>
                    <p className="text-lg font-semibold text-gray-900">{stats?.data.withdrawn_offers ?? 0}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-center">
                    <p className="text-xs text-gray-500">Expired</p>
                    <p className="text-lg font-semibold text-gray-900">{stats?.data.expired_offers ?? 0}</p>
                </div>
            </div>

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
                onChange={(value) => setFilter(value as OfferStatus | "ALL")}
            />

            <div className="mt-4">
                {isLoading ? (
                    <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-500">
                        Loading offers...
                    </div>
                ) : isError ? (
                    <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-red-500">
                        Failed to load offers.
                    </div>
                ) : offerRows.length === 0 ? (
                    <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-500">
                        No offers found for this filter.
                    </div>
                ) : (
                    <DataTable columns={columns} data={offerRows} onRowClick={(offer: Offer) => setSelectedOfferId(offer.id)} />
                )}
            </div>

            <DetailsDrawer open={!!selectedOfferId} onClose={() => setSelectedOfferId(null)} title="Offer Details">
                {selectedOffer && (
                    <div className="space-y-3 text-sm">
                        <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                            <h4 className="flex items-center gap-2 border-b border-[#040947]/15 pb-2 font-semibold text-slate-900">
                                <ClipboardList className="size-4 text-[#040947]" />
                                Offer Information
                            </h4>
                            <Detail label="Offer ID" value={selectedOffer.id} />
                            <Detail label="Request ID" value={selectedOffer.request_id} />
                            <Detail label="Bid Amount" value={`Rs. ${selectedOffer.bid_price}`} />
                            <Detail label="Completion Time" value={new Date(selectedOffer.completion_time).toLocaleString()} />
                            <Detail
                                label="Created At"
                                value={selectedOffer.created_at ? new Date(selectedOffer.created_at).toLocaleString() : "-"}
                            />
                        </div>

                        <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                            <h4 className="flex items-center gap-2 font-semibold text-slate-900">
                                <ShieldCheck className="size-4 text-[#040947]" />
                                Status
                            </h4>
                            <StatusBadge status={mapOfferStatusToBadge(selectedOffer.status)} label={selectedOffer.status} />
                        </div>

                        {selectedOffer.description && (
                            <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                                <h4 className="flex items-center gap-2 font-semibold text-slate-900">
                                    <FileText className="size-4 text-[#040947]" />
                                    Description
                                </h4>
                                <p className="leading-relaxed text-gray-600">{selectedOffer.description}</p>
                            </div>
                        )}

                        {selectedOffer.status === "PENDING" && (
                            <div className="flex gap-3 border-t pt-6">
                                <button
                                    onClick={() => setEditOpen(true)}
                                    className="rounded-lg bg-[#040947] px-4 py-2 text-sm text-white transition hover:bg-[#030736]"
                                >
                                    Update Offer
                                </button>
                                <button
                                    onClick={() => withdrawOffer(selectedOffer.id)}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
                                >
                                    Withdraw Offer
                                </button>
                            </div>
                        )}

                        {selectedOffer.status === "ACCEPTED" && (
                            <div className="border-t pt-6 font-medium text-green-600">
                                This offer has been accepted and converted into an order.
                            </div>
                        )}
                    </div>
                )}
            </DetailsDrawer>

            <EditOfferModal
                open={editOpen}
                offer={selectedOffer ?? null}
                onClose={() => setEditOpen(false)}
                onSubmit={(data) => {
                    if (!selectedOffer) return;
                    updateOffer({
                        id: selectedOffer.id,
                        payload: data,
                    });
                    setEditOpen(false);
                }}
            />
        </>
    );
}
