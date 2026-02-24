"use client";

import { useState } from "react";

import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { DetailsDrawer } from "@/src/components/common/DetailsDrawer";
import { FilterTabs } from "@/src/components/common/FilterTabs";
import { StatusBadge, Status } from "@/src/components/common/StatusBadge";
import { Detail } from "@/src/components/common/DetailItem";
import { Button } from "@/src/components/ui/button";

import {
    useVendorOrders,
    useUpdateOrderStatus,
    useOrderDetail,
} from "@/src/hooks/orders/useOrder";

import {
    OrderListItem,
    UpdateOrderStatusPayload,
} from "@/src/types/orders/orders";

import { OrderStatus } from "@/src/types/orders/orders-enums";

function mapOrderStatusToBadge(status: string): Status {
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

export default function VendorOrdersPage() {
    const [filter, setFilter] = useState<OrderStatus>("ALL");
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const {
        data: orders,
        isLoading,
    } = useVendorOrders({
        status: filter === "ALL" ? undefined : filter,
    });

    const { mutate: updateStatus } = useUpdateOrderStatus();

    const {
        data: detailResponse,
        isLoading: isDetailLoading,
    } = useOrderDetail(selectedOrderId || undefined);

    const detail = detailResponse?.data;

    const handleNextStatus = (order: OrderListItem) => {
        let next: OrderStatus | null = null;

        switch (order.order_status) {
            case "ACCEPTED":
                next = "PICKED_UP";
                break;
            case "PICKED_UP":
                next = "IN_PROGRESS";
                break;
            case "IN_PROGRESS":
                next = "DELIVERING";
                break;
            case "DELIVERING":
                next = "COMPLETED";
                break;
        }

        if (!next) return;

        const payload: UpdateOrderStatusPayload = { status: next };

        updateStatus({
            orderId: order.id,
            payload,
        });
    };

    const columns = [
        {
            key: "id",
            header: "Order ID",
            render: (o: OrderListItem) =>
                o.id.slice(0, 8) + "...",
        },
        {
            key: "request_id",
            header: "Request",
            render: (o: OrderListItem) =>
                o.request_id.slice(0, 8) + "...",
        },
        {
            key: "amount",
            header: "Amount",
            render: (o: OrderListItem) =>
                `Rs. ${o.final_price}`,
        },
        {
            key: "payment_status",
            header: "Payment",
            render: (o: OrderListItem) => (
                <StatusBadge
                    status={
                        o.payment_status === "PAID"
                            ? "success"
                            : o.payment_status === "UNPAID"
                                ? "warning"
                                : "neutral"
                    }
                />
            ),
        },
        {
            key: "order_status",
            header: "Status",
            render: (o: OrderListItem) => (
                <StatusBadge
                    status={mapOrderStatusToBadge(o.order_status)}
                />
            ),
        },
        {
            key: "created_at",
            header: "Created",
            render: (o: OrderListItem) =>
                new Date(o.created_at).toLocaleDateString(),
        },
        {
            key: "actions",
            header: "Action",
            render: (o: OrderListItem) => {
                const canProgress =
                    !["COMPLETED", "CANCELLED"].includes(
                        o.order_status
                    );

                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                setSelectedOrderId(o.id)
                            }
                        >
                            View
                        </Button>

                        {canProgress && (
                            <Button
                                size="sm"
                                onClick={() =>
                                    handleNextStatus(o)
                                }
                            >
                                Next Step
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    My Orders
                </h2>
                <p className="text-sm text-gray-500">
                    Manage your active and completed orders
                </p>
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
                        Loading details...
                    </p>
                )}

                {detail && (
                    <div className="space-y-4 text-sm">
                        <Detail
                            label="Order ID"
                            value={detail.order.id}
                        />
                        <Detail
                            label="Amount"
                            value={`Rs. ${detail.order.final_price}`}
                        />
                        <Detail
                            label="Order Status"
                            value={detail.order.order_status}
                        />
                        <Detail
                            label="Payment Status"
                            value={detail.order.payment_status}
                        />
                        <Detail
                            label="Customer"
                            value={
                                detail.user?.DisplayName
                            }
                        />
                        <Detail
                            label="Pickup Address"
                            value={
                                detail.request
                                    ?.pickup_address
                            }
                        />
                        <Detail
                            label="Pickup Window"
                            value={`${new Date(
                                detail.request.pickup_time_from
                            ).toLocaleString()} - ${new Date(
                                detail.request.pickup_time_to
                            ).toLocaleString()}`}
                        />
                    </div>
                )}
            </DetailsDrawer>
        </>
    );
}