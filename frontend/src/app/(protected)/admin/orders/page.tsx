"use client"

import { useState } from "react"

import { DataTable } from "@/src/components/dashboard/table/DataTable"
import { StatCard } from "@/src/components/dashboard/StatCard"
import { DetailsDrawer } from "@/src/components/common/DetailsDrawer"
import { FilterTabs } from "@/src/components/common/FilterTabs"
import { Status, StatusBadge } from "@/src/components/common/StatusBadge"
import { Detail } from "@/src/components/common/DetailItem"

import {
    useAdminOrders,
    useOrderStats,
    useOrderDetail,
} from "@/src/hooks/orders/useOrder"

import { OrderListItem } from "@/src/types/orders/orders"
import { OrderStatus } from "@/src/types/orders/orders-enums"


function mapOrderStatusToBadge(status: string): Status {
    switch (status) {
        case "ACCEPTED":
        case "PICKED_UP":
        case "IN_PROGRESS":
        case "DELIVERING":
            return "info"
        case "COMPLETED":
            return "success"
        case "CANCELLED":
            return "error"
        default:
            return "neutral"
    }
}

function mapPaymentStatusToBadge(status: string): Status {
    switch (status) {
        case "PAID":
            return "success"
        case "UNPAID":
            return "warning"
        case "REFUNDED":
            return "neutral"
        default:
            return "neutral"
    }
}

export default function AdminOrdersPage() {
    const [filter, setFilter] = useState<OrderStatus>("ALL")
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

    /* ---------------- API Calls ---------------- */

    const {
        data: ordersResponse,
        isLoading: isOrdersLoading,
    } = useAdminOrders(filter === "ALL" ? undefined : filter)

    const { data: statsResponse } = useOrderStats()

    const {
        data: selectedOrderResponse,
        isLoading: isDetailLoading,
    } = useOrderDetail(selectedOrderId || undefined)

    const orders = ordersResponse?.data ?? []
    const stats = statsResponse?.data
    const selectedOrder = selectedOrderResponse?.data


    const columns = [
        { key: "id", header: "Order ID" },
        {
            key: "user",
            header: "User",
            render: (o: OrderListItem) => o.user?.DisplayName ?? "—",
        },
        {
            key: "vendor",
            header: "Vendor",
            render: (o: OrderListItem) => o.vendor?.DisplayName ?? "—",
        },
        {
            key: "finalPrice",
            header: "Amount",
            render: (o: OrderListItem) => `Rs. ${o.finalPrice}`,
        },
        {
            key: "paymentStatus",
            header: "Payment",
            render: (o: OrderListItem) => (
                <StatusBadge
                    status={mapPaymentStatusToBadge(o.paymentStatus)}
                />
            ),
        },
        {
            key: "orderStatus",
            header: "Order Status",
            render: (o: OrderListItem) => (
                <StatusBadge
                    status={mapOrderStatusToBadge(o.orderStatus)}
                />
            ),
        },
        {
            key: "createdAt",
            header: "Created",
            render: (o: OrderListItem) =>
                new Date(o.createdAt).toLocaleDateString(),
        },
    ]

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Orders
                </h2>
                <p className="text-sm text-gray-500">
                    Accepted offers and service fulfillment
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <StatCard
                    title="Total Orders"
                    value={String(stats?.total_orders ?? 0)}
                    trend=""
                    description="All orders"
                />
                <StatCard
                    title="Accepted"
                    value={String(stats?.accepted_orders ?? 0)}
                    trend=""
                    description="Accepted orders"
                />
                <StatCard
                    title="In Progress"
                    value={String(stats?.in_progress_orders ?? 0)}
                    trend=""
                    description="Currently active"
                />
                <StatCard
                    title="Completed"
                    value={String(stats?.completed_orders ?? 0)}
                    trend=""
                    description="Delivered successfully"
                />
                <StatCard
                    title="Cancelled"
                    value={String(stats?.cancelled_orders ?? 0)}
                    trend=""
                    description="Cancelled orders"
                />
            </div>

            {/* Filters */}
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

            {/* Table */}
            <div className="mt-4">
                {isOrdersLoading ? (
                    <div className="text-sm text-gray-500 p-6">
                        Loading orders...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-sm text-gray-500 p-6">
                        No orders found
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={orders}
                        onRowClick={(o: OrderListItem) =>
                            setSelectedOrderId(o.id)
                        }
                    />
                )}
            </div>

            {/* Details Drawer */}
            <DetailsDrawer
                open={!!selectedOrderId}
                onClose={() => setSelectedOrderId(null)}
                title="Order Details"
            >
                {isDetailLoading && (
                    <p className="text-sm text-gray-500">
                        Loading order details...
                    </p>
                )}

                {selectedOrder && (
                    <div className="space-y-4 text-sm">
                        <Detail label="Order ID" value={selectedOrder.id} />
                        <Detail label="User" value={selectedOrder.user?.DisplayName} />
                        <Detail label="Vendor" value={selectedOrder.vendor?.DisplayName} />
                        <Detail
                            label="Amount"
                            value={`Rs. ${selectedOrder.finalPrice}`}
                        />
                        <Detail
                            label="Payment Status"
                            value={selectedOrder.paymentStatus}
                        />
                        <Detail
                            label="Order Status"
                            value={selectedOrder.orderStatus}
                        />
                        <Detail
                            label="Pickup Time"
                            value={selectedOrder.pickupTime}
                        />
                        <Detail
                            label="Created At"
                            value={new Date(
                                selectedOrder.createdAt
                            ).toLocaleString()}
                        />
                    </div>
                )}
            </DetailsDrawer>
        </>
    )
}