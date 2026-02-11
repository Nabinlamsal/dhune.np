"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { DataTable } from "@/src/components/dashboard/table/DataTable";

import { AdminUserSummary } from "@/src/types/users/admin-user-summary";
import { AdminUserFilterStatus } from "@/src/types/users/user.enums";

import { StatusBadge } from "@/src/components/common/StatusBadge";
import { FilterTabs } from "@/src/components/common/FilterTabs";
import { SearchInput } from "@/src/components/ui/search-input";
import { useGetUsersFiltered } from "@/src/hooks/users/useAdminUsers";
import { Role } from "@/src/types/auth/identity";

/* ---------- helper ---------- */

function deriveVendorStatus(
    u: AdminUserSummary
): AdminUserFilterStatus {
    if (!u.IsActive) return "suspended";
    return u.VendorApprovalStatus ?? "pending";
}

/* ---------- page ---------- */

export default function AdminVendorsPage() {
    const router = useRouter();

    const [statusFilter, setStatusFilter] =
        useState<"all" | AdminUserFilterStatus>("all");

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);
    const pageSize = 10;
    const roles: Role[] = ["vendor"];

    const filter = {
        roles,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: search || undefined,
        limit: pageSize,
        offset: page * pageSize,
    };

    const { data: vendors = [], isLoading } =
        useGetUsersFiltered(filter);

    const columns = [
        { key: "DisplayName", header: "Vendor Name" },
        { key: "Email", header: "Email" },
        { key: "Phone", header: "Phone" },
        {
            key: "status",
            header: "Status",
            render: (vendor: AdminUserSummary) => {
                const status = deriveVendorStatus(vendor);
                return <StatusBadge status={status} />;
            },
        },
        {
            key: "CreatedAt",
            header: "Joined",
            render: (vendor: AdminUserSummary) =>
                new Date(vendor.CreatedAt).toLocaleDateString(),
        },
    ];

    return (
        <>
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold">
                    Vendors Management
                </h2>
                <p className="text-sm text-gray-500">
                    Manage vendor accounts
                </p>
            </div>

            {/* Filters Row */}
            <div className="flex items-center justify-between gap-6">
                <FilterTabs
                    tabs={[
                        { label: "All", value: "all" },
                        { label: "Pending", value: "pending" },
                        { label: "Approved", value: "approved" },
                        { label: "Rejected", value: "rejected" },
                        { label: "Suspended", value: "suspended" },
                    ]}
                    active={statusFilter}
                    onChange={(v) =>
                        setStatusFilter(
                            v as "all" | AdminUserFilterStatus
                        )
                    }
                />

                <SearchInput
                    placeholder="Search vendors..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />
            </div>

            {/* Table */}
            <div className="mt-4">
                {isLoading ? (
                    <p className="text-sm text-gray-500">
                        Loading vendors…
                    </p>
                ) : vendors.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No vendors found
                    </p>
                ) : (
                    <DataTable
                        columns={columns}
                        data={vendors}
                        onRowClick={(vendor) =>
                            router.push(
                                `/admin/vendors/${vendor.ID}`
                            )
                        }
                    />
                )}
            </div>

            {/* Pagination */}
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
                    disabled={vendors.length < pageSize}
                    onClick={() =>
                        setPage((p) => p + 1)
                    }
                >
                    Next
                </Button>
            </div>
        </>
    );
}