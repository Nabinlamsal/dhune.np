"use client";

import { useState } from "react";
import { MessageSquareText, Star } from "lucide-react";
import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { Card } from "@/src/components/ui/card";
import { useVendorRatings } from "@/src/hooks/ratings/useRatings";
import { VendorRatingItem } from "@/src/types/ratings/ratings";
import { formatDisplayId } from "@/src/utils/display";

export default function VendorRatingsPage() {
    const pageSize = 10;
    const [offset, setOffset] = useState(0);

    const { data, isLoading, isError } = useVendorRatings(pageSize, offset);

    const rows = data?.ratings ?? [];
    const summary = data?.summary;

    const columns = [
        {
            key: "order",
            header: "Order",
            render: (row: VendorRatingItem) => formatDisplayId(row.order_id, "ORD"),
        },
        {
            key: "customer",
            header: "Customer",
            render: (row: VendorRatingItem) => row.user_name,
        },
        {
            key: "rating",
            header: "Rating",
            render: (row: VendorRatingItem) => (
                <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: row.rating }).map((_, idx) => (
                        <Star key={idx} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-1 text-xs font-medium text-slate-700">{row.rating}/5</span>
                </div>
            ),
        },
        {
            key: "review",
            header: "Review",
            render: (row: VendorRatingItem) => row.review?.trim() || "-",
        },
        {
            key: "date",
            header: "Created",
            render: (row: VendorRatingItem) => new Date(row.created_at).toLocaleDateString(),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Vendor Ratings & Reviews</h2>
                <p className="text-sm text-slate-500">All feedback received from completed or delivering orders</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Card className="rounded-xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Average Rating</p>
                        <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                    </div>
                    <p className="mt-1 text-lg font-bold text-slate-900">{summary?.average_rating ?? "0.00"} <span className="text-sm text-slate-500">/ 5</span></p>
                </Card>
                <Card className="rounded-xl border border-[#040947]/15 bg-gradient-to-br from-[#040947]/[0.04] to-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#040947]">Total Ratings</p>
                        <MessageSquareText className="h-4 w-4 text-[#040947]" />
                    </div>
                    <p className="mt-1 text-lg font-bold text-slate-900">{summary?.total_ratings ?? 0}</p>
                </Card>
            </div>

            {isLoading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading ratings...</div>
            ) : isError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Failed to load ratings.</div>
            ) : rows.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No ratings available yet.</div>
            ) : (
                <DataTable columns={columns} data={rows} />
            )}

            <div className="flex items-center justify-end gap-2">
                <button
                    onClick={() => setOffset((v) => Math.max(0, v - pageSize))}
                    disabled={offset === 0}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => setOffset((v) => v + pageSize)}
                    disabled={rows.length < pageSize}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
