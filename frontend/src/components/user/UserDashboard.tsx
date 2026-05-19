"use client";

import {
    CalendarDays,
    CircleX,
    CreditCard,
    LogOut,
    PackageCheck,
    ReceiptText,
    Shirt,
    Smartphone,
    Clock3,
} from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { StatusBadge } from "@/src/components/common/StatusBadge";
import { useLogout } from "@/src/hooks/auth/useLogout";
import { useMe } from "@/src/hooks/auth/useMe";
import { useMyProfile } from "@/src/hooks/users/useMyProfile";
import { useMyRequests, useMyRequestStats } from "@/src/hooks/orders/useRequest";
import { useMyOrders, useMyOrderStats } from "@/src/hooks/orders/useOrder";
import { OrderListItem } from "@/src/types/orders/orders";
import { RequestSummary } from "@/src/types/orders/requests";
import { OrderStatus, PaymentStatus, RequestStatus } from "@/src/types/orders/orders-enums";

const currency = new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
});

const formatDate = (value?: string) => {
    if (!value) return "Not available";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";

    return date.toLocaleDateString("en-NP", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const humanize = (value?: string) =>
    value ? value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Not available";

const requestStatusTone = (status: RequestStatus) => {
    switch (status) {
        case "OPEN":
            return "info";
        case "ORDER_CREATED":
            return "success";
        case "CANCELLED":
            return "error";
        case "EXPIRED":
        default:
            return "neutral";
    }
};

const orderStatusTone = (status: OrderStatus) => {
    switch (status) {
        case "COMPLETED":
            return "success";
        case "CANCELLED":
            return "error";
        case "ACCEPTED":
        case "PICKED_UP":
        case "IN_PROGRESS":
        case "DELIVERING":
            return "info";
        default:
            return "neutral";
    }
};

const paymentStatusTone = (status: PaymentStatus) => {
    switch (status) {
        case "PAID":
            return "success";
        case "UNPAID":
            return "warning";
        case "REFUNDED":
        default:
            return "neutral";
    }
};

function StatCard({
    label,
    value,
    hint,
    icon: Icon,
}: {
    label: string;
    value: string | number;
    hint: string;
    icon: typeof ReceiptText;
}) {
    return (
        <Card className="p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-medium text-gray-500">{label}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
                    <p className="mt-1 text-[11px] text-gray-400">{hint}</p>
                </div>
                <div className="rounded-lg bg-[#040947]/10 p-2 text-[#040947]">
                    <Icon className="h-4 w-4" />
                </div>
            </div>
        </Card>
    );
}

function EmptyPreview({ message }: { message: string }) {
    return (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            {message}
        </div>
    );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
    return (
        <div>
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    );
}

function RequestsPreview({ requests, isLoading }: { requests: RequestSummary[]; isLoading: boolean }) {
    return (
        <Card className="p-5">
            <SectionHeader title="Recent Requests" description="Read-only preview of your latest laundry requests" />
            <div className="mt-4 overflow-x-auto">
                {isLoading ? (
                    <p className="text-sm text-gray-500">Loading recent requests...</p>
                ) : requests.length === 0 ? (
                    <EmptyPreview message="No laundry requests found yet. Create and manage requests from the Dhune mobile app." />
                ) : (
                    <table className="w-full min-w-[680px] text-left text-sm">
                        <thead className="border-b text-xs text-gray-500">
                            <tr>
                                <th className="pb-3 font-medium">Request</th>
                                <th className="pb-3 font-medium">Service</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium">Created</th>
                                <th className="pb-3 font-medium">Location</th>
                                <th className="pb-3 font-medium">Responses</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {requests.map((request) => (
                                <tr key={request.id} className="text-gray-700">
                                    <td className="py-3 font-medium text-gray-900">Request #{request.id.slice(0, 8)}</td>
                                    <td className="py-3">Laundry request</td>
                                    <td className="py-3">
                                        <StatusBadge status={requestStatusTone(request.status)} label={humanize(request.status)} />
                                    </td>
                                    <td className="py-3">{formatDate(request.created_at)}</td>
                                    <td className="max-w-[220px] truncate py-3">{request.pickup_address || "Not available"}</td>
                                    <td className="py-3 text-gray-500">Mobile app</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
}

function OrdersPreview({ orders, isLoading }: { orders: OrderListItem[]; isLoading: boolean }) {
    return (
        <Card className="p-5">
            <SectionHeader title="Recent Orders" description="Latest order progress and payment visibility" />
            <div className="mt-4 overflow-x-auto">
                {isLoading ? (
                    <p className="text-sm text-gray-500">Loading recent orders...</p>
                ) : orders.length === 0 ? (
                    <EmptyPreview message="No orders found yet. Accept offers and track bookings from the Dhune mobile app." />
                ) : (
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="border-b text-xs text-gray-500">
                            <tr>
                                <th className="pb-3 font-medium">Order</th>
                                <th className="pb-3 font-medium">Vendor</th>
                                <th className="pb-3 font-medium">Order Status</th>
                                <th className="pb-3 font-medium">Payment</th>
                                <th className="pb-3 font-medium">Amount</th>
                                <th className="pb-3 font-medium">Created</th>
                                <th className="pb-3 font-medium">Completion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.map((order) => (
                                <tr key={order.id} className="text-gray-700">
                                    <td className="py-3 font-medium text-gray-900">Order #{order.id.slice(0, 8)}</td>
                                    <td className="py-3">{order.vendor_name || "Vendor pending"}</td>
                                    <td className="py-3">
                                        <StatusBadge status={orderStatusTone(order.order_status)} label={humanize(order.order_status)} />
                                    </td>
                                    <td className="py-3">
                                        <StatusBadge status={paymentStatusTone(order.payment_status)} label={humanize(order.payment_status)} />
                                    </td>
                                    <td className="py-3">{currency.format(order.final_price ?? 0)}</td>
                                    <td className="py-3">{formatDate(order.created_at)}</td>
                                    <td className="py-3 text-gray-500">{order.order_status === "COMPLETED" ? "Completed" : "Pending"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
}

export default function UserDashboard() {
    const logout = useLogout();
    const { data: me } = useMe();
    const { data: profile, isLoading: loadingProfile, isError: profileError } = useMyProfile();
    const { data: requestsResponse, isLoading: loadingRequests, isError: requestsError } = useMyRequests(5, 0);
    const { data: requestStatsResponse, isLoading: loadingRequestStats, isError: requestStatsError } = useMyRequestStats();
    const { data: orders = [], isLoading: loadingOrders, isError: ordersError } = useMyOrders(5, 0);
    const { data: orderStatsResponse, isLoading: loadingOrderStats, isError: orderStatsError } = useMyOrderStats();

    const requestStats = requestStatsResponse?.data;
    const orderStats = orderStatsResponse?.data;
    const requests = requestsResponse?.data ?? [];
    const businessProfile = profile?.BusinessProfile;
    const isBusinessProfile = profile?.Role === "business" || Boolean(businessProfile?.BusinessType || businessProfile?.RegistrationNumber);
    const activeOrders =
        (orderStats?.accepted_orders ?? 0) +
        (orderStats?.picked_up_orders ?? 0) +
        (orderStats?.in_progress_orders ?? 0) +
        (orderStats?.delivering_orders ?? 0);
    const unpaidOrders = orders.filter((order) => order.payment_status === "UNPAID").length;
    const paidOrders = orders.filter((order) => order.payment_status === "PAID");
    const totalPaid = paidOrders.reduce((sum, order) => sum + (order.final_price ?? 0), 0);
    const hasDataError = profileError || requestsError || requestStatsError || ordersError || orderStatsError;

    return (
        <div className="space-y-6">
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <Card className="overflow-hidden xl:col-span-2">
                    <div className="border-b bg-[#040947] p-5 text-white">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#e3bc1f]">User Overview</p>
                                <h1 className="mt-1 text-2xl font-bold">
                                    Welcome, {profile?.DisplayName || me?.display_name || "Dhune User"}
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm text-blue-100">
                                    Manage your laundry bookings faster from the Dhune mobile app.
                                </p>
                            </div>
                            <Button
                                type="button"
                                onClick={logout}
                                variant="outline"
                                className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#040947]"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p className="text-xs font-medium text-gray-500">Email</p>
                            <p className="mt-1 break-words text-sm font-medium text-gray-900">
                                {loadingProfile ? "Loading..." : profile?.Email || "Not available"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">Phone</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">{profile?.Phone || "Not available"}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">Role</p>
                            <div className="mt-1">
                                <StatusBadge status="info" label="USER" />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500">Profile Type</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {isBusinessProfile ? "Business User" : "Normal User"}
                            </p>
                        </div>
                    </div>
                    {isBusinessProfile ? (
                        <div className="grid gap-3 border-t bg-slate-50 p-5 sm:grid-cols-3">
                            <div>
                                <p className="text-xs font-medium text-gray-500">Business Name</p>
                                <p className="mt-1 text-sm font-medium text-gray-900">{businessProfile?.OwnerName || profile?.DisplayName || "Not available"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Business Type</p>
                                <p className="mt-1 text-sm font-medium text-gray-900">{businessProfile?.BusinessType || "Not available"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Business Status</p>
                                <div className="mt-1">
                                    <StatusBadge status={businessProfile?.ApprovalStatus ?? "pending"} />
                                </div>
                            </div>
                        </div>
                    ) : null}
                    {hasDataError ? (
                        <div className="border-t bg-amber-50 px-5 py-3 text-xs text-amber-700">
                            Some dashboard data could not be loaded. Available profile and activity information is still shown.
                        </div>
                    ) : null}
                </Card>

                <Card className="flex flex-col justify-between overflow-hidden border-[#040947]/20 bg-gradient-to-br from-white to-blue-50 p-5">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-[#040947] p-3 text-white">
                                <Smartphone className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#040947]">Mobile First</p>
                                <h2 className="text-lg font-bold text-gray-900">Use Dhune on mobile</h2>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-600">
                            Create laundry requests, compare vendor offers, accept offers, track order lifecycle, handle payments, and manage the complete booking workflow in the Dhune mobile app.
                        </p>
                    </div>
                    <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                        <Button type="button" disabled className="bg-[#040947]">
                            Download Mobile App
                        </Button>
                        <Button type="button" disabled variant="outline">
                            Continue on Mobile
                        </Button>
                        <p className="sm:col-span-2 xl:col-span-1 2xl:col-span-2 text-xs font-medium text-amber-700">
                            Coming Soon
                        </p>
                    </div>
                </Card>
            </section>

            <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
                <StatCard
                    label="Total Requests"
                    value={requestStats?.total_requests ?? 0}
                    hint="Created from your account"
                    icon={ReceiptText}
                />
                <StatCard
                    label="Active Requests"
                    value={requestStats?.open_requests ?? 0}
                    hint="Currently open"
                    icon={Shirt}
                />
                <StatCard
                    label="Total Orders"
                    value={orderStats?.total_orders ?? 0}
                    hint={`${activeOrders} active now`}
                    icon={PackageCheck}
                />
                <StatCard
                    label="Active Orders"
                    value={activeOrders}
                    hint="Accepted or in progress"
                    icon={Clock3}
                />
                <StatCard
                    label="Completed"
                    value={orderStats?.completed_orders ?? 0}
                    hint="Finished bookings"
                    icon={CalendarDays}
                />
                <StatCard
                    label="Cancelled"
                    value={orderStats?.cancelled_orders ?? 0}
                    hint="Cancelled bookings"
                    icon={CircleX}
                />
                <StatCard
                    label="Total Paid"
                    value={currency.format(totalPaid)}
                    hint="From recent paid orders"
                    icon={CreditCard}
                />
                <StatCard
                    label="Unpaid Orders"
                    value={unpaidOrders}
                    hint="From recent orders"
                    icon={CreditCard}
                />
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <RequestsPreview requests={requests} isLoading={loadingRequests || loadingRequestStats} />
                <OrdersPreview orders={orders} isLoading={loadingOrders || loadingOrderStats} />
            </section>

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <Card className="p-5 lg:col-span-2">
                    <SectionHeader title="Access Clarification" description="This web page is a lightweight overview for Dhune users" />
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                            "Request creation and vendor offer comparison are handled in the mobile app.",
                            "Order booking, full tracking, payments, and richer laundry management stay mobile-first.",
                            "This dashboard gives quick visibility into profile context, recent activity, and payment status.",
                            "Business users and normal users share this same USER overview experience.",
                        ].map((item) => (
                            <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                                {item}
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-5">
                    <SectionHeader title="Payment Snapshot" description="Simple financial summary from your orders" />
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                            <span className="text-sm text-slate-600">Recent paid total</span>
                            <span className="text-sm font-semibold text-slate-900">{currency.format(totalPaid)}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                            <span className="text-sm text-slate-600">Recent unpaid orders</span>
                            <span className="text-sm font-semibold text-slate-900">{unpaidOrders}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                            <span className="text-sm text-slate-600">Latest payment</span>
                            <span className="text-sm font-semibold text-slate-900">
                                {orders[0]?.payment_status ? humanize(orders[0].payment_status) : "Not available"}
                            </span>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
}
