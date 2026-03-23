"use client";

import { useMemo, useState } from "react";
import { Building2, Clock3, Mail, MapPin, PackageCheck, Phone, Star, Target, Truck, UserCircle2, UserRound, X } from "lucide-react";
import { useVendorDashboard } from "@/src/hooks/orders/useDashboard";
import { KpiCard } from "@/src/components/vendor/dashboard/KpiCard";
import { PipelineCard } from "@/src/components/vendor/dashboard/PipelineCard";
import { AnalyticsSection } from "@/src/components/vendor/dashboard/AnalyticsSection";
import { SmartInsightsCard } from "@/src/components/vendor/dashboard/SmartInsightsCard";
import { useMyProfile } from "@/src/hooks/users/useMyProfile";
import { Detail } from "@/src/components/common/DetailItem";

type TimeFilter = "today" | "weekly" | "monthly";

export default function VendorPage() {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("weekly");
    const [profileOpen, setProfileOpen] = useState(false);
    const { orders, offers } = useVendorDashboard();
    const { data: myProfile, isLoading: isProfileLoading } = useMyProfile();

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

    const businessName = myProfile?.DisplayName || "--";
    const location = myProfile?.VendorProfile?.Address || "--";
    const ownerName = myProfile?.VendorProfile?.OwnerName ?? "--";
    const ratingMock = mockByFilter.rating.toFixed(1);
    const avatarInitial = myProfile?.DisplayName?.charAt(0).toUpperCase() || "V";

    return (
        <div className="space-y-6 bg-slate-50 pb-2">
            <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#040947]">Vendor Dashboard</h1>
                    <p className="mt-1 text-sm text-slate-500">Performance overview</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-[#040947]/10 px-2.5 py-1 text-xs font-semibold text-[#040947]">
                            Conversion: {acceptanceRate}%
                        </span>
                        <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-[#040947]">
                            Completion: {completionRate}%
                        </span>
                        <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            Rating: {mockByFilter.rating.toFixed(1)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setProfileOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#040947]/20 bg-white px-3 py-2 text-sm font-medium text-[#040947] transition hover:bg-[#040947]/5"
                    >
                        <UserCircle2 className="size-4" />
                        My Profile
                    </button>
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
                <KpiCard
                    label="Total Orders"
                    value={String(totalOrders)}
                    icon={<PackageCheck className="size-4" />}
                    trendText={mockByFilter.ordersTrend}
                    trendDirection="up"
                    trendTone="good"
                    helperText="vs last period"
                />
                <KpiCard
                    label="Total Offers"
                    value={String(totalOffers)}
                    icon={<Target className="size-4" />}
                    trendText={mockByFilter.offersTrend}
                    trendDirection="up"
                    trendTone="neutral"
                    helperText="vs last period"
                />
                <KpiCard
                    label="Acceptance Rate"
                    value={`${acceptanceRate}%`}
                    icon={<Truck className="size-4" />}
                    trendText={mockByFilter.rateTrend}
                    trendDirection="up"
                    trendTone="good"
                    helperText={`${acceptedOffers}/${Math.max(totalOffers, 0)}`}
                />
                <KpiCard
                    label="Avg Fulfillment Time"
                    value={`${mockByFilter.avgFulfillment}h`}
                    icon={<Clock3 className="size-4" />}
                    trendText="-5%"
                    trendDirection="down"
                    trendTone="good"
                    helperText="lower is better"
                />
                <KpiCard
                    label="Vendor Rating"
                    value={mockByFilter.rating.toFixed(1)}
                    icon={<Star className="size-4" />}
                    trendText="+0.2"
                    trendDirection="up"
                    trendTone="good"
                    helperText="customer score"
                />
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
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
            </section>

            <AnalyticsSection offerFlowData={offerFlowData} orderFlowData={orderFlowData} workloadData={workloadData} />

            <SmartInsightsCard insights={insights} />

            <p className="px-1 text-xs text-slate-500">
                Helper note: KPI trend percentages are mocked for preview; operational counts use live vendor stats.
            </p>

            {profileOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_72px_rgba(15,23,42,0.28)]">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900">My Profile</h3>
                                <p className="text-xs text-slate-500">Live profile data from backend</p>
                            </div>
                            <button
                                onClick={() => setProfileOpen(false)}
                                className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                aria-label="Close profile modal"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="space-y-4 bg-gradient-to-b from-[#040947]/[0.04] to-white p-4 md:p-5">
                            {isProfileLoading ? (
                                <p className="text-sm text-slate-500">Loading profile...</p>
                            ) : (
                                <>
                                    <div className="rounded-2xl border border-[#040947]/10 bg-white p-4">
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#040947] to-[#0b2a78] text-2xl font-bold text-white">
                                                    {avatarInitial}
                                                </div>
                                                <div>
                                                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                        <Building2 className="size-3.5" />
                                                        Business Name
                                                    </p>
                                                    <h4 className="text-xl font-bold text-slate-900">{businessName}</h4>
                                                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                                                        <MapPin className="size-4 text-slate-500" />
                                                        {location}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                                                <div className="rounded-lg bg-[#040947]/5 px-3 py-2">
                                                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Rating</p>
                                                    <p className="font-semibold text-slate-900">{ratingMock} / 5.0 (Mock)</p>
                                                </div>
                                                <div className="rounded-lg bg-[#040947]/5 px-3 py-2">
                                                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Vendor Status</p>
                                                    <p className="font-semibold text-slate-900">{myProfile?.VendorApprovalStatus ?? myProfile?.VendorProfile?.ApprovalStatus ?? "--"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                        <div className="rounded-lg border border-[#040947]/15 bg-white px-3 py-2">
                                            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                                                <UserRound className="size-3.5 text-[#040947]" />
                                                Owner
                                            </p>
                                            <p className="text-sm font-medium text-slate-900">{ownerName}</p>
                                        </div>
                                        <div className="rounded-lg border border-[#040947]/15 bg-white px-3 py-2">
                                            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                                                <Phone className="size-3.5 text-[#040947]" />
                                                Phone
                                            </p>
                                            <p className="text-sm font-medium text-slate-900">{myProfile?.Phone ?? "--"}</p>
                                        </div>
                                        <div className="rounded-lg border border-[#040947]/15 bg-white px-3 py-2 md:col-span-2">
                                            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-600">
                                                <Mail className="size-3.5 text-[#040947]" />
                                                Email
                                            </p>
                                            <p className="text-sm font-medium text-slate-900">{myProfile?.Email ?? "--"}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                        <Detail label="Vendor ID" value={myProfile?.ID} />
                                        <Detail label="Registration Number" value={myProfile?.VendorProfile?.RegistrationNumber} />
                                        <Detail label="Account Active" value={myProfile?.IsActive ? "Yes" : "No"} />
                                        <Detail label="Verified" value={myProfile?.IsVerified ? "Yes" : "No"} />
                                        <Detail label="Joined" value={myProfile?.CreatedAt ? new Date(myProfile.CreatedAt).toLocaleDateString() : undefined} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
