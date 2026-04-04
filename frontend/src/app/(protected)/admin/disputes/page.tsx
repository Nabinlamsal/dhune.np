"use client";

import { useState } from "react";
import { ClipboardList, FileText, Scale, ShieldCheck, UserRound } from "lucide-react";
import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { DetailsDrawer } from "@/src/components/common/DetailsDrawer";
import { FilterTabs } from "@/src/components/common/FilterTabs";
import { Detail } from "@/src/components/common/DetailItem";
import { StatusBadge, Status } from "@/src/components/common/StatusBadge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { useAdminDisputeDetail, useAdminDisputes, useResolveDispute } from "@/src/hooks/disputes/useDisputes";
import {
    DisputeAdminSummary,
    DisputeDecision,
    DisputeDetail,
    DisputeStatus,
} from "@/src/types/disputes/disputes";
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

export default function AdminDisputesPage() {
    const pageSize = 10;
    const [filter, setFilter] = useState<DisputeStatus | "ALL">("ALL");
    const [offset, setOffset] = useState(0);
    const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
    const [decision, setDecision] = useState<DisputeDecision>("REJECT");
    const [adminNote, setAdminNote] = useState("");
    const [adjustmentAmount, setAdjustmentAmount] = useState("");

    const { data, isLoading, isError } = useAdminDisputes(
        filter === "ALL" ? undefined : filter,
        pageSize,
        offset
    );
    const { data: detail, isLoading: loadingDetail } = useAdminDisputeDetail(selectedDisputeId ?? undefined);
    const { mutate: resolveDispute, isPending } = useResolveDispute();

    const disputes = data ?? [];
    const selectedDispute = detail as DisputeDetail | undefined;

    const columns = [
        {
            key: "id",
            header: "Dispute ID",
            render: (row: DisputeAdminSummary) => formatDisplayId(row.id, "DSP"),
        },
        {
            key: "order_id",
            header: "Order",
            render: (row: DisputeAdminSummary) => formatDisplayId(row.order_id, "ORD"),
        },
        {
            key: "raised_by",
            header: "Raised By",
            render: (row: DisputeAdminSummary) => row.raised_by,
        },
        {
            key: "type",
            header: "Type",
            render: (row: DisputeAdminSummary) => row.dispute_type,
        },
        {
            key: "status",
            header: "Status",
            render: (row: DisputeAdminSummary) => (
                <StatusBadge status={mapDisputeStatus(row.status)} label={row.status} />
            ),
        },
        {
            key: "created_at",
            header: "Created",
            render: (row: DisputeAdminSummary) => new Date(row.created_at).toLocaleDateString(),
        },
    ];

    const resetResolveForm = () => {
        setDecision("REJECT");
        setAdminNote("");
        setAdjustmentAmount("");
    };

    const handleResolve = () => {
        if (!selectedDisputeId) {
            return;
        }

        resolveDispute({
            id: selectedDisputeId,
            payload: {
                decision,
                admin_note: adminNote.trim() || undefined,
                adjustment_amount:
                    adjustmentAmount.trim() !== "" ? Number(adjustmentAmount) : undefined,
            },
        });
    };

    const summaryCards = {
        total: disputes.length,
        open: disputes.filter((item) => item.status === "OPEN").length,
        resolved: disputes.filter((item) => item.status === "RESOLVED").length,
        rejected: disputes.filter((item) => item.status === "REJECTED").length,
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Disputes Management</h2>
                    <p className="text-sm text-slate-500">Review disputes and record manual admin decisions.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                        { label: "Total", value: summaryCards.total, tone: "bg-[#040947] text-white" },
                        { label: "Open", value: summaryCards.open, tone: "bg-[#ebbc01] text-[#1f1700]" },
                        { label: "Resolved", value: summaryCards.resolved, tone: "bg-emerald-600 text-white" },
                        { label: "Rejected", value: summaryCards.rejected, tone: "bg-red-600 text-white" },
                    ].map((item) => (
                        <div key={item.label} className={`rounded-xl border border-slate-200 px-4 py-3 shadow-sm ${item.tone}`}>
                            <p className="text-[11px] font-semibold uppercase tracking-wide opacity-90">{item.label}</p>
                            <p className="mt-2 text-2xl font-bold">{item.value}</p>
                        </div>
                    ))}
                </div>

                <FilterTabs
                    tabs={[
                        { label: "All", value: "ALL" },
                        { label: "Open", value: "OPEN" },
                        { label: "Under Review", value: "UNDER_REVIEW" },
                        { label: "Resolved", value: "RESOLVED" },
                        { label: "Rejected", value: "REJECTED" },
                    ]}
                    active={filter}
                    onChange={(value) => {
                        setOffset(0);
                        setFilter(value as DisputeStatus | "ALL");
                    }}
                />

                {isLoading ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading disputes...</div>
                ) : isError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Failed to load disputes.</div>
                ) : disputes.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No disputes found.</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={disputes}
                        onRowClick={(row: DisputeAdminSummary) => {
                            resetResolveForm();
                            setSelectedDisputeId(row.id);
                        }}
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
                        disabled={disputes.length < pageSize}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            <DetailsDrawer
                open={!!selectedDisputeId}
                onClose={() => {
                    setSelectedDisputeId(null);
                    resetResolveForm();
                }}
                title="Dispute Details"
            >
                {loadingDetail ? (
                    <p className="text-sm text-slate-500">Loading dispute details...</p>
                ) : selectedDispute ? (
                    <div className="space-y-4 text-sm">
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                                <h4 className="flex items-center gap-2 border-b border-[#040947]/15 pb-2 font-semibold text-slate-900">
                                    <ClipboardList className="size-4 text-[#040947]" />
                                    Dispute Information
                                </h4>
                                <Detail label="Dispute ID" value={formatDisplayId(selectedDispute.id, "DSP")} />
                                <Detail label="Order ID" value={formatDisplayId(selectedDispute.order_id, "ORD")} />
                                <Detail label="Raised By" value={selectedDispute.raised_by} />
                                <Detail label="Type" value={selectedDispute.dispute_type} />
                                <Detail label="Status" value={selectedDispute.status} />
                                <Detail label="Created At" value={new Date(selectedDispute.created_at).toLocaleString()} />
                            </div>

                            <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                                <h4 className="flex items-center gap-2 border-b border-[#040947]/15 pb-2 font-semibold text-slate-900">
                                    <Scale className="size-4 text-[#040947]" />
                                    Order Context
                                </h4>
                                <Detail label="Order Status" value={selectedDispute.order.order_status} />
                                <Detail label="Payment Status" value={selectedDispute.order.payment_status} />
                                <Detail label="Final Price" value={`Rs. ${selectedDispute.order.final_price}`} />
                                <Detail label="Request ID" value={formatDisplayId(selectedDispute.order.request_id, "REQ")} />
                                <Detail label="Offer ID" value={formatDisplayId(selectedDispute.order.offer_id, "OFF")} />
                            </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                                <h4 className="flex items-center gap-2 border-b border-[#040947]/15 pb-2 font-semibold text-slate-900">
                                    <UserRound className="size-4 text-[#040947]" />
                                    User
                                </h4>
                                <Detail label="Name" value={selectedDispute.user.name} />
                                <Detail label="Email" value={selectedDispute.user.email} />
                                <Detail label="Phone" value={selectedDispute.user.phone} />
                            </div>

                            <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                                <h4 className="flex items-center gap-2 border-b border-[#040947]/15 pb-2 font-semibold text-slate-900">
                                    <ShieldCheck className="size-4 text-[#040947]" />
                                    Vendor
                                </h4>
                                <Detail label="Name" value={selectedDispute.vendor.name} />
                                <Detail label="Email" value={selectedDispute.vendor.email} />
                                <Detail label="Phone" value={selectedDispute.vendor.phone} />
                            </div>
                        </div>

                        <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                            <h4 className="flex items-center gap-2 border-b border-[#040947]/15 pb-2 font-semibold text-slate-900">
                                <FileText className="size-4 text-[#040947]" />
                                Description
                            </h4>
                            <p className="text-slate-700">{selectedDispute.description}</p>
                            {selectedDispute.image_url ? (
                                <a
                                    href={selectedDispute.image_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex text-xs font-medium text-[#040947] underline"
                                >
                                    Open proof image
                                </a>
                            ) : (
                                <p className="text-xs text-slate-400">No proof image attached.</p>
                            )}
                        </div>

                        <div className="space-y-4 rounded-xl border border-[#040947]/15 bg-white p-4">
                            <h4 className="font-semibold text-slate-900">Resolve Dispute</h4>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Decision</label>
                                    <Select
                                        value={decision}
                                        onValueChange={(value: DisputeDecision) => setDecision(value)}
                                    >
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select decision" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="APPROVE_USER">Approve User</SelectItem>
                                            <SelectItem value="APPROVE_VENDOR">Approve Vendor</SelectItem>
                                            <SelectItem value="REJECT">Reject</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Adjustment Amount</label>
                                    <Input
                                        type="number"
                                        value={adjustmentAmount}
                                        onChange={(e) => setAdjustmentAmount(e.target.value)}
                                        placeholder="Optional amount"
                                        className="bg-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Admin Note</label>
                                <Textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Add resolution notes..."
                                    className="min-h-24 bg-white"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    disabled={isPending}
                                    onClick={handleResolve}
                                    className="bg-[#040947] text-white hover:bg-[#030736]"
                                >
                                    {isPending ? "Saving..." : "Save Decision"}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </DetailsDrawer>
        </>
    );
}
