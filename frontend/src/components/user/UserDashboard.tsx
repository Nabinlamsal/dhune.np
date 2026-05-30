"use client";

import {
    ArrowRight,
    BellRing,
    CheckCircle2,
    Download,
    Languages,
    LogOut,
    Moon,
    PackageCheck,
    ReceiptText,
    Shirt,
    Smartphone,
    Store,
    Sun,
    WalletCards,
    Clock3,
    type LucideIcon,
} from "lucide-react";
import Image from "next/image";
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

const mobileFeatures = [
    "Create laundry requests",
    "Compare vendor offers",
    "Accept best offers",
    "Full request to order flow",
    "Live order tracking",
    "Payment handling",
    "Khalti integration",
    "Cash payment",
    "Real-time notifications",
    "Dark mode support",
    "Light mode support",
    "Nepali language support",
    "English language support",
    "Better booking experience",
    "Mobile-first UX",
    "Faster workflow than web",
];

function AndroidIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 8.5h10v7.25a2.75 2.75 0 0 1-2.75 2.75h-4.5A2.75 2.75 0 0 1 7 15.75V8.5Z" fill="currentColor" />
            <path d="M8.25 7.25a3.75 3.75 0 0 1 7.5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M5 9.75v4.5M19 9.75v4.5M9 4.5 7.75 2.75M15 4.5l1.25-1.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M10 10.75h.01M14 10.75h.01" stroke="#040947" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
    );
}

