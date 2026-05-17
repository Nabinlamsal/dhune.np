"use client";

import { useState } from "react";
import { Banknote, CreditCard, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { useAdminFinanceDashboard, useVerifySettlement } from "@/src/hooks/queries/useFinance";
import { Commission, VendorSettlement } from "@/src/types/finance/finance";
import { formatDisplayId } from "@/src/utils/display";

export default function AdminFinancePage() {
    const { data, isLoading } = useAdminFinanceDashboard();
    const verifySettlement = useVerifySettlement();

    // Default stats if data is not loaded yet
    const stats = data?.stats ?? {
        totalCommission: "0.00",
        pendingSettlements: "0.00",
        completedSettlements: "0.00"
    };

    const commissions = data?.recentCommissions ?? [];
    const settlements = data?.recentSettlements ?? [];

    const handleVerifySettlement = async (id: string) => {
        if (confirm("Are you sure you want to verify this settlement? This action cannot be undone.")) {
            await verifySettlement.mutateAsync(id);
        }
    };

    const commissionColumns = [
        {
            key: "id",
            header: "Commission ID",
            render: (c: Commission) => (
                <div className="font-medium text-slate-900">{formatDisplayId(c.id, "COM")}</div>
            ),
        },
        {
            key: "order",
            header: "Order / Vendor",
            render: (c: Commission) => (
                <div>
                    <div className="text-sm font-medium text-slate-800">{formatDisplayId(c.orderId, "ORD")}</div>
                    <div className="text-[11px] text-slate-500">{formatDisplayId(c.vendorId, "VND")}</div>
                </div>
            ),
        },
        {
            key: "amount",
            header: "Order Amount",
            render: (c: Commission) => (
                <div className="text-sm text-slate-600">Rs. {Number(c.orderAmount).toFixed(2)}</div>
            ),
        },
        {
            key: "commission",
            header: "Platform Cut",
            render: (c: Commission) => (
                <div>
                    <div className="text-sm font-bold text-emerald-700">Rs. {Number(c.amount).toFixed(2)}</div>
                    <div className="text-[11px] text-emerald-600/80">{c.percentage}%</div>
                </div>
            ),
        },
        {
            key: "date",
            header: "Date",
            render: (c: Commission) => (
                <div className="text-sm text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</div>
            ),
        },
    ];

    const settlementColumns = [
        {
            key: "id",
            header: "Settlement Ref",
            render: (s: VendorSettlement) => (
                <div className="font-medium text-slate-900">{formatDisplayId(s.id, "STL")}</div>
            ),
        },
        {
            key: "vendor",
            header: "Vendor ID",
            render: (s: VendorSettlement) => (
                <div className="text-sm text-slate-600">{formatDisplayId(s.vendorId, "VND")}</div>
            ),
        },
        {
            key: "amount",
            header: "Amount",
            render: (s: VendorSettlement) => (
                <div className="text-sm font-bold text-slate-800">Rs. {Number(s.amount).toFixed(2)}</div>
            ),
        },
        {
            key: "method",
            header: "Payment Method",
            render: (s: VendorSettlement) => (
                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    {s.paymentMethod}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (s: VendorSettlement) =>
                s.status === "COMPLETED" ? (
                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        {s.status}
                    </span>
                ) : s.status === "PENDING" ? (
                    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                        {s.status}
                    </span>
                ) : (
                    <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-100">
                        {s.status}
                    </span>
                ),
        },
        {
            key: "actions",
            header: "Actions",
            render: (s: VendorSettlement) => (
                <div className="flex flex-wrap gap-2">
                    {s.status === "PENDING" && (
                        <Button
                            size="sm"
                            variant="default"
                            className="bg-[#040947] text-white hover:bg-[#030736]"
                            onClick={() => handleVerifySettlement(s.id)}
                            disabled={verifySettlement.isPending}
                        >
                            Verify
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    if (isLoading) {
        return <p className="text-gray-500">Loading finance dashboard...</p>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Platform Finances
                </h2>
                <p className="text-sm text-gray-500">Revenue, commissions, and vendor settlement oversight</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="p-5 flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute right-[-10%] top-[-10%] opacity-5 text-emerald-600">
                        <TrendingUp className="w-32 h-32" />
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Total Commissions</p>
                        <h3 className="mt-2 text-3xl font-bold text-emerald-700">
                            Rs. {Number(stats.totalCommission).toLocaleString()}
                        </h3>
                    </div>
                    <p className="mt-4 text-xs text-emerald-600/80 font-medium">Platform revenue from completed orders</p>
                </Card>

                <Card className="p-5 flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute right-[-10%] top-[-10%] opacity-5 text-amber-600">
                        <Wallet className="w-32 h-32" />
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Pending Settlements</p>
                        <h3 className="mt-2 text-3xl font-bold text-amber-600">
                            Rs. {Number(stats.pendingSettlements).toLocaleString()}
                        </h3>
                    </div>
                    <p className="mt-4 text-xs text-amber-600/80 font-medium">Awaiting admin verification</p>
                </Card>

                <Card className="p-5 flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute right-[-10%] top-[-10%] opacity-5 text-blue-600">
                        <CreditCard className="w-32 h-32" />
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Paid Settlements</p>
                        <h3 className="mt-2 text-3xl font-bold text-blue-600">
                            Rs. {Number(stats.completedSettlements).toLocaleString()}
                        </h3>
                    </div>
                    <p className="mt-4 text-xs text-blue-600/80 font-medium">Total funds disbursed to vendors</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="overflow-hidden rounded-[28px] border border-[#d8d0bf] bg-white shadow-[0_18px_40px_rgba(54,42,20,0.06)]">
                    <div className="border-b border-[#ece5d6] px-6 py-4">
                        <h3 className="text-lg font-semibold text-[#2f2618]">Recent Settlements</h3>
                        <p className="text-sm text-[#7a6f5e]">Vendor payout requests</p>
                    </div>
                    <div className="p-6">
                        {settlements.length === 0 ? (
                            <p className="text-sm text-[#7a6f5e]">No recent settlements.</p>
                        ) : (
                            <DataTable columns={settlementColumns} data={settlements} />
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-[#d8d0bf] bg-white shadow-[0_18px_40px_rgba(54,42,20,0.06)]">
                    <div className="border-b border-[#ece5d6] px-6 py-4">
                        <h3 className="text-lg font-semibold text-[#2f2618]">Recent Commissions</h3>
                        <p className="text-sm text-[#7a6f5e]">Revenue snapshot from recent completed orders</p>
                    </div>
                    <div className="p-6">
                        {commissions.length === 0 ? (
                            <p className="text-sm text-[#7a6f5e]">No recent commissions.</p>
                        ) : (
                            <DataTable columns={commissionColumns} data={commissions} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
