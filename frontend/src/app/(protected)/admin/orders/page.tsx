"use client";

import { useState } from "react";

import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { StatCard } from "@/src/components/dashboard/StatCard";
import { DetailsDrawer } from "@/src/components/common/DetailsDrawer";
import { FilterTabs } from "@/src/components/common/FilterTabs";
import { StatusBadge, Status } from "@/src/components/common/StatusBadge";
import { Detail } from "@/src/components/common/DetailItem";

import {
    useAdminOrders,
    useOrderDetail,
    useAdminOrderStats,
} from "@/src/hooks/orders/useOrder";

import { OrderDetailResponse, OrderListItem } from "@/src/types/orders/orders";
import { OrderStatus } from "@/src/types/orders/orders-enums";

function mapOrderStatus(status: string): Status {
    switch (status) {
        case "ACCEPTED":
        case "PICKED_UP":
        case "IN_PROGRESS":
        case "DELIVERING":
            return "info";
        case "COMPLETED":
            return "success";
        case "CANCELLED":
            return "error";
        default:
            return "neutral";
    }
}

function mapPaymentStatus(status: string): Status {
    switch (status) {
        case "PAID":
            return "success";
        case "UNPAID":
            return "warning";
        case "REFUNDED":
            return "neutral";
        default:
            return "neutral";
    }
}

export default function AdminOrdersPage() {
    const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const { data: orders, isLoading } = useAdminOrders(
        filter === "ALL" ? undefined : filter
    );

    const { data: stats } = useAdminOrderStats();

    const {
        data: orderDetail,
        isLoading: detailLoading,
    } = useOrderDetail(selectedOrderId ?? undefined);

    const detail: OrderDetailResponse | undefined = orderDetail;

    const columns = [
        {
            key: "id",
            header: "Order",
            render: (o: OrderListItem) => o.id.slice(0, 8) + "...",
        },
        {
            key: "user",
            header: "Customer",
            render: (o: OrderListItem) => o.user_name ?? "-",
        },
        {
            key: "vendor",
            header: "Vendor",
            render: (o: OrderListItem) => o.vendor_name ?? "-",
        },
        {
            key: "amount",
            header: "Amount",
            render: (o: OrderListItem) => `Rs. ${o.final_price}`,
        },
        {
            key: "payment",
            header: "Payment",
            render: (o: OrderListItem) => (
                <StatusBadge status={mapPaymentStatus(o.payment_status)} />
            ),
        },
        {
            key: "status",
            header: "Order Status",
            render: (o: OrderListItem) => (
                <StatusBadge status={mapOrderStatus(o.order_status)} />
            ),
        },
        {
            key: "created",
            header: "Created",
            render: (o: OrderListItem) =>
                new Date(o.created_at).toLocaleDateString(),
        },
    ];

    return (
        <>
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Orders</h2>
                <p className="text-sm text-gray-500">
                    Accepted offers and service fulfillment
                </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-5">
                <StatCard
                    title="Total Orders"
                    value={String(stats?.data.total_orders ?? 0)}
                    trend=""
                    description="All orders"
                />
                <StatCard
                    title="Accepted"
                    value={String(stats?.data.accepted_orders ?? 0)}
                    trend=""
                    description="Accepted orders"
                />
                <StatCard
                    title="In Progress"
                    value={String(stats?.data.in_progress_orders ?? 0)}
                    trend=""
                    description="Currently active"
                />
                <StatCard
                    title="Completed"
                    value={String(stats?.data.completed_orders ?? 0)}
                    trend=""
                    description="Delivered successfully"
                />
                <StatCard
                    title="Cancelled"
                    value={String(stats?.data.cancelled_orders ?? 0)}
                    trend=""
                    description="Cancelled orders"
                />
            </div>

            <FilterTabs
                tabs={[
                    { label: "All", value: "ALL" },
                    { label: "Accepted", value: "ACCEPTED" },
                    { label: "Picked Up", value: "PICKED_UP" },
                    { label: "In Progress", value: "IN_PROGRESS" },
                    { label: "Delivering", value: "DELIVERING" },
                    { label: "Completed", value: "COMPLETED" },
                    { label: "Cancelled", value: "CANCELLED" },
                ]}
                active={filter}
                onChange={(v) => setFilter(v as OrderStatus)}
            />

            <div className="mt-4">
                {isLoading ? (
                    <div className="p-6 text-sm text-gray-500">Loading orders...</div>
                ) : !orders || orders.length === 0 ? (
                    <div className="p-6 text-sm text-gray-500">No orders found</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={orders}
                        onRowClick={(o: OrderListItem) => setSelectedOrderId(o.id)}
                    />
                )}
            </div>

            <DetailsDrawer
                open={!!selectedOrderId}
                onClose={() => setSelectedOrderId(null)}
                title="Order Details"
            >
                {detailLoading && (
                    <p className="text-sm text-gray-500">Loading details...</p>
                )}

                {!detailLoading && !detail && (
                    <p className="text-sm text-gray-500">Unable to load order details.</p>
                )}

                {detail && (
                    <div className="space-y-6 text-sm">
                        <div className="space-y-3">
                            <h4 className="border-b pb-2 font-semibold">Order Information</h4>
                            <Detail label="Order ID" value={detail.id} />
                            <Detail label="Request ID" value={detail.request_id} />
                            <Detail label="Amount" value={`Rs. ${detail.final_price}`} />
                            <Detail label="Order Status" value={detail.order_status} />
                            <Detail label="Payment Status" value={detail.payment_status} />
                            <Detail
                                label="Created"
                                value={new Date(detail.created_at).toLocaleString()}
                            />
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <h4 className="border-b pb-2 font-semibold">Customer</h4>
                            <Detail label="Name" value={detail.user?.name} />
                            <Detail label="Email" value={detail.user?.email} />
                            <Detail label="Phone" value={detail.user?.phone} />
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <h4 className="border-b pb-2 font-semibold">Vendor</h4>
                            <Detail label="Name" value={detail.vendor?.name} />
                            <Detail label="Email" value={detail.vendor?.email} />
                            <Detail label="Phone" value={detail.vendor?.phone} />
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <h4 className="border-b pb-2 font-semibold">Pickup Details</h4>
                            <Detail label="Address" value={detail.request?.pickup_address} />
                            <Detail
                                label="Latitude"
                                value={
                                    detail.request?.pickup_lat !== undefined
                                        ? String(detail.request.pickup_lat)
                                        : undefined
                                }
                            />
                            <Detail
                                label="Longitude"
                                value={
                                    detail.request?.pickup_lng !== undefined
                                        ? String(detail.request.pickup_lng)
                                        : undefined
                                }
                            />
                            <Detail
                                label="Pickup Window"
                                value={
                                    detail.request?.pickup_time_from && detail.request?.pickup_time_to
                                        ? `${new Date(detail.request.pickup_time_from).toLocaleString()} - ${new Date(detail.request.pickup_time_to).toLocaleString()}`
                                        : undefined
                                }
                            />
                            <Detail
                                label="Payment Method"
                                value={detail.request?.payment_method}
                            />
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="mb-2 font-semibold">Services</h4>
                            {detail.services?.length ? (
                                detail.services.map((s, i) => (
                                    <div key={`${s.category_id}-${i}`} className="text-sm text-gray-600">
                                        {s.category_name} - {s.quantity_value} {s.selected_unit}
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-500">No services listed.</p>
                            )}
                        </div>
                    </div>
                )}
            </DetailsDrawer>
        </>
    );
}
