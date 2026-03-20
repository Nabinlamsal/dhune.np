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

import { OrderListItem } from "@/src/types/orders/orders";
import { OrderStatus } from "@/src/types/orders/orders-enums";
import { ClipboardList, ShoppingBag, UserRound } from "lucide-react";
import { formatDisplayId, formatPickupDuration } from "@/src/utils/display";

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

function getNextStatus(status: OrderStatus): OrderStatus | null {
    switch (status) {
        case "ACCEPTED":
            return "PICKED_UP";
        case "PICKED_UP":
            return "IN_PROGRESS";
        case "IN_PROGRESS":
            return "DELIVERING";
        case "DELIVERING":
            return "COMPLETED";
        default:
            return null;
    }
}

function getNextButtonLabel(status: OrderStatus) {
    switch (status) {
        case "ACCEPTED":
            return "Mark Picked Up";
        case "PICKED_UP":
            return "Start Processing";
        case "IN_PROGRESS":
            return "Start Delivery";
        case "DELIVERING":
            return "Mark Completed";
        default:
            return null;
    }
}

export default function VendorOrdersPage() {

    const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const { data: orders, isLoading } = useVendorOrders({
        status: filter === "ALL" ? undefined : filter,
    });

    const { mutate: updateStatus } = useUpdateOrderStatus();

    const { data: detail, isLoading: isDetailLoading } =
        useOrderDetail(selectedOrderId ?? undefined);

    const columns = [

        {
            key: "id",
            header: "Order",
            render: (o: OrderListItem) => formatDisplayId(o.id, "ORD"),
        },

        {
            key: "customer",
            header: "Customer",
            render: (o: OrderListItem) =>
                o.user_name ?? "-",
        },

        {
            key: "amount",
            header: "Amount",
            render: (o: OrderListItem) =>
                `Rs. ${o.final_price}`,
        },

        {
            key: "status",
            header: "Order Status",
            render: (o: OrderListItem) => (
                <StatusBadge
                    status={mapOrderStatusToBadge(o.order_status)}
                    label={o.order_status}
                />
            ),
        },

        {
            key: "payment",
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
                    label={o.payment_status}
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
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Vendor Orders
                </h2>
                <p className="text-sm text-gray-500">
                    Manage laundry orders and update their progress
                </p>
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
                onChange={(v) =>
                    setFilter(v as OrderStatus)
                }
            />

            <div className="mt-4">

                {isLoading ? (
                    <div className="p-6 text-sm text-gray-500">
                        Loading orders...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={orders ?? []}
                        onRowClick={(o: OrderListItem) =>
                            setSelectedOrderId(o.id)
                        }
                    />
                )}

            </div>

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

                    <div className="space-y-3 text-sm">
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                                <h3 className="flex items-center gap-2 text-base font-semibold border-b border-[#040947]/15 pb-2 text-slate-900">
                                    <ClipboardList className="size-4 text-[#040947]" />
                                    Order Information
                                </h3>
                                <Detail label="Order ID" value={detail.id} />
                                <Detail label="Amount" value={`Rs. ${detail.final_price}`} />
                                <Detail label="Order Status" value={detail.order_status} />
                                <Detail label="Payment Status" value={detail.payment_status} />
                            </div>

                            <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                                <h3 className="flex items-center gap-2 text-base font-semibold border-b border-[#040947]/15 pb-2 text-slate-900">
                                    <ClipboardList className="size-4 text-[#040947]" />
                                    Pickup Details
                                </h3>
                                <Detail label="Pickup Address" value={detail.request.pickup_address} />
                                <Detail label="Pickup Latitude" value={String(detail.request.pickup_lat)} />
                                <Detail label="Pickup Longitude" value={String(detail.request.pickup_lng)} />
                                <Detail
                                    label="Pickup Duration"
                                    value={formatPickupDuration(detail.request.pickup_time_from, detail.request.pickup_time_to)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 rounded-xl border border-[#040947]/15 bg-white p-3">
                            <h3 className="flex items-center gap-2 text-base font-semibold border-b border-[#040947]/15 pb-2 text-slate-900">
                                <UserRound className="size-4 text-[#040947]" />
                                Customer Details
                            </h3>
                            <Detail label="Name" value={detail.user.name} />
                            <Detail label="Email" value={detail.user.email} />
                        </div>

                        <div className="pt-3 border-t border-[#040947]/15">
                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-slate-900">
                                <ShoppingBag className="size-4 text-[#040947]" />
                                Services
                            </h4>

                            {detail.services.map((s, i) => (
                                <div key={i}>
                                    {s.category_name} — {s.quantity_value} {s.selected_unit}
                                </div>
                            ))}
                        </div>

                        {getNextButtonLabel(detail.order_status) && (

                            <div className="pt-6 border-t">

                                <Button
                                    className="bg-[#040947] hover:bg-[#030736]"
                                    onClick={() =>
                                        updateStatus({
                                            orderId: detail.id,
                                            payload: {
                                                status: getNextStatus(detail.order_status)!,
                                            },
                                        })
                                    }
                                >
                                    {getNextButtonLabel(detail.order_status)}
                                </Button>

                            </div>

                        )}

                    </div>

                )}

            </DetailsDrawer>
        </>
    );
}

