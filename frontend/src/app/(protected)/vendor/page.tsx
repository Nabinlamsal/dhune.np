"use client";

import { useMemo, useState } from "react";
import { Card } from "@/src/components/ui/card";
import { useVendorDashboard } from "@/src/hooks/orders/useDashboard";
import { PipelineCard } from "@/src/components/vendor/dashboard/PipelineCard";
import { AnalyticsSection, OrderFlowCard } from "@/src/components/vendor/dashboard/AnalyticsSection";
import { SmartInsightsCard } from "@/src/components/vendor/dashboard/SmartInsightsCard";
import { SectionCard } from "@/src/components/vendor/dashboard/SectionCard";

type TimeFilter = "today" | "weekly" | "monthly";

export default function VendorPage() {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("weekly");
    const { orders, offers } = useVendorDashboard();

    const orderStats = orders.data?.data;
    const offerStats = offers.data?.data;

    const totalOrders = orderStats?.total_orders ?? 0;
    const totalOffers = offerStats?.total_offers ?? 0;
    const acceptedOffers = offerStats?.accepted_offers ?? 0;
    const pendingOffers = offerStats?.pending_offers ?? 0;
    const rejectedOffers = offerStats?.rejected_offers ?? 0;
    const withdrawnOffers = offerStats?.withdrawn_offers ?? 0;
    const expiredOffers = offerStats?.expired_offers ?? 0;

    const acceptedOrders = orderStats?.accepted_orders ?? 0;
    const pickedUpOrders = orderStats?.picked_up_orders ?? 0;
    const inProgressOrders = orderStats?.in_progress_orders ?? 0;
    const deliveringOrders = orderStats?.delivering_orders ?? 0;
    const completedOrders = orderStats?.completed_orders ?? 0;
    const cancelledOrders = orderStats?.cancelled_orders ?? 0;

    const activeOrders = acceptedOrders + pickedUpOrders + inProgressOrders + deliveringOrders;
    const acceptanceRate = totalOffers > 0 ? Math.round((acceptedOffers / totalOffers) * 100) : 0;
    const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
    const cancellationRate = totalOrders > 0 ? Math.round((cancelledOrders / totalOrders) * 100) : 0;

    const mockByFilter = {
        today: { avgFulfillment: 10.2, rating: 4.7, ordersTrend: "+5%", offersTrend: "+7%", rateTrend: "+2%" },
        weekly: { avgFulfillment: 8.9, rating: 4.8, ordersTrend: "+12%", offersTrend: "+15%", rateTrend: "+4%" },
        monthly: { avgFulfillment: 9.4, rating: 4.6, ordersTrend: "+9%", offersTrend: "+11%", rateTrend: "+3%" },
    }[timeFilter];

    const offerFlowData = useMemo(
        () => [
            { name: "Pending", value: pendingOffers },
            { name: "Accepted", value: acceptedOffers },
            { name: "Rejected", value: rejectedOffers },
            { name: "Withdrawn", value: withdrawnOffers },
            { name: "Expired", value: expiredOffers },
        ],
        [pendingOffers, acceptedOffers, rejectedOffers, withdrawnOffers, expiredOffers]
    );

    const orderFlowData = useMemo(
        () => [
            { name: "Accepted", value: acceptedOrders },
            { name: "Picked Up", value: pickedUpOrders },
            { name: "In Progress", value: inProgressOrders },
            { name: "Delivering", value: deliveringOrders },
            { name: "Completed", value: completedOrders },
            { name: "Cancelled", value: cancelledOrders },
        ],
        [acceptedOrders, pickedUpOrders, inProgressOrders, deliveringOrders, completedOrders, cancelledOrders]
    );

    const workloadData = useMemo(
        () => [
            { name: "Offers Pending", value: pendingOffers },
            { name: "Offers Accepted", value: acceptedOffers },
            { name: "Active Orders", value: activeOrders },
            { name: "Completed Orders", value: completedOrders },
        ],
        [pendingOffers, acceptedOffers, activeOrders, completedOrders]
    );

    const insights = [
        `Your acceptance rate is ${acceptanceRate}% (${mockByFilter.rateTrend}) in this ${timeFilter} window.`,
        `Average fulfillment is ${mockByFilter.avgFulfillment} hours, improving delivery consistency.`,
        cancellationRate === 0
            ? "No cancellations recorded in this period - great operational control."
            : `Cancellation rate is ${cancellationRate}%. Review drop-offs between delivery and completion.`,
    ];

    return (
        <div className="space-y-6 bg-slate-50 pb-2">
            <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#040947]">Vendor Dashboard</h1>
                    <p className="mt-1 text-sm text-slate-500">Performance overview</p>
                </div>

                <div className="flex items-center gap-2">
                    <label htmlFor="time-filter" className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Time Filter
                    </label>
                    <select
                        id="time-filter"
                        value={timeFilter}
                        onChange={(event) => setTimeFilter(event.target.value as TimeFilter)}
                        className="rounded-lg border border-[#040947]/20 bg-white px-3 py-2 text-sm text-[#040947] outline-none ring-amber-200 transition focus:ring-2"
                    >
                        <option value="today">Today</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                <OrderFlowCard orderFlowData={orderFlowData} className="xl:col-span-3" />
                <SectionCard title="Performance Snapshot" subtitle="Compact vendor KPIs" className="xl:col-span-2">
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            {
                                label: "Total Orders",
                                value: String(totalOrders),
                                hint: mockByFilter.ordersTrend,
                            },
                            {
                                label: "Total Offers",
                                value: String(totalOffers),
                                hint: mockByFilter.offersTrend,
                            },
                            {
                                label: "Acceptance",
                                value: `${acceptanceRate}%`,
                                hint: `${acceptedOffers}/${Math.max(totalOffers, 0)}`,
                            },
                            {
                                label: "Completion",
                                value: `${completionRate}%`,
                                hint: `${completedOrders}/${Math.max(totalOrders, 0)}`,
                            },
                        ].map((item) => (
                            <Card key={item.label} className="rounded-xl border border-slate-200 p-3 shadow-none">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
                                <p className="mt-1 text-lg font-bold leading-none text-slate-900">{item.value}</p>
                                <p className="mt-1 text-[11px] text-slate-400">{item.hint}</p>
                            </Card>
                        ))}
                    </div>
                </SectionCard>
            </section>

            <AnalyticsSection offerFlowData={offerFlowData} workloadData={workloadData} />

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <PipelineCard
                    title="Offer Pipeline"
                    subtitle="Bid quality and conversion"
                    total={totalOffers}
                    primaryLabel="Accepted Ratio"
                    primaryCount={acceptedOffers}
                    items={[
                        { label: "Accepted", count: acceptedOffers, tone: "success" },
                        { label: "Pending", count: pendingOffers, tone: "warning" },
                        { label: "Rejected", count: rejectedOffers, tone: "danger" },
                    ]}
                    insight={acceptanceRate >= 55 ? "High acceptance rate this week." : "Acceptance can improve with tighter pricing and timing."}
                />
                <PipelineCard
                    title="Order Pipeline"
                    subtitle="Execution and throughput"
                    total={totalOrders}
                    primaryLabel="Completion Ratio"
                    primaryCount={completedOrders}
                    items={[
                        { label: "Active", count: activeOrders, tone: "neutral" },
                        { label: "Completed", count: completedOrders, tone: "success" },
                        { label: "Cancelled", count: cancelledOrders, tone: "danger" },
                    ]}
                    insight={
                        cancellationRate <= 5
                            ? `Low cancellations and healthy flow (${completionRate}% completion).`
                            : "Cancellation rate is elevated. Check pickup-to-delivery handoff."
                    }
                />
                <SmartInsightsCard insights={insights} />
            </section>

            <p className="px-1 text-xs text-slate-500">
                Helper note: KPI trend percentages are mocked for preview; operational counts use live vendor stats.
            </p>
        </div>
    );
}
