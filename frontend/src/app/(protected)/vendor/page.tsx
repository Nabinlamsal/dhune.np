"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { useVendorDashboard } from "@/src/hooks/orders/useDashboard";
import { useVendorRatings } from "@/src/hooks/ratings/useRatings";
import { PipelineCard } from "@/src/components/vendor/dashboard/PipelineCard";
import {
    OfferConversionCard,
    OrderFlowCard,
    WorkloadDistributionCard,
} from "@/src/components/vendor/dashboard/AnalyticsSection";
import { SmartInsightsCard } from "@/src/components/vendor/dashboard/SmartInsightsCard";
import { SectionCard } from "@/src/components/vendor/dashboard/SectionCard";

type TimeFilter = "today" | "weekly" | "monthly";

export default function VendorPage() {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("weekly");
    const { orders, offers } = useVendorDashboard();
    const { data: ratingsData } = useVendorRatings(3, 0);

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
    const ratingSummary = ratingsData?.summary;

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
        `Offer acceptance is ${acceptanceRate}% (${acceptedOffers} of ${totalOffers}).`,
        `${pendingOffers} offers are pending and ${activeOrders} orders are currently active.`,
        cancellationRate === 0
            ? "No cancelled orders recorded in this period."
            : `${cancelledOrders} orders were cancelled (${cancellationRate}%). Review handoff and ETA clarity.`,
    ];

    return (
        <div className="space-y-6 bg-slate-50 pb-2">
            <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-[#040947]">Vendor Dashboard</h1>
                    <p className="mt-1 text-sm text-slate-500">Operational view of offers and order execution</p>
                </div>

                <div className="flex items-center gap-2">
                    <label htmlFor="time-filter" className="text-xs font-medium text-slate-500">
                        Time range
                    </label>
                    <select
                        id="time-filter"
                        value={timeFilter}
                        onChange={(event) => setTimeFilter(event.target.value as TimeFilter)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-amber-200 transition focus:ring-2"
                    >
                        <option value="today">Today</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                <OrderFlowCard orderFlowData={orderFlowData} className="xl:col-span-3" />
                <SectionCard title="Performance Snapshot" subtitle="Core KPIs for the selected period" className="xl:col-span-2">
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            {
                                label: "Total Orders",
                                value: String(totalOrders),
                                hint: `${completedOrders} completed`,
                            },
                            {
                                label: "Total Offers",
                                value: String(totalOffers),
                                hint: `${pendingOffers} pending`,
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
                            <Card key={item.label} className="rounded-xl border border-slate-200 p-3.5 shadow-none transition hover:border-[#040947]/20 hover:bg-[#040947]/[0.03]">
                                <p className="text-[11px] font-medium text-slate-500">{item.label}</p>
                                <p className="mt-1 text-lg font-semibold leading-none text-slate-900">{item.value}</p>
                                <p className="mt-1 text-[11px] text-slate-400">{item.hint}</p>
                            </Card>
                        ))}
                    </div>
                </SectionCard>
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-6">
                <OfferConversionCard offerFlowData={offerFlowData} className="xl:col-span-2" />
                <WorkloadDistributionCard workloadData={workloadData} className="xl:col-span-2" />
                <SectionCard
                    title="Ratings Snapshot"
                    subtitle="Your current customer rating status"
                    className="xl:col-span-2"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <Card className="rounded-xl border border-slate-200 p-3 shadow-none">
                            <p className="text-[11px] font-medium text-slate-500">Avg Rating</p>
                            <p className="mt-1 text-xl font-semibold text-slate-900">
                                {ratingSummary?.average_rating ?? "0.00"}<span className="text-sm text-slate-500">/5</span>
                            </p>
                        </Card>
                        <Card className="rounded-xl border border-slate-200 p-3 shadow-none">
                            <p className="text-[11px] font-medium text-slate-500">Reviews</p>
                            <p className="mt-1 text-xl font-semibold text-slate-900">{ratingSummary?.total_ratings ?? 0}</p>
                        </Card>
                    </div>
                    <Link
                        href="/vendor/ratings"
                        className="mt-3 inline-flex rounded-lg border border-[#040947]/20 bg-[#040947]/5 px-3 py-1.5 text-xs font-medium text-[#040947] transition hover:bg-[#040947]/10"
                    >
                        Open all ratings and reviews
                    </Link>
                </SectionCard>
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <PipelineCard
                    title="Offer Pipeline"
                    subtitle="Status split for submitted offers"
                    total={totalOffers}
                    primaryLabel="Accepted Ratio"
                    primaryCount={acceptedOffers}
                    items={[
                        { label: "Accepted", count: acceptedOffers, tone: "success" },
                        { label: "Pending", count: pendingOffers, tone: "warning" },
                        { label: "Rejected", count: rejectedOffers, tone: "danger" },
                    ]}
                    insight={acceptanceRate >= 55 ? "Acceptance is healthy. Keep response time and pricing consistent." : "Acceptance is below target. Review pricing and quote turnaround time."}
                />
                <PipelineCard
                    title="Order Pipeline"
                    subtitle="Current execution progress"
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
                            ? `Flow is stable with ${completionRate}% completion.`
                            : "Cancellation rate is elevated. Check pickup timing and customer communication."
                    }
                />
                <SmartInsightsCard insights={insights} />
            </section>
        </div>
    );
}
