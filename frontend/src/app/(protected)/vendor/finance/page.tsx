"use client";

import { useVendorFinanceDashboard } from "@/src/hooks/queries/useFinance";
import { Card } from "@/src/components/ui/card";
import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { Commission, VendorSettlement } from "@/src/types/finance/finance";
import { formatDisplayId } from "@/src/utils/display";
import { SectionCard } from "@/src/components/vendor/dashboard/SectionCard";
import { BadgeDollarSign, Wallet, ArrowDownUp } from "lucide-react";

export default function VendorFinancePage() {
    const { data, isLoading } = useVendorFinanceDashboard();

    const stats = data?.stats ?? {
        totalEarnings: "0.00",
        pendingSettlementAmount: "0.00",
        lastSettlementAmount: "0.00"
    };

    const commissions = data?.recentCommissions ?? [];
    const settlements = data?.recentSettlements ?? [];

    const settlementColumns = [
        {
            key: "id",
            header: "Ref ID",
            render: (s: VendorSettlement) => (
                <div className="font-medium text-slate-900">{formatDisplayId(s.id, "STL")}</div>
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
            key: "date",
            header: "Date",
            render: (s: VendorSettlement) => (
                <div className="text-sm text-slate-500">{new Date(s.createdAt).toLocaleDateString()}</div>
            ),
        },
    ];

    const commissionColumns = [
        {
            key: "order",
            header: "Order",
            render: (c: Commission) => (
                <div className="text-sm font-medium text-slate-800">{formatDisplayId(c.orderId, "ORD")}</div>
            ),
        },
        {
            key: "amount",
            header: "Total Value",
            render: (c: Commission) => (
                <div className="text-sm text-slate-600">Rs. {Number(c.orderAmount).toFixed(2)}</div>
            ),
        },
        {
            key: "commission",
            header: "Platform Cut",
            render: (c: Commission) => (
                <div>
                    <div className="text-sm font-bold text-rose-600">- Rs. {Number(c.amount).toFixed(2)}</div>
                    <div className="text-[11px] text-rose-500/80">{c.percentage}% fee</div>
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

    const performanceCards = [
        {
            label: "Total Earnings",
            value: `Rs. ${Number(stats.totalEarnings).toLocaleString()}`,
            hint: "Net earnings after platform fees",
            tone: "from-emerald-500/20 to-emerald-100/20 border-emerald-200/70",
            icon: <BadgeDollarSign className="w-10 h-10 text-emerald-600/20 absolute right-[-10%] top-[-10%]" />
        },
        {
            label: "Pending Settlement",
            value: `Rs. ${Number(stats.pendingSettlementAmount).toLocaleString()}`,
            hint: "Awaiting disbursement",
            tone: "from-amber-500/20 to-amber-100/20 border-amber-200/70",
            icon: <Wallet className="w-10 h-10 text-amber-600/20 absolute right-[-10%] top-[-10%]" />
        },
        {
            label: "Last Payout",
            value: `Rs. ${Number(stats.lastSettlementAmount).toLocaleString()}`,
            hint: "Most recent completed settlement",
            tone: "from-blue-500/20 to-blue-100/20 border-blue-200/70",
            icon: <ArrowDownUp className="w-10 h-10 text-blue-600/20 absolute right-[-10%] top-[-10%]" />
        },
    ];

    if (isLoading) {
        return <p className="text-sm text-slate-500">Loading your finances...</p>;
    }

    return (
        <div className="space-y-6 bg-slate-50 pb-2">
            <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-[#040947]">Finance & Earnings</h1>
                    <p className="mt-1 text-sm text-slate-500">Track your revenue, commissions, and payouts</p>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {performanceCards.map((item) => (
                    <Card
                        key={item.label}
                        className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 shadow-sm shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-md ${item.tone}`}
                    >
                        {item.icon}
                        <div className="relative">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">{item.label}</p>
                            <p className="mt-2 text-3xl font-bold leading-none text-slate-900">{item.value}</p>
                            <p className="mt-2 text-[11px] font-medium text-slate-600/80">{item.hint}</p>
                        </div>
                    </Card>
                ))}
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <SectionCard
                    title="Settlement History"
                    subtitle="Payouts sent to your account"
                >
                    {settlements.length === 0 ? (
                        <p className="text-sm text-slate-500">No settlement records found.</p>
                    ) : (
                        <DataTable columns={settlementColumns} data={settlements} />
                    )}
                </SectionCard>

                <SectionCard
                    title="Recent Commissions"
                    subtitle="Platform fees deducted from orders"
                >
                    {commissions.length === 0 ? (
                        <p className="text-sm text-slate-500">No recent commission records found.</p>
                    ) : (
                        <DataTable columns={commissionColumns} data={commissions} />
                    )}
                </SectionCard>
            </section>
        </div>
    );
}
