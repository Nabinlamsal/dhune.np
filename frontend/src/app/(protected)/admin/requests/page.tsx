"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";

import { RequestSummary } from "@/src/types/orders/requests";
import { RequestStatus } from "@/src/types/orders/orders-enums";

import { Detail } from "@/src/components/common/DetailItem";
import { Status, StatusBadge } from "@/src/components/common/StatusBadge";
import { FilterTabs } from "@/src/components/common/FilterTabs";
import { DetailsDrawer } from "@/src/components/common/DetailsDrawer";
import { StatCard } from "@/src/components/dashboard/StatCard";

import {
    useAdminRequests,
    useRequestDetail,
    useAdminRequestStats,
} from "@/src/hooks/orders/useRequest";

/* ---------------- Status Mapping ---------------- */

function deriveRequestStatus(status: RequestStatus): Status {
    switch (status) {
        case "OPEN":
            return "info";

        case "ORDER_CREATED":
            return "success";

        case "EXPIRED":
            return "neutral";

        case "CANCELLED":
            return "error";

        default:
            return "neutral";
    }
}

/* ---------------- Page ---------------- */

export default function AdminRequestsPage() {

    const [statusFilter, setStatusFilter] =
        useState<"all" | RequestStatus>("all");


    const [page, setPage] = useState(0);
    const pageSize = 10;

    const [selectedRequestId, setSelectedRequestId] =
        useState<string | null>(null);


    // List
    const {
        data: listResponse,
        isLoading: isListLoading,
    } = useAdminRequests(
        statusFilter === "all" ? undefined : statusFilter,
        pageSize,
        page * pageSize
    );

    const requests: RequestSummary[] =
        listResponse?.data ?? [];

    // Detail
    const {
        data: requestDetail,
        isLoading: isDetailLoading,
    } = useRequestDetail(selectedRequestId ?? "");

    // Stats
    const {
        data: statsResponse,
        isLoading: isStatsLoading,
    } = useAdminRequestStats();

    const stats = statsResponse?.data;

    return (
        <>
            {/* ---------- Header ---------- */}

            <div className="mb-6">
                <h2 className="text-2xl font-bold">
                    Requests Management
                </h2>

                <p className="text-sm text-gray-500">
                    Monitor user service requests lifecycle
                </p>
            </div>

            {/* ---------- Stats Cards ---------- */}

            {isStatsLoading ? (
                <p className="text-sm text-gray-500 mb-6">
                    Loading request statistics...
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">

                    <StatCard
                        title="Total Requests"
                        value={String(stats?.total_requests ?? 0)}
                        description="All requests"
                        trend=""
                    />

                    <StatCard
                        title="Open"
                        value={String(stats?.open_requests ?? 0)}
                        description="Waiting for offers"
                        trend=""
                    />

                    <StatCard
                        title="Order Created"
                        value={String(stats?.order_created_requests ?? 0)}
                        description="Converted to orders"
                        trend=""
                    />

                    <StatCard
                        title="Expired"
                        value={String(stats?.expired_requests ?? 0)}
                        description="Timed out"
                        trend=""
                    />

                    <StatCard
                        title="Cancelled"
                        value={String(stats?.cancelled_requests ?? 0)}
                        description="User cancelled"
                        trend=""
                    />

                </div>
            )}

            {/*  Filters */}

            <FilterTabs
                tabs={[
                    { label: "All", value: "all" },
                    { label: "Open", value: "OPEN" },
                    { label: "Order Created", value: "ORDER_CREATED" },
                    { label: "Expired", value: "EXPIRED" },
                    { label: "Cancelled", value: "CANCELLED" },
                ]}
                active={statusFilter}
                onChange={(v) =>
                    setStatusFilter(v as "all" | RequestStatus)
                }
            />

            {/* ---------- Table ---------- */}

            <div className="mt-4 rounded-xl border overflow-hidden">

                <table className="w-full text-sm">

                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-3 text-left">Request ID</th>
                            <th className="p-3 text-left">Pickup Address</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Created</th>
                        </tr>
                    </thead>

                    <tbody>

                        {/* Loading */}
                        {isListLoading && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-6 text-center text-gray-500"
                                >
                                    Loading requests…
                                </td>
                            </tr>
                        )}

                        {/* Empty */}
                        {!isListLoading && requests.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-6 text-center text-gray-500"
                                >
                                    No requests found
                                </td>
                            </tr>
                        )}

                        {/* Rows */}
                        {!isListLoading &&
                            requests.map((r) => (
                                <tr
                                    key={r.id}
                                    className="border-t hover:bg-gray-50 cursor-pointer"
                                    onClick={() =>
                                        setSelectedRequestId(r.id)
                                    }
                                >
                                    <td className="p-3">
                                        {r.id}
                                    </td>

                                    <td className="p-3">
                                        {r.pickup_address}
                                    </td>

                                    <td className="p-3">
                                        <StatusBadge
                                            status={deriveRequestStatus(r.status)}
                                        />
                                    </td>

                                    <td className="p-3">
                                        {new Date(
                                            r.created_at
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}

                    </tbody>
                </table>

            </div>

            {/* ---------- Pagination ---------- */}

            <div className="flex justify-end gap-2 mt-4">

                <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 0}
                    onClick={() =>
                        setPage((p) => Math.max(0, p - 1))
                    }
                >
                    Previous
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    disabled={requests.length < pageSize}
                    onClick={() =>
                        setPage((p) => p + 1)
                    }
                >
                    Next
                </Button>

            </div>

            {/* ---------- Details Drawer ---------- */}

            <DetailsDrawer
                open={!!selectedRequestId}
                onClose={() => setSelectedRequestId(null)}
                title="Request Details"
            >

                {isDetailLoading && (
                    <p className="text-sm text-gray-500">
                        Loading request details…
                    </p>
                )}

                {requestDetail?.data && (
                    <div className="space-y-4 text-sm">

                        <Detail
                            label="Request ID"
                            value={requestDetail.data.id}
                        />

                        <Detail
                            label="Pickup Address"
                            value={requestDetail.data.pickup_address}
                        />
                        <Detail
                            label="Pickup Latitude"
                            value={String(requestDetail.data.pickup_lat)}
                        />
                        <Detail
                            label="Pickup Longitude"
                            value={String(requestDetail.data.pickup_lng)}
                        />

                        <Detail
                            label="Pickup From"
                            value={new Date(
                                requestDetail.data.pickup_time_from
                            ).toLocaleString()}
                        />

                        <Detail
                            label="Pickup To"
                            value={new Date(
                                requestDetail.data.pickup_time_to
                            ).toLocaleString()}
                        />

                        <Detail
                            label="Payment Method"
                            value={requestDetail.data.payment_method}
                        />

                        <Detail
                            label="Status"
                            value={requestDetail.data.status}
                        />

                        <hr />

                        <p className="font-medium">
                            Services
                        </p>

                        {requestDetail.data.services?.map((svc) => (
                            <div
                                key={svc.category_id}
                                className="border rounded-md p-3"
                            >

                                <Detail
                                    label="Category ID"
                                    value={svc.category_id}
                                />

                                <Detail
                                    label="Unit"
                                    value={svc.selected_unit}
                                />

                                <Detail
                                    label="Quantity"
                                    value={String(svc.quantity_value)}
                                />

                                {svc.description && (
                                    <Detail
                                        label="Description"
                                        value={svc.description}
                                    />
                                )}

                            </div>
                        ))}

                    </div>
                )}

            </DetailsDrawer>
        </>
    );
}
