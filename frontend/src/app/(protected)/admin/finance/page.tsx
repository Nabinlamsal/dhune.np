"use client";

import { CreditCard, TrendingUp, Wallet } from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { useAdminFinanceDashboard } from "@/src/hooks/queries/useFinance";
import { Commission, VendorDue } from "@/src/types/finance/finance";
import { Payment } from "@/src/types/payments/payments";
import { formatDisplayId } from "@/src/utils/display";

const rs = (value?: string) => `Rs. ${Number(value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AdminFinancePage() {
    const { data, isLoading } = useAdminFinanceDashboard();

    const stats = data?.stats;
    const commissions = data?.recentCommissions ?? [];
    const payments = data?.commissionPaymentHistory ?? [];
    const vendorDues = data?.vendorDues ?? [];

    const commissionColumns = [
        {
            key: "order",
            header: "Order / Vendor",
            render: (c: Commission) => (
                <div>
                    <div className="text-sm font-medium text-slate-800">{formatDisplayId(c.OrderID, "ORD")}</div>
                    <div className="text-[11px] text-slate-500">{formatDisplayId(c.VendorID, "VND")}</div>
                </div>
            ),
        },
        {
            key: "amount",
            header: "Order Earnings",
            render: (c: Commission) => <div className="text-sm text-slate-600">{rs(c.OrderAmount)}</div>,
        },
        {
            key: "commission",
            header: "Commission",
            render: (c: Commission) => (
                <div>
                    <div className="text-sm font-bold text-emerald-700">{rs(c.CommissionAmount)}</div>
                    <div className="text-[11px] text-emerald-600/80">{c.CommissionPercent}%</div>
                </div>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (c: Commission) => <span className="text-xs font-semibold text-slate-700">{c.Status}</span>,
        },
    ];

    const paymentColumns = [
        {
            key: "id",
            header: "Payment",
            render: (p: Payment) => <div className="font-medium text-slate-900">{formatDisplayId(p.ID, "PAY")}</div>,
        },
        {
            key: "vendor",
            header: "Vendor",
            render: (p: Payment) => <div className="text-sm text-slate-600">{formatDisplayId(p.VendorID, "VND")}</div>,
        },
        {
            key: "amount",
            header: "Amount",
            render: (p: Payment) => <div className="text-sm font-bold text-slate-800">{rs(p.Amount)}</div>,
        },
        {
            key: "status",
            header: "Status",
            render: (p: Payment) => <span className="text-xs font-semibold text-slate-700">{p.PaymentStatus}</span>,
        },
    ];

    const vendorDueColumns = [
        {
            key: "vendor",
            header: "Vendor",
            render: (v: VendorDue) => <div className="text-sm font-medium text-slate-800">{formatDisplayId(v.VendorID, "VND")}</div>,
        },
        {
            key: "earnings",
            header: "Order Earnings",
            render: (v: VendorDue) => <div className="text-sm text-slate-600">{rs(v.TotalOrderEarnings)}</div>,
        },
        {
            key: "due",
            header: "Due",
            render: (v: VendorDue) => <div className="text-sm font-bold text-amber-700">{rs(v.CommissionDue)}</div>,
        },
        {
            key: "paid",
            header: "Paid",
            render: (v: VendorDue) => <div className="text-sm text-emerald-700">{rs(v.CommissionPaid)}</div>,
        },
    ];

    if (isLoading) {
        return <p className="text-gray-500">Loading finance dashboard...</p>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Platform Finances</h2>
                <p className="text-sm text-gray-500">Commission earned, received, and pending by vendor</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                    { label: "Commission Earned", value: rs(stats?.TotalPlatformCommissionEarned), hint: "Total platform commission generated", icon: <TrendingUp className="h-8 w-8 text-emerald-600/20" /> },
                    { label: "Commission Received", value: rs(stats?.TotalCommissionReceived), hint: "Verified commission payments", icon: <CreditCard className="h-8 w-8 text-blue-600/20" /> },
                    { label: "Pending Vendor Dues", value: rs(stats?.TotalPendingDues), hint: "Commission still due from vendors", icon: <Wallet className="h-8 w-8 text-amber-600/20" /> },
                ].map((item) => (
                    <Card key={item.label} className="relative rounded-lg border bg-white p-5 shadow-sm">
                        <div className="absolute right-3 top-3">{item.icon}</div>
                        <p className="text-xs font-medium uppercase text-gray-500">{item.label}</p>
                        <h3 className="mt-2 text-2xl font-bold text-slate-900">{item.value}</h3>
                        <p className="mt-3 text-xs text-slate-500">{item.hint}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <section className="rounded-lg border bg-white p-5">
                    <h3 className="text-lg font-semibold text-slate-900">Vendor Due List</h3>
                    <div className="mt-4">{vendorDues.length === 0 ? <p className="text-sm text-slate-500">No pending vendor dues.</p> : <DataTable columns={vendorDueColumns} data={vendorDues} />}</div>
                </section>

                <section className="rounded-lg border bg-white p-5">
                    <h3 className="text-lg font-semibold text-slate-900">Commission Payment History</h3>
                    <div className="mt-4">{payments.length === 0 ? <p className="text-sm text-slate-500">No commission payments.</p> : <DataTable columns={paymentColumns} data={payments} />}</div>
                </section>

                <section className="rounded-lg border bg-white p-5 xl:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-900">Recent Commission Records</h3>
                    <div className="mt-4">{commissions.length === 0 ? <p className="text-sm text-slate-500">No recent commissions.</p> : <DataTable columns={commissionColumns} data={commissions} />}</div>
                </section>
            </div>
        </div>
    );
}
