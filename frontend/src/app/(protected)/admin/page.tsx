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

export default function DashboardPage() {
    const { data: requestStats, isLoading: loadingRequests } =
        useAdminRequestStats();
    const { data: offerStats, isLoading: loadingOffers } =
        useAdminOfferStats();
    const { data: orderStats, isLoading: loadingOrders } =
        useAdminOrderStats();

    const isLoading = loadingRequests || loadingOffers || loadingOrders;

    const totalRequests = requestStats?.data?.total_requests ?? 0;
    const totalOffers = offerStats?.data?.total_offers ?? 0;
    const acceptedOffers = offerStats?.data?.accepted_offers ?? 0;

    const acceptedOrders = orderStats?.data?.accepted_orders ?? 0;
    const pickedUpOrders = orderStats?.data?.picked_up_orders ?? 0;
    const inProgressOrders = orderStats?.data?.in_progress_orders ?? 0;
    const deliveringOrders = orderStats?.data?.delivering_orders ?? 0;
    const completedOrders = orderStats?.data?.completed_orders ?? 0;
    const cancelledOrders = orderStats?.data?.cancelled_orders ?? 0;

    const activeOrders =
        acceptedOrders + pickedUpOrders + inProgressOrders + deliveringOrders;

    const conversionRate =
        totalRequests > 0 ? (completedOrders / totalRequests) * 100 : 0;

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
                <p className="text-sm text-gray-500">Marketplace analytics overview</p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                {[
                    { label: "Total Requests", value: totalRequests, hint: "All requests" },
                    { label: "Total Offers", value: totalOffers, hint: "All offers" },
                    { label: "Active Orders", value: activeOrders, hint: "Accepted to delivering" },
                    { label: "Completed", value: completedOrders, hint: "Done orders" },
                    { label: "Cancelled", value: cancelledOrders, hint: "Cancelled orders" },
                    { label: "Conversion", value: `${conversionRate.toFixed(1)}%`, hint: "Completed / requests" },
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
                            Payment Metric (Mock)
                        </p>
                        <h3 className="mt-1 text-xl font-bold text-gray-900">
                            NPR 0
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                            Total Commission Generated
                        </p>
                        <p className="mt-4 text-[11px] text-gray-400">
                            Pending backend endpoint for settled payouts
                        </p>
                    </Card>

                    <Card className="p-5">
                        <p className="text-xs font-medium text-gray-500">
                            Vendor Metric (Mock)
                        </p>
                        <h3 className="mt-1 text-base font-bold text-gray-900">
                            Top Vendors
                        </h3>
                        <div className="mt-3 space-y-2 text-sm text-gray-600">
                            <p>1. Vendor A - 0 completed</p>
                            <p>2. Vendor B - 0 completed</p>
                            <p>3. Vendor C - 0 completed</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
