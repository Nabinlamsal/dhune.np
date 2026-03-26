"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { DetailsDrawer } from "@/src/components/common/DetailsDrawer";
import { Card } from "@/src/components/ui/card";
import { useAdminTopRatedVendors, useAdminVendorReviews } from "@/src/hooks/ratings/useRatings";
import { TopRatedVendor, VendorRatingItem } from "@/src/types/ratings/ratings";
import { formatDisplayId } from "@/src/utils/display";

export default function AdminRatingsPage() {
    const pageSize = 10;
    const [offset, setOffset] = useState(0);
    const [selectedVendor, setSelectedVendor] = useState<TopRatedVendor | null>(null);

    const { data: topRated, isLoading, isError } = useAdminTopRatedVendors(pageSize, offset);
    const { data: vendorReviews, isLoading: loadingReviews } = useAdminVendorReviews(selectedVendor?.vendor_id, 20, 0);

    const columns = [
        {
            key: "vendor",
            header: "Vendor",
            render: (row: TopRatedVendor) => row.vendor_name,
        },
        {
            key: "avg",
            header: "Average Rating",
            render: (row: TopRatedVendor) => (
                <span className="font-semibold text-amber-700">{row.average_rating}/5</span>
            ),
        },
        {
            key: "count",
            header: "Total Ratings",
            render: (row: TopRatedVendor) => row.total_ratings,
        },
        {
            key: "vendor_id",
            header: "Vendor ID",
            render: (row: TopRatedVendor) => formatDisplayId(row.vendor_id, "VND"),
        },
    ];

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Vendor Ratings</h2>
                    <p className="text-sm text-slate-500">Top rated vendors and review inspection</p>
                </div>

                {isLoading ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading ratings...</div>
                ) : isError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Failed to load top rated vendors.</div>
                ) : !topRated || topRated.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No ratings data available yet.</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={topRated}
                        onRowClick={(row: TopRatedVendor) => setSelectedVendor(row)}
                    />
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
                        disabled={!topRated || topRated.length < pageSize}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            <DetailsDrawer
                open={!!selectedVendor}
                onClose={() => setSelectedVendor(null)}
                title={selectedVendor ? `${selectedVendor.vendor_name} Reviews` : "Vendor Reviews"}
            >
                {loadingReviews ? (
                    <p className="text-sm text-slate-500">Loading reviews...</p>
                ) : (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Card className="rounded-xl border border-slate-200 p-3 shadow-none">
                                <p className="text-xs text-slate-500">Average Rating</p>
                                <p className="mt-1 text-lg font-bold text-slate-900">
                                    {vendorReviews?.summary?.average_rating ?? "0.00"} / 5
                                </p>
                            </Card>
                            <Card className="rounded-xl border border-slate-200 p-3 shadow-none">
                                <p className="text-xs text-slate-500">Total Ratings</p>
                                <p className="mt-1 text-lg font-bold text-slate-900">
                                    {vendorReviews?.summary?.total_ratings ?? 0}
                                </p>
                            </Card>
                        </div>

                        <div className="space-y-2">
                            {(vendorReviews?.ratings ?? []).map((item: VendorRatingItem) => (
                                <div key={item.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-slate-900">{item.user_name}</p>
                                        <p className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="mt-1 flex items-center gap-1 text-amber-500">
                                        {Array.from({ length: item.rating }).map((_, idx) => (
                                            <Star key={idx} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        ))}
                                        <span className="ml-1 text-xs font-medium text-slate-700">{item.rating}/5</span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-600">{item.review?.trim() || "No review text."}</p>
                                    <p className="mt-1 text-[11px] text-slate-400">Order {formatDisplayId(item.order_id, "ORD")}</p>
                                </div>
                            ))}
                            {(vendorReviews?.ratings ?? []).length === 0 ? (
                                <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-500">
                                    No reviews for this vendor yet.
                                </p>
                            ) : null}
                        </div>
                    </div>
                )}
            </DetailsDrawer>
        </>
    );
}
