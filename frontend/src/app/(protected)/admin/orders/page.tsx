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

import { OrderListItem } from "@/src/types/orders/orders";
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


    const {
        data: orders,
        isLoading,
    } = useAdminOrders(
        filter === "ALL" ? undefined : filter
    );


    const { data: stats } = useAdminOrderStats();


    const {
        data: orderDetail,
        isLoading: detailLoading,
    } = useOrderDetail(selectedOrderId ?? undefined);



    const columns = [

        {
            key: "id",
            header: "Order",
            render: (o: OrderListItem) =>
                o.id.slice(0, 8) + "...",
        },

        {
            key: "user",
            header: "Customer",
            render: (o: OrderListItem) =>
                o.user_name ?? "—",
        },

        {
            key: "vendor",
            header: "Vendor",
            render: (o: OrderListItem) =>
                o.vendor_name ?? "—",
        },

        {
            key: "amount",
            header: "Amount",
            render: (o: OrderListItem) =>
                `Rs. ${o.final_price}`,
        },

        {
            key: "payment",
            header: "Payment",
            render: (o: OrderListItem) => (
                <StatusBadge
                    status={mapPaymentStatus(o.payment_status)}
                />
            ),
        },

        {
            key: "status",
            header: "Order Status",
            render: (o: OrderListItem) => (
                <StatusBadge
                    status={mapOrderStatus(o.order_status)}
                />
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
            {/* Header */}

            <div className="mb-6">

                <h2 className="text-2xl font-bold">
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
                onChange={(v) =>
                    setFilter(v as OrderStatus)
                }
            />



            {/* Table */}

            <div className="mt-4">

                {isLoading ? (

                    <div className="p-6 text-sm text-gray-500">
                        Loading orders...
                    </div>

                ) : !orders || orders.length === 0 ? (

                    <div className="p-6 text-sm text-gray-500">
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



            {/* Drawer */}

            <DetailsDrawer
                open={!!selectedOrderId}
                onClose={() => setSelectedOrderId(null)}
                title="Order Details"
            >

                {detailLoading && (
                    <p className="text-sm text-gray-500">
                        Loading details...
                    </p>
                )}


                {orderDetail?.data && (

                    <div className="space-y-6 text-sm">


                        {/* Order */}

                        <div className="space-y-3">

                            <h4 className="font-semibold border-b pb-2">
                                Order Information
                            </h4>

                            <Detail label="Order ID" value={orderDetail.data.id} />

                            <Detail
                                label="Amount"
                                value={`Rs. ${orderDetail.data.final_price}`}
                            />

                            <Detail
                                label="Order Status"
                                value={orderDetail.data.order_status}
                            />

                            <Detail
                                label="Payment Status"
                                value={orderDetail.data.payment_status}
                            />

                            <Detail
                                label="Created"
                                value={new Date(orderDetail.data.created_at).toLocaleString()}
                            />

                        </div>



                        {/* Customer */}

                        <div className="pt-4 border-t space-y-3">

                            <h4 className="font-semibold border-b pb-2">
                                Customer
                            </h4>

                            <Detail label="Name" value={orderDetail.data.user.name} />
                            <Detail label="Email" value={orderDetail.data.user.email} />
                            <Detail label="Phone" value={orderDetail.data.user.phone} />

                        </div>



                        {/* Vendor */}

                        <div className="pt-4 border-t space-y-3">

                            <h4 className="font-semibold border-b pb-2">
                                Vendor
                            </h4>

                            <Detail label="Name" value={orderDetail.data.vendor.name} />
                            <Detail label="Email" value={orderDetail.data.vendor.email} />
                            <Detail label="Phone" value={orderDetail.data.vendor.phone} />
                        </div>



                        {/* Pickup */}

                        <div className="pt-4 border-t space-y-3">

                            <h4 className="font-semibold border-b pb-2">
                                Pickup Details
                            </h4>

                            <Detail
                                label="Address"
                                value={orderDetail.data.request.pickup_address}
                            />

                            <Detail
                                label="Pickup Window"
                                value={`${new Date(orderDetail.data.request.pickup_time_from).toLocaleString()} - ${new Date(orderDetail.data.request.pickup_time_to).toLocaleString()}`}
                            />

                        </div>



                        {/* Services */}

                        <div className="pt-4 border-t">

                            <h4 className="font-semibold mb-2">
                                Services
                            </h4>

                            {orderDetail.data.services.map((s: any, i: number) => (
                                <div key={i} className="text-gray-600 text-sm">
                                    {s.category_name} — {s.quantity_value} {s.selected_unit}
                                </div>
                            ))}

                        </div>


                    </div>

                )}

            </DetailsDrawer>

        </>
    );
}