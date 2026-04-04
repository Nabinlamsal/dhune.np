"use client";

import { useState } from "react";
import { AlertCircle, ClipboardList } from "lucide-react";
import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { StatusBadge, Status } from "@/src/components/common/StatusBadge";
import { useMyDisputes } from "@/src/hooks/disputes/useDisputes";
import { DisputeSummary } from "@/src/types/disputes/disputes";
import { formatDisplayId } from "@/src/utils/display";

function mapDisputeStatus(status: string): Status {
    switch (status) {
        case "OPEN":
        case "UNDER_REVIEW":
            return "warning";
        case "RESOLVED":
            return "success";
        case "REJECTED":
            return "error";
        default:
            return "neutral";
    }
}

export default function VendorDisputesPage() {
    const pageSize = 10;
    const [offset, setOffset] = useState(0);

    const { data: myDisputes, isLoading, isError } = useMyDisputes(pageSize, offset);

    const disputes = myDisputes ?? [];

    const columns = [
        {
            key: "order_id",
            header: "Order",
            render: (row: DisputeSummary) => formatDisplayId(row.order_id, "ORD"),
        },
        {
            key: "type",
            header: "Type",
            render: (row: DisputeSummary) => row.dispute_type,
        },
        {
            key: "status",
            header: "Status",
            render: (row: DisputeSummary) => (
                <StatusBadge status={mapDisputeStatus(row.status)} label={row.status} />
            ),
        },
        {
            key: "adjustment",
            header: "Adjustment",
            render: (row: DisputeSummary) =>
                row.adjustment_amount !== undefined ? `Rs. ${row.adjustment_amount}` : "-",
        },
        {
            key: "created_at",
            header: "Created",
            render: (row: DisputeSummary) => new Date(row.created_at).toLocaleDateString(),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Vendor Disputes</h2>
                <p className="text-sm text-slate-500">Track all disputes raised from your vendor orders.</p>
            </div>

            <div className="rounded-2xl border border-[#040947]/15 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <span className="rounded-xl bg-amber-100 p-2 text-amber-700">
                        <ClipboardList className="size-4" />
                    </span>
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">My Disputes</h3>
                        <p className="text-xs text-slate-500">Admin decisions and adjustment history for your reports.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Loading disputes...</div>
                ) : isError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Failed to load disputes.</div>
                ) : disputes.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                        No disputes submitted yet.
                    </div>
                ) : (
                    <DataTable columns={columns} data={disputes} />
                )}

                {disputes.length > 0 && (
                    <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                            onClick={() => setOffset((v) => Math.max(0, v - pageSize))}
                            disabled={offset === 0}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setOffset((v) => v + pageSize)}
                            disabled={disputes.length < pageSize}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <div className="rounded-xl border border-[#040947]/10 bg-[#040947]/[0.04] px-4 py-3 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 size-4 text-[#040947]" />
                    <p>To create a dispute, open an active order from the vendor orders page and use the Report Dispute action.</p>
                </div>
            </div>
        </div>
    );
}