function StatCard({
    label,
    value,
    hint,
    icon: Icon,
}: {
    label: string;
    value: string | number;
    hint: string;
    icon: LucideIcon;
}) {
    return (
        <div className="rounded-xl border border-white/60 bg-white/85 p-4 shadow-sm ring-1 ring-[#040947]/5 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-extrabold text-[#040947]">{value}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">{hint}</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-[#040947] to-[#111b74] p-2.5 text-[#ebbc01] shadow-sm">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function EmptyPreview({ message }: { message: string }) {
    return (
        <div className="rounded-xl border border-dashed border-[#040947]/15 bg-[#040947]/[0.03] px-4 py-8 text-center text-sm font-medium text-slate-500">
            {message}
        </div>
    );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
    return (
        <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
    );
}

function RequestsPreview({ requests, isLoading }: { requests: RequestSummary[]; isLoading: boolean }) {
    return (
        <Card className="overflow-hidden border-slate-200/80 p-5 shadow-sm">
            <SectionHeader title="Recent Requests" description="Read-only preview of your latest laundry requests" />
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                {isLoading ? (
                    <p className="p-4 text-sm text-gray-500">Loading recent requests...</p>
                ) : requests.length === 0 ? (
                    <EmptyPreview message="No laundry requests found yet. Create and manage requests from the Dhune mobile app." />
                ) : (
                    <table className="w-full min-w-[680px] text-left text-sm">
                        <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Request</th>
                                <th className="px-4 py-3 font-semibold">Service</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Created</th>
                                <th className="px-4 py-3 font-semibold">Location</th>
                                <th className="px-4 py-3 font-semibold">Responses</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {requests.map((request) => (
                                <tr key={request.id} className="text-gray-700 transition hover:bg-slate-50/80">
                                    <td className="px-4 py-3 font-semibold text-gray-900">Request #{request.id.slice(0, 8)}</td>
                                    <td className="px-4 py-3">Laundry request</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={requestStatusTone(request.status)} label={humanize(request.status)} />
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(request.created_at)}</td>
                                    <td className="max-w-[220px] truncate px-4 py-3">{request.pickup_address || "Not available"}</td>
                                    <td className="px-4 py-3 text-gray-500">Mobile app</td>
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
        <Card className="overflow-hidden border-slate-200/80 p-5 shadow-sm">
            <SectionHeader title="Recent Orders" description="Latest order progress and payment visibility" />
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                {isLoading ? (
                    <p className="p-4 text-sm text-gray-500">Loading recent orders...</p>
                ) : orders.length === 0 ? (
                    <EmptyPreview message="No orders found yet. Accept offers and track bookings from the Dhune mobile app." />
                ) : (
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Order</th>
                                <th className="px-4 py-3 font-semibold">Vendor</th>
                                <th className="px-4 py-3 font-semibold">Order Status</th>
                                <th className="px-4 py-3 font-semibold">Payment</th>
                                <th className="px-4 py-3 font-semibold">Amount</th>
                                <th className="px-4 py-3 font-semibold">Created</th>
                                <th className="px-4 py-3 font-semibold">Completion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {orders.map((order) => (
                                <tr key={order.id} className="text-gray-700 transition hover:bg-slate-50/80">
                                    <td className="px-4 py-3 font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</td>
                                    <td className="px-4 py-3">{order.vendor_name || "Vendor pending"}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={orderStatusTone(order.order_status)} label={humanize(order.order_status)} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={paymentStatusTone(order.payment_status)} label={humanize(order.payment_status)} />
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{currency.format(order.final_price ?? 0)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(order.created_at)}</td>
                                    <td className="px-4 py-3 text-gray-500">{order.order_status === "COMPLETED" ? "Completed" : "Pending"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
}

function MobileAppHero() {
    const highlights: { label: string; icon: LucideIcon }[] = [
        { label: "Request flow", icon: Shirt },
        { label: "Offer comparison", icon: Store },
        { label: "Live tracking", icon: BellRing },
        { label: "Khalti and cash", icon: WalletCards },
        { label: "Light and dark", icon: Sun },
        { label: "NP / EN", icon: Languages },
    ];

    return (
        <Card className="overflow-hidden border-[#040947]/20 bg-[#040947] text-white shadow-xl">
            <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#ebbc01]/30 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#ebbc01]">
                        <AndroidIcon className="h-4 w-4" />
                        Android app
                    </div>
                    <div>
                        <h2 className="max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
                            Complete your Dhune booking flow on mobile.
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                            The web dashboard stays focused on overview. The mobile app is where requests, offers, orders,
                            tracking, payments, notifications, and language preferences come together.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button type="button" disabled className="h-11 bg-[#ebbc01] px-5 font-bold text-[#040947] shadow-lg shadow-black/20 hover:bg-[#f2c935]">
                            <Download className="h-4 w-4" />
                            Download Android Application
                        </Button>
                        <Button type="button" disabled variant="outline" className="h-11 border-white/25 bg-white/10 px-5 font-semibold text-white hover:bg-white hover:text-[#040947]">
                            Continue on Mobile
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {highlights.map(({ label, icon: Icon }) => (
                            <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white/95">
                                <Icon className="h-4 w-4 text-[#ebbc01]" />
                                {label}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative min-h-[340px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:min-h-[420px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(235,188,1,0.28),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.22),transparent_34%)]" />
                    <Image
                        src="/light-2.png"
                        alt="Dhune mobile request screen"
                        width={260}
                        height={520}
                        className="absolute left-2 top-14 w-[145px] rotate-[-10deg] rounded-2xl shadow-2xl sm:left-8 sm:w-[185px]"
                    />
                    <Image
                        src="/light-1.png"
                        alt="Dhune mobile home screen"
                        width={300}
                        height={600}
                        priority
                        className="absolute left-1/2 top-4 z-20 w-[170px] -translate-x-1/2 rounded-2xl shadow-2xl sm:w-[220px]"
                    />
                    <Image
                        src="/light-4.png"
                        alt="Dhune mobile order tracking screen"
                        width={260}
                        height={520}
                        className="absolute right-2 top-20 w-[145px] rotate-[10deg] rounded-2xl shadow-2xl sm:right-8 sm:w-[185px]"
                    />
                    <div className="absolute bottom-4 left-4 right-4 z-30 rounded-2xl border border-white/15 bg-[#040947]/85 p-3 shadow-xl backdrop-blur">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#ebbc01]">Mobile-first UX</p>
                                <p className="text-sm font-bold text-white">Faster workflow than web</p>
                            </div>
                            <Moon className="h-5 w-5 text-blue-100" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 bg-white/[0.04] p-5 sm:p-6">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {mobileFeatures.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-50">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#ebbc01]" />
                            {feature}
                        </div>
                    ))}
                </div>
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
    const activeOrders =
        (orderStats?.accepted_orders ?? 0) +
        (orderStats?.picked_up_orders ?? 0) +
        (orderStats?.in_progress_orders ?? 0) +
        (orderStats?.delivering_orders ?? 0);
    const hasDataError = profileError || requestsError || requestStatsError || ordersError || orderStatsError;

    return (
        <div className="space-y-6">
            <section>
                <Card className="overflow-hidden border-[#040947]/10 shadow-sm">
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
                                variant="destructive"
                                className="border border-red-300/30 bg-red-600 text-white shadow-lg shadow-black/10 hover:bg-red-700"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-4 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p className="text-xs font-medium text-gray-500">Name</p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">
                                {loadingProfile ? "Loading..." : profile?.DisplayName || me?.display_name || "Dhune User"}
                            </p>
                        </div>
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
                    </div>
                    {hasDataError ? (
                        <div className="border-t bg-amber-50 px-5 py-3 text-xs text-amber-700">
                            Some dashboard data could not be loaded. Available profile and activity information is still shown.
                        </div>
                    ) : null}
                </Card>
            </section>

            <section>
                <MobileAppHero />
            </section>

            <section>
                <Card className="overflow-hidden border-[#040947]/10 bg-gradient-to-br from-[#f8fafc] via-white to-[#fff8dc] p-5 shadow-sm">
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-[#040947]">Activity Overview</p>
                            <h2 className="text-xl font-extrabold text-gray-900">Your Dhune activity</h2>
                        </div>
                        <p className="text-sm font-medium text-slate-500">Lightweight user summary</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
                    </div>
                </Card>
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <RequestsPreview requests={requests} isLoading={loadingRequests || loadingRequestStats} />
                <OrdersPreview orders={orders} isLoading={loadingOrders || loadingOrderStats} />
            </section>

            <section>
                <Card className="border-[#040947]/10 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-[#040947]/10 p-2 text-[#040947]">
                                <Smartphone className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-900">Web overview, mobile completion</h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    Use this page for quick visibility. Create requests, compare offers, track orders, and handle payments in the mobile app.
                                </p>
                            </div>
                        </div>
                        <span className="rounded-full bg-[#ebbc01]/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#040947]">
                            Mobile-first
                        </span>
                    </div>
                </Card>
            </section>
        </div>
    );
}
