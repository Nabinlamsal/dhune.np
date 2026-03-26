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

    const performanceCards = [
        {
            label: "Total Orders",
            value: String(totalOrders),
            hint: `${completedOrders} completed`,
            progress: completionRate,
            tone: "from-blue-500/20 to-blue-100/20 border-blue-200/70",
            badge: "Delivery",
        },
        {
            label: "Total Offers",
            value: String(totalOffers),
            hint: `${pendingOffers} pending`,
            progress: acceptanceRate,
            tone: "from-amber-500/20 to-amber-100/20 border-amber-200/70",
            badge: "Bids",
        },
        {
            label: "Acceptance",
            value: `${acceptanceRate}%`,
            hint: `${acceptedOffers}/${Math.max(totalOffers, 0)}`,
            progress: acceptanceRate,
            tone: "from-emerald-500/20 to-emerald-100/20 border-emerald-200/70",
            badge: "Rate",
        },
        {
            label: "Completion",
            value: `${completionRate}%`,
            hint: `${completedOrders}/${Math.max(totalOrders, 0)}`,
            progress: completionRate,
            tone: "from-indigo-500/20 to-indigo-100/20 border-indigo-200/70",
            badge: "Closure",
        },
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
                        {performanceCards.map((item) => (
                            <Card
                                key={item.label}
                                className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-3.5 shadow-sm shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-md ${item.tone}`}
                            >
                                <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-white/40 blur-xl transition group-hover:bg-white/55" />
                                <div className="relative">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-medium text-slate-600">{item.label}</p>
                                        <span className="rounded-md bg-white/75 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                                            {item.badge}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xl font-semibold leading-none text-slate-900">{item.value}</p>
                                    <p className="mt-1 text-[11px] text-slate-500">{item.hint}</p>
                                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/75">
                                        <div
                                            className="h-full rounded-full bg-[#040947]/70 transition-all"
                                            style={{ width: `${Math.min(Math.max(item.progress, 0), 100)}%` }}
                                        />
                                    </div>
                                </div>
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
                        <Card className="relative overflow-hidden rounded-xl border border-[#040947]/25 bg-gradient-to-br from-[#22254a] to-[#696eb8] p-3 shadow-sm shadow-[#040947]/20">
                            <div className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-white/15 blur-xl" />
                            <p className="relative text-[11px] font-medium text-[#e3bc1f]">Avg Rating</p>
                            <p className="relative mt-1 text-xl font-semibold text-white">
                                {ratingSummary?.average_rating ?? "0.00"}<span className="text-sm text-blue-100">/5</span>
                            </p>
                        </Card>
                        <Card className="relative overflow-hidden rounded-xl border border-[#040947]/25 bg-gradient-to-br from-[#22254a] to-[#696eb8] p-3 shadow-sm shadow-[#040947]/20">
                            <div className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-white/15 blur-xl" />
                            <p className="relative text-[11px] font-medium text-[#e3bc1f]">Reviews</p>
                            <p className="relative mt-1 text-xl font-semibold text-white">{ratingSummary?.total_ratings ?? 0}</p>
                        </Card>
                    </div>
                    <Link
                        href="/vendor/ratings"
                        className="mt-3 inline-flex rounded-lg border border-[#040947]/40 bg-[#040947] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#09106a]"
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
