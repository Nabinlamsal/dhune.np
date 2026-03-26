"use client";

import { Card } from "@/src/components/ui/card";
import {
    ConversionFunnel,
    FunnelItem,
} from "@/src/components/dashboard/ConversionFunnel";
import { OrderStatusChart } from "@/src/components/admin/OrderStatusChart";
import { MarketplaceComparisonChart } from "@/src/components/admin/MarketplaceComparisonChart";
import { useAdminRequestStats } from "@/src/hooks/orders/useRequest";
import { useAdminOfferStats } from "@/src/hooks/orders/useOffer";
import { useAdminOrderStats } from "@/src/hooks/orders/useOrder";
import { useAdminTopRatedVendors } from "@/src/hooks/ratings/useRatings";
import Link from "next/link";

export default function DashboardPage() {
    const { data: requestStats, isLoading: loadingRequests } =
        useAdminRequestStats();
    const { data: offerStats, isLoading: loadingOffers } =
        useAdminOfferStats();
    const { data: orderStats, isLoading: loadingOrders } =
        useAdminOrderStats();
    const { data: topRated, isLoading: loadingRatings } = useAdminTopRatedVendors(5, 0);

    const isLoading = loadingRequests || loadingOffers || loadingOrders || loadingRatings;

    const totalRequests = requestStats?.data?.total_requests ?? 0;
    const totalOffers = offerStats?.data?.total_offers ?? 0;
    const acceptedOffers = offerStats?.data?.accepted_offers ?? 0;

    const acceptedOrders = orderStats?.data?.accepted_orders ?? 0;
    const pickedUpOrders = orderStats?.data?.picked_up_orders ?? 0;
    const inProgressOrders = orderStats?.data?.in_progress_orders ?? 0;
    const deliveringOrders = orderStats?.data?.delivering_orders ?? 0;
    const totalOrders = orderStats?.data?.total_orders ?? 0;
    const completedOrders = orderStats?.data?.completed_orders ?? 0;
    const cancelledOrders = orderStats?.data?.cancelled_orders ?? 0;
    const pendingOffers = offerStats?.data?.pending_offers ?? 0;

    const activeOrders =
        acceptedOrders + pickedUpOrders + inProgressOrders + deliveringOrders;

    const conversionRate =
        totalRequests > 0 ? (completedOrders / totalRequests) * 100 : 0;
    const offerAcceptanceRate =
        totalOffers > 0 ? (acceptedOffers / totalOffers) * 100 : 0;
    const orderCompletionRate =
        totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    const funnelMax = Math.max(
        totalRequests,
        totalOffers,
        acceptedOffers,
        completedOrders,
        1
    );

    const funnelData: FunnelItem[] = [
        { label: "Requests", value: totalRequests, max: funnelMax },
        { label: "Offers", value: totalOffers, max: funnelMax },
        { label: "Accepted", value: acceptedOffers, max: funnelMax },
        { label: "Completed", value: completedOrders, max: funnelMax },
    ];

    if (isLoading) {
        return <p className="text-gray-500">Loading dashboard...</p>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Admin Dashboard
                </h2>
                <p className="text-sm text-gray-500">Operational summary across requests, offers, and orders</p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                {[
                    { label: "Total Requests", value: totalRequests, hint: "Current volume" },
                    { label: "Total Offers", value: totalOffers, hint: `${pendingOffers} still pending` },
                    { label: "Active Orders", value: activeOrders, hint: "In execution" },
                    { label: "Completed", value: completedOrders, hint: "Delivered successfully" },
                    { label: "Cancelled", value: cancelledOrders, hint: "Needs attention" },
                    { label: "Request Conversion", value: `${conversionRate.toFixed(1)}%`, hint: "Requests to completed" },
                ].map((item) => (
                    <Card key={item.label} className="p-4">
                        <p className="text-xs font-medium text-gray-500">{item.label}</p>
                        <p className="mt-1 text-xl font-bold text-gray-900">{item.value}</p>
                        <p className="mt-1 text-[11px] text-gray-400">{item.hint}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                <div className="lg:col-span-2">
                    <ConversionFunnel
                        data={funnelData}
                        title="Marketplace Funnel"
                        description="Requests -> Offers -> Accepted -> Completed"
                    />
                </div>
                <div className="lg:col-span-3">
                    <OrderStatusChart
                        accepted={acceptedOrders}
                        pickedUp={pickedUpOrders}
                        inProgress={inProgressOrders}
                        delivering={deliveringOrders}
                        completed={completedOrders}
                        cancelled={cancelledOrders}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-6">
                <div className="xl:col-span-4">
                    <MarketplaceComparisonChart
                        totalRequests={totalRequests}
                        totalOffers={totalOffers}
                        completedOrders={completedOrders}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2 xl:grid-cols-1">
                    <Card className="p-5">
                        <p className="text-xs font-medium text-gray-500">
                            Offer Acceptance Rate
                        </p>
                        <h3 className="mt-1 text-xl font-bold text-gray-900">
                            {offerAcceptanceRate.toFixed(1)}%
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                            {acceptedOffers} accepted out of {totalOffers} offers
                        </p>
                    </Card>

                    <Card className="p-5">
                        <p className="text-xs font-medium text-gray-500">
                            Order Completion Rate
                        </p>
                        <h3 className="mt-1 text-xl font-bold text-gray-900">
                            {orderCompletionRate.toFixed(1)}%
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                            {completedOrders} completed out of {totalOrders} total orders
                        </p>
                    </Card>

                    <Card className="p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-medium text-gray-500">Top Rated Vendors</p>
                                <h3 className="mt-1 text-sm font-semibold text-gray-900">Avg rating leaderboard</h3>
                            </div>
                            <Link
                                href="/admin/ratings"
                                className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700 transition hover:bg-slate-50"
                            >
                                View all
                            </Link>
                        </div>
                        <div className="mt-3 space-y-2">
                            {(topRated ?? []).slice(0, 3).map((item) => (
                                <div key={item.vendor_id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                                    <p className="text-xs font-medium text-slate-800">{item.vendor_name}</p>
                                    <p className="text-xs font-semibold text-amber-700">{item.average_rating}/5</p>
                                </div>
                            ))}
                            {(topRated ?? []).length === 0 ? (
                                <p className="text-xs text-slate-500">No ratings available yet.</p>
                            ) : null}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
