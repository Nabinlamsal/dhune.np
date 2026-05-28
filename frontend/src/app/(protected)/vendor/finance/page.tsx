"use client";

import { BadgeDollarSign, CreditCard, Wallet } from "lucide-react";
import { useState } from "react";
import { useCreateSettlement, useVendorFinanceDashboard, useVendorSettlements } from "@/src/hooks/queries/useFinance";
import { useOpenCommissionPayment } from "@/src/hooks/queries/usePayments";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { Commission, VendorSettlement } from "@/src/types/finance/finance";
import { Payment } from "@/src/types/payments/payments";
import { formatDisplayId } from "@/src/utils/display";
import { SectionCard } from "@/src/components/vendor/dashboard/SectionCard";

const rs = (value?: string) => `Rs. ${Number(value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function VendorFinancePage() {
    const { data, isLoading, refetch } = useVendorFinanceDashboard();
    const { data: rawSettlements } = useVendorSettlements();
    const openCommissionPayment = useOpenCommissionPayment();
    const createSettlement = useCreateSettlement();
    const [settlementReference, setSettlementReference] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"KHALTI" | "ESEWA" | null>(null);

    const stats = data?.stats;
    const settlements = rawSettlements ?? [];
    const commissions = data?.recentCommissions ?? [];
    const payments = data?.commissionPaymentHistory ?? [];

    const commissionColumns = [
        {
            key: "order",
            header: "Order",
            render: (c: Commission) => <div className="text-sm font-medium text-slate-800">{formatDisplayId(c.OrderID, "ORD")}</div>,
        },
        {
            key: "orderAmount",
            header: "Order Earnings",
            render: (c: Commission) => <div className="text-sm text-slate-600">{rs(c.OrderAmount)}</div>,
        },
        {
            key: "commission",
            header: "Commission",
            render: (c: Commission) => (
                <div>
                    <div className="text-sm font-bold text-rose-600">{rs(c.CommissionAmount)}</div>
                    <div className="text-[11px] text-rose-500/80">{c.CommissionPercent}%</div>
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
            key: "amount",
            header: "Amount",
            render: (p: Payment) => <div className="text-sm font-bold text-slate-800">{rs(p.Amount)}</div>,
        },
        {
            key: "method",
            header: "Method",
            render: (p: Payment) => <span className="text-xs font-semibold text-slate-600">{p.PaymentMethod}</span>,
        },
        {
            key: "status",
            header: "Status",
            render: (p: Payment) => <span className="text-xs font-semibold text-slate-700">{p.PaymentStatus}</span>,
        },
    ];

    const settlementColumns = [
        {
            key: "amount",
            header: "Amount",
            render: (s: VendorSettlement) => <div className="text-sm font-bold text-slate-800">{rs(s.Amount)}</div>,
        },
        {
            key: "reference",
            header: "Reference",
            render: (s: VendorSettlement) => <div className="text-sm text-slate-600">{s.Reference?.Valid ? s.Reference.String : "-"}</div>,
        },
        {
            key: "status",
            header: "Status",
            render: (s: VendorSettlement) => <span className="text-xs font-semibold text-slate-700">{s.Status === "VERIFIED" ? "Verified Settlement" : "Pending Settlement"}</span>,
        },
    ];

    const submitSettlement = () => {
        const amount = Number(stats?.TotalPendingDue ?? 0);
        if (amount <= 0 || !settlementReference.trim()) return;
        createSettlement.mutate(
            {
                amount,
                payment_method: "ESEWA",
                reference: settlementReference.trim(),
            },
            {
                onSuccess: () => setSettlementReference(""),
            }
        );
    };

    const openPayment = (method: "KHALTI" | "ESEWA") => {
        setSelectedPaymentMethod(method);
        openCommissionPayment.mutate(method, {
            onSettled: () => setSelectedPaymentMethod(null),
        });
    };

    if (isLoading) {
        return <p className="text-sm text-slate-500">Loading your finances...</p>;
    }

    return (
        <div className="space-y-6 bg-slate-50 pb-2">
            <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-[#040947]">Finance & Earnings</h1>
                    <p className="mt-1 text-sm text-slate-500">Track order earnings and platform commission dues</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        className="bg-[#5c2d91] text-white hover:bg-[#4a2277]"
                        disabled={openCommissionPayment.isPending || Number(stats?.TotalPendingDue ?? 0) <= 0}
                        onClick={() => openPayment("KHALTI")}
                    >
                        <CreditCard className="size-4" />
                        {selectedPaymentMethod === "KHALTI" && openCommissionPayment.isPending ? "Opening Khalti..." : "Pay with Khalti"}
                    </Button>
                    <Button
                        className="bg-[#60bb46] text-white hover:bg-[#4fa43a]"
                        disabled={openCommissionPayment.isPending || Number(stats?.TotalPendingDue ?? 0) <= 0}
                        onClick={() => openPayment("ESEWA")}
                    >
                        <Wallet className="size-4" />
                        {selectedPaymentMethod === "ESEWA" && openCommissionPayment.isPending ? "Opening eSewa..." : "Pay with eSewa"}
                    </Button>
                    <Button variant="outline" onClick={() => refetch()}>Refresh</Button>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                    { label: "Total Order Earnings", value: rs(stats?.TotalOrderValue), hint: `${stats?.CommissionPercent ?? "0"}% commission`, icon: <BadgeDollarSign className="absolute right-3 top-3 h-8 w-8 text-emerald-600/20" /> },
                    { label: "Commission Due", value: rs(stats?.TotalPendingDue), hint: "Remaining due", icon: <Wallet className="absolute right-3 top-3 h-8 w-8 text-amber-600/20" /> },
                    { label: "Commission Paid", value: rs(stats?.TotalPaidToPlatform), hint: "Paid to platform", icon: <CreditCard className="absolute right-3 top-3 h-8 w-8 text-blue-600/20" /> },
                ].map((item) => (
                    <Card key={item.label} className="relative rounded-lg border bg-white p-5 shadow-sm">
                        {item.icon}
                        <p className="text-[11px] font-medium uppercase text-slate-600">{item.label}</p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
                        <p className="mt-2 text-xs text-slate-500">{item.hint}</p>
                    </Card>
                ))}
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <SectionCard title="Commission Payment History" subtitle="Payments made to the platform">
                    {payments.length === 0 ? <p className="text-sm text-slate-500">No commission payments yet.</p> : <DataTable columns={paymentColumns} data={payments} />}
                </SectionCard>

                <SectionCard title="Commission Records" subtitle="Commission generated from paid orders">
                    {commissions.length === 0 ? <p className="text-sm text-slate-500">No commission records found.</p> : <DataTable columns={commissionColumns} data={commissions} />}
                </SectionCard>

                <SectionCard title="Manual Settlement" subtitle="Submit a transfer reference for admin verification">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Input
                            value={settlementReference}
                            onChange={(event) => setSettlementReference(event.target.value)}
                            placeholder="Bank/eSewa reference"
                        />
                        <Button
                            variant="outline"
                            disabled={createSettlement.isPending || Number(stats?.TotalPendingDue ?? 0) <= 0 || !settlementReference.trim()}
                            onClick={submitSettlement}
                        >
                            Submit Settlement
                        </Button>
                    </div>
                    <div className="mt-4">
                        {settlements.length === 0 ? <p className="text-sm text-slate-500">No settlement requests yet.</p> : <DataTable columns={settlementColumns} data={settlements} />}
                    </div>
                </SectionCard>
            </section>
        </div>
    );
}
