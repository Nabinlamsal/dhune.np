"use client";
import { StatCard } from "@/src/components/dashboard/StatCard";
import { StatusBadge } from "@/src/components/common/StatusBadge";
import { useVendorDashboard } from "@/src/hooks/orders/useDashboard";
import { QuickActionsVendorDashboard } from "@/src/components/vendor/QuickActionsVendorDasboard";
import { GraphVendor } from "@/src/components/vendor/GraphVendor";

export default function VendorPage() {
    const { orders, offers, loading } = useVendorDashboard();

    const orderStats = orders.data?.data;
    const offerStats = offers.data?.data;

    const pendingOffers = offerStats?.pending_offers ?? 0;
    const acceptedOffers = offerStats?.accepted_offers ?? 0;

    const activeOrders =
        (orderStats?.accepted_orders ?? 0) +
        (orderStats?.picked_up_orders ?? 0) +
        (orderStats?.in_progress_orders ?? 0) +
        (orderStats?.delivering_orders ?? 0);

    const completedOrders = orderStats?.completed_orders ?? 0;



    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900">
                    Welcome back 👋
                </h2>
                <p className="text-gray-500">
                    Here’s what’s happening with your business today.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Pending Offers"
                    value={loading ? "—" : String(pendingOffers)}
                    description="Waiting for customer decision" trend={""} />

                <StatCard
                    title="Accepted Offers"
                    value={loading ? "—" : String(acceptedOffers)}
                    description="Converted to active jobs" trend={""} />

                <StatCard
                    title="Active Orders"
                    value={loading ? "—" : String(activeOrders)}
                    description="Currently in progress" trend={""} />

                <StatCard
                    title="Completed Orders"
                    value={loading ? "—" : String(completedOrders)}
                    description="Successfully delivered" trend={""} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT - Graph */}
                <GraphVendor />
                <div className="lg:col-span-1">
                    <QuickActionsVendorDashboard />
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">
                    Recent Orders
                </h3>

                {orders.data?.data?.recent_orders?.length ? (
                    <div className="space-y-3 text-sm text-gray-600">
                        {orders.data.data.recent_orders.slice(0, 5).map((order: any) => (
                            <div
                                key={order.id}
                                className="flex justify-between items-center"
                            >
                                <span>Order #{order.order_number}</span>
                                <StatusBadge status={order.status} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">
                        No recent orders yet.
                    </p>
                )}
            </div>
        </div>
    );
}