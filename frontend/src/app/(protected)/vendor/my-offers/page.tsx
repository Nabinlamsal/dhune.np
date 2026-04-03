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
import { Button } from "@/src/components/ui/button";
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
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const { data: offers, isLoading, isError } = useVendorOffers({
        status: filter === "ALL" ? undefined : filter,
        limit: pageSize,
        offset: page * pageSize,
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
    const canGoNext = offerRows.length === pageSize;

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

            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                {[
                    { label: "Total", value: stats?.data.total_offers ?? 0, tone: "from-[#040947] to-[#1a236e]", labelClass: "text-blue-100" },
                    { label: "Pending", value: stats?.data.pending_offers ?? 0, tone: "from-[#ebbc01] to-[#e3a901]", labelClass: "text-[#4f3a00]" },
                    { label: "Accepted", value: stats?.data.accepted_offers ?? 0, tone: "from-[#040947] to-[#213087]", labelClass: "text-blue-100" },
                    { label: "Rejected", value: stats?.data.rejected_offers ?? 0, tone: "from-[#ebbc01] to-[#d89b00]", labelClass: "text-[#4f3a00]" },
                    { label: "Withdrawn", value: stats?.data.withdrawn_offers ?? 0, tone: "from-[#040947] to-[#1f2b7d]", labelClass: "text-blue-100" },
                    { label: "Expired", value: stats?.data.expired_offers ?? 0, tone: "from-[#ebbc01] to-[#c98b00]", labelClass: "text-[#4f3a00]" },
                ].map((item) => (
                    <div
                        key={item.label}
                        className={`relative overflow-hidden rounded-xl border border-[#040947]/15 bg-gradient-to-br ${item.tone} px-3.5 py-3 shadow-sm shadow-[#040947]/10`}
                    >
                        <div className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-white/20 blur-xl" />
                        <p className={`relative text-[11px] font-medium ${item.labelClass}`}>{item.label}</p>
                        <p className="relative mt-1 text-xl font-semibold leading-none text-white">{item.value}</p>
                    </div>
                ))}
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
                onChange={(value) => {
                    setPage(0);
                    setFilter(value as OfferStatus | "ALL");
                }}
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

            <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 0}
                    onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                    className="border-[#040947]/20 text-[#040947] hover:bg-[#040947]/5"
                >
                    Previous
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    disabled={!canGoNext}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="border-[#040947]/20 text-[#040947] hover:bg-[#040947]/5"
                >
                    Next
                </Button>
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
