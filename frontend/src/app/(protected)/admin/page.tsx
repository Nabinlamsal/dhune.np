"use client"

import { StatCard } from "@/src/components/dashboard/StatCard"
import { ConversionFunnel } from "@/src/components/dashboard/ConversionFunnel"
import { useAdminRequestStats } from "@/src/hooks/orders/useRequest";
import { useAdminOfferStats } from "@/src/hooks/orders/useOffer";
import { useAdminOrderStats } from "@/src/hooks/orders/useOrder";

export default function DashboardPage() {

    // Fetch stats
    const { data: requestStats, isLoading: loadingRequests } =
        useAdminRequestStats();
    console.log("Requests", requestStats)
    const { data: offerStats, isLoading: loadingOffers } =
        useAdminOfferStats();

    const { data: orderStats, isLoading: loadingOrders } =
        useAdminOrderStats();

    const isLoading =
        loadingRequests || loadingOffers || loadingOrders;

    // Extract values safely
    const totalRequests =
        requestStats?.data?.total_requests ?? 0;

    const pendingOffers =
        offerStats?.data?.pending_offers ?? 0;

    const activeOrders =
        orderStats?.data?.accepted_orders ?? 0;

    const completedOrders =
        orderStats?.data?.completed_orders ?? 0;

    // Conversion rate (Requests → Orders)
    const conversionRate =
        totalRequests > 0
            ? Math.round(
                (completedOrders / totalRequests) * 100
            )
            : 0;

    if (isLoading) {
        return (
            <p className="text-gray-500">
                Loading dashboard...
            </p>
        );
    }
    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                    Dashboard
                </h2>

                <p className="text-gray-500">
                    Real-time overview of your marketplace
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {/* Active Requests */}
                <StatCard
                    title="Active Requests"
                    value={totalRequests}
                    description="Total customer requests" trend={""} />

                {/* Pending Offers */}
                <StatCard
                    title="Pending Offers"
                    value={pendingOffers}
                    description="Waiting for approval" trend={""} />

                {/* Active Orders */}
                <StatCard
                    title="Active Orders"
                    value={activeOrders}
                    description="Currently in progress" trend={""} />

                {/* Conversion Rate */}
                <StatCard
                    title="Conversion Rate"
                    value={`${conversionRate}%`}
                    description="Requests → Completed Orders"
                    negative={conversionRate < 30} trend={""} />

            </div>
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Line Chart Placeholder */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-lg">
                        Requests vs Offers vs Completions
                    </h3>
                    <p className="text-xs text-gray-400 mb-6">
                        Track the marketplace funnel over time
                    </p>

                    <div className="relative h-[300px] w-full border-l border-b border-gray-100">
                        <svg className="w-full h-full" viewBox="0 0 400 200">
                            <path
                                d="M0,180 Q100,160 200,140 T400,100"
                                fill="none"
                                stroke="#4338ca"
                                strokeWidth="2"
                            />
                            <path
                                d="M0,190 Q100,180 200,160 T400,130"
                                fill="none"
                                stroke="#fbbf24"
                                strokeWidth="2"
                            />
                            <path
                                d="M0,200 Q100,195 200,180 T400,150"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                </div>

                {/* Funnel */}
                <ConversionFunnel />

            </div>
        </>
    )
}
