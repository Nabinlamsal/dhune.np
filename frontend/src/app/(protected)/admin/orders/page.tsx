"use client"

import { useMemo, useState } from "react"

import { DataTable } from "@/src/components/dashboard/table/DataTable"

import { FilterTabs } from "@/src/components/common/FilterTabs"
import { DetailsDrawer } from "@/src/components/common/DetailsDrawer"
import { StatCard } from "@/src/components/dashboard/StatCard"
import { Status, StatusBadge } from "@/src/components/common/StatusBadge"

type OrderStatus =
    | "in_progress"
    | "delivered"
    | "completed"
    | "cancelled"
    | "disputed"

type PaymentStatus =
    | "paid"
    | "pending"
    | "refunded"

interface AdminOrder {
    id: string
    userName: string
    vendorName: string
    price: number
    paymentStatus: PaymentStatus
    status: OrderStatus
    createdAt: string

    // details
    pickupAddress: string
    deliveryAddress: string
    eta: string
    notes?: string
}

//status responce

function mapOrderStatusToBadge(status: OrderStatus): Status {
    switch (status) {
        case "in_progress":
            return "info"
        case "delivered":
            return "success"
        case "completed":
            return "success"
        case "cancelled":
            return "error"
        case "disputed":
            return "warning"
        default:
            return "neutral"
    }
}

function mapPaymentStatusToBadge(status: PaymentStatus): Status {
    switch (status) {
        case "paid":
            return "success"
        case "pending":
            return "warning"
        case "refunded":
            return "neutral"
        default:
            return "neutral"
    }
}

//static mode

const ORDERS: AdminOrder[] = [
    {
        id: "ORD-2001",
        userName: "Ramesh Shrestha",
        vendorName: "Sita Laundry",
        price: 1200,
        paymentStatus: "paid",
        status: "in_progress",
        createdAt: "2024-12-11",
        pickupAddress: "Tokha, Kathmandu",
        deliveryAddress: "Tokha, Kathmandu",
        eta: "Tomorrow evening",
    },
    {
        id: "ORD-2002",
        userName: "Everest Hostel",
        vendorName: "CleanCo Services",
        price: 5400,
        paymentStatus: "paid",
        status: "completed",
        createdAt: "2024-12-08",
        pickupAddress: "Baneshwor",
        deliveryAddress: "Baneshwor",
        eta: "Delivered",
    },
    {
        id: "ORD-2003",
        userName: "Sita Sharma",
        vendorName: "QuickWash",
        price: 900,
        paymentStatus: "pending",
        status: "cancelled",
        createdAt: "2024-12-07",
        pickupAddress: "Lalitpur",
        deliveryAddress: "Lalitpur",
        eta: "Cancelled",
        notes: "User cancelled before pickup",
    },
]

/* ---------------- page ---------------- */

export default function AdminOrdersPage() {
    const [filter, setFilter] = useState<"all" | OrderStatus>("all")
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)

    const filteredOrders =
        filter === "all"
            ? ORDERS
            : ORDERS.filter((o) => o.status === filter)

    /* ---------------- stats ---------------- */

    const stats = useMemo(() => {
        const total = ORDERS.length
        const inProgress = ORDERS.filter(o => o.status === "in_progress").length
        const completed = ORDERS.filter(o => o.status === "completed").length
        const disputed = ORDERS.filter(o => o.status === "disputed").length
        const revenue = ORDERS
            .filter(o => o.paymentStatus === "paid")
            .reduce((sum, o) => sum + o.price, 0)

        return { total, inProgress, completed, disputed, revenue }
    }, [])

    const columns = [
        { key: "id", header: "Order ID" },
        { key: "userName", header: "User" },
        { key: "vendorName", header: "Vendor" },
        {
            key: "price",
            header: "Amount",
            render: (o: AdminOrder) => `Rs. ${o.price}`,
        },
        {
            key: "paymentStatus",
            header: "Payment",
            render: (o: AdminOrder) => (
                <StatusBadge status={mapPaymentStatusToBadge(o.paymentStatus)} />
            ),
        },
        {
            key: "status",
            header: "Order Status",
            render: (o: AdminOrder) => (
                <StatusBadge status={mapOrderStatusToBadge(o.status)} />
            ),
        },
        { key: "createdAt", header: "Created" },
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
                    value={String(stats.total)}
                    trend="+—"
                    description="All orders"
                />
                <StatCard
                    title="In Progress"
                    value={String(stats.inProgress)}
                    trend="+—"
                    description="Currently active"
                />
                <StatCard
                    title="Completed"
                    value={String(stats.completed)}
                    trend="+—"
                    description="Successfully delivered"
                />
                <StatCard
                    title="Disputes"
                    value={String(stats.disputed)}
                    trend="+—"
                    description="Requires admin action"

                />
                <StatCard
                    title="Revenue"
                    value={`Rs. ${stats.revenue}`}
                    trend="+—"
                    description="Paid orders"
                />
            </div>

            {/* Filters */}
            <FilterTabs
                tabs={[
                    { label: "All", value: "all" },
                    { label: "In Progress", value: "in_progress" },
                    { label: "Delivered", value: "delivered" },
                    { label: "Completed", value: "completed" },
                    { label: "Cancelled", value: "cancelled" },
                    { label: "Disputed", value: "disputed" },
                ]}
                active={filter}
                onChange={(v) =>
                    setFilter(v as "all" | OrderStatus)
                }
            />

            {/* Table */}
            <DataTable
                columns={columns}
                data={filteredOrders}
                onRowClick={(o) => setSelectedOrder(o)}
            />

            {/* Details Drawer */}
            <DetailsDrawer
                open={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                title="Order Details"
            >
                {selectedOrder && (
                    <div className="space-y-4 text-sm">
                        <Detail label="Order ID" value={selectedOrder.id} />
                        <Detail label="User" value={selectedOrder.userName} />
                        <Detail label="Vendor" value={selectedOrder.vendorName} />
                        <Detail label="Amount" value={`Rs. ${selectedOrder.price}`} />
                        <Detail label="Payment Status" value={selectedOrder.paymentStatus} />
                        <Detail label="Order Status" value={selectedOrder.status} />
                        <Detail label="Pickup Address" value={selectedOrder.pickupAddress} />
                        <Detail label="Delivery Address" value={selectedOrder.deliveryAddress} />
                        <Detail label="ETA" value={selectedOrder.eta} />

                        {selectedOrder.notes && (
                            <Detail label="Notes" value={selectedOrder.notes} />
                        )}
                    </div>
                )}
            </DetailsDrawer>
        </>
    )
}

/* ---------------- helper ---------------- */

function Detail({
    label,
    value,
}: {
    label: string
    value?: string
}) {
    return (
        <div>
            <p className="text-gray-500">{label}</p>
            <p className="font-medium">{value ?? "—"}</p>
        </div>
    )
}
