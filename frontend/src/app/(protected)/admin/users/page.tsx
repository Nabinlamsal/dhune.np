"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";

import { AdminUserSummary } from "@/src/types/users/admin-user-summary";
import { AdminUserFilterStatus } from "@/src/types/users/user.enums";
import { Role } from "@/src/types/auth/identity";

import { useGetUserProfile, useGetUsersFiltered } from "@/src/hooks/users/useAdminUsers";
import { useBusinessApprove, useBusinessReject, useReactivateUser, useSuspendUser } from "@/src/hooks/users/useUserCommand";
import { Detail } from "@/src/components/common/DetailItem";
import { StatusBadge } from "@/src/components/common/StatusBadge";
import { FilterTabs } from "@/src/components/common/FilterTabs";
import { DetailsDrawer } from "@/src/components/common/DetailsDrawer";
import { SearchInput } from "@/src/components/ui/search-input";

//helper
function deriveUserStatus(
    u: AdminUserSummary
): AdminUserFilterStatus {
    // suspension overrides everything
    if (!u.IsActive) return "suspended";
    if (u.Role === "business") {
        return u.BusinessApprovalStatus ?? "pending";
    }

    if (u.Role === "vendor") {
        return u.VendorApprovalStatus ?? "pending";
    }

    // normal user (auto-approved)
    return "approved";
}

//page
export default function AdminUsersPage() {
    //filter
    const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");

    const [statusFilter, setStatusFilter] =
        useState<"all" | AdminUserFilterStatus>("all");

    // pagination
    const [page, setPage] = useState(0);
    const pageSize = 10;

    //selected user 
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [search, setSearch] = useState("")
    //backend filter 
    const roles =
        roleFilter === "all"
            ? (["user", "business"] as Role[])
            : [roleFilter];

    const filter = {
        roles,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: search || undefined,
        limit: pageSize,
        offset: page * pageSize,
    };

    const { data: users = [], isLoading } =
        useGetUsersFiltered(filter);

    const {
        data: userDetail,
        isLoading: isUserLoading,
    } = useGetUserProfile(selectedUserId ?? "");

    const documents = userDetail?.Documents ?? [];

    const approveBusiness = useBusinessApprove();
    const rejectBusiness = useBusinessReject();
    const suspend = useSuspendUser();
    const reactivate = useReactivateUser();

    //return
    return (
        <>
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold">
                    Users Management
                </h2>
                <p className="text-sm text-gray-500">
                    Manage Normal Users and Business Users Approval and Account Status
                </p>
            </div>

            {/* Filters */}
            <div className="flex gap-10 items-center">
                {/* Role filter */}
                <FilterTabs
                    tabs={[
                        { label: "All Users", value: "all" },
                        { label: "Normal Users", value: "user" },
                        { label: "Business Users", value: "business" },
                    ]}
                    active={roleFilter}
                    onChange={(v) =>
                        setRoleFilter(v as "all" | Role)
                    }
                />

                {/* Status filter */}
                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value as
                            | "all"
                            | AdminUserFilterStatus
                        )
                    }
                    className="border rounded-md px-3 py-2 text-sm h-9 bg-gray-100"
                >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                </select>
                <SearchInput
                    placeholder="Search vendors..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />
            </div>

            {/* Table */}
            <div className="mt-4 rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Phone</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Joined</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-6 text-center text-gray-500"
                                >
                                    Loading users…
                                </td>
                            </tr>
                        )}

                        {!isLoading && users.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-6 text-center text-gray-500"
                                >
                                    No users found
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            users.map((u) => {
                                const status = deriveUserStatus(u);

                                return (
                                    <tr
                                        key={u.ID}
                                        className="border-t hover:bg-gray-50 cursor-pointer"
                                        onClick={() => setSelectedUserId(u.ID)}
                                    >
                                        <td className="p-3">
                                            {u.DisplayName}
                                        </td>
                                        <td className="p-3">
                                            {u.Email}
                                        </td>
                                        <td className="p-3">
                                            {u.Phone}
                                        </td>
                                        <td className="p-3 capitalize">
                                            {u.Role}
                                        </td>
                                        <td className="p-3">
                                            <StatusBadge status={status} />
                                        </td>
                                        <td className="p-3">
                                            {new Date(
                                                u.CreatedAt
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
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
                    disabled={users.length < pageSize}
                    onClick={() =>
                        setPage((p) => p + 1)
                    }
                >
                    Next
                </Button>
            </div>

            {/* Details Drawer */}
            <DetailsDrawer
                open={!!selectedUserId}
                onClose={() => setSelectedUserId(null)}
                title="User Details"
            >
                {isUserLoading && (
                    <p className="text-sm text-gray-500">
                        Loading user details…
                    </p>
                )}

                {userDetail && (() => {
                    const status =
                        !userDetail.IsActive
                            ? "suspended"
                            : userDetail.Role === "business"
                                ? userDetail.BusinessProfile?.ApprovalStatus ?? "pending"
                                : "approved";
                    return (
                        <div className="space-y-4 text-sm">
                            {/* Core info */}
                            <Detail label="Name" value={userDetail.DisplayName} />
                            <Detail label="Email" value={userDetail.Email} />
                            <Detail label="Phone" value={userDetail.Phone} />
                            <Detail label="Role" value={userDetail.Role} />
                            <Detail label="Status" value={status} />
                            <Detail
                                label="Joined At"
                                value={new Date(userDetail.CreatedAt).toLocaleString()}
                            />

                            {/* Business profile */}
                            {userDetail.BusinessProfile && (
                                <>
                                    <hr />
                                    <p className="font-medium">Business Profile</p>

                                    <Detail
                                        label="Owner Name"
                                        value={userDetail.BusinessProfile?.OwnerName}
                                    />
                                    <Detail
                                        label="Business Type"
                                        value={userDetail.BusinessProfile?.BusinessType}
                                    />
                                    <Detail
                                        label="Registration Number"
                                        value={userDetail.BusinessProfile?.RegistrationNumber}
                                    />
                                    <Detail
                                        label="Approval Status"
                                        value={userDetail.BusinessProfile?.ApprovalStatus}
                                    />
                                </>
                            )}
                            {/* Documents */}
                            {documents.length > 0 && (
                                <>
                                    <hr />
                                    <p className="font-medium">Documents</p>

                                    <ul>
                                        {documents.map((doc) => (
                                            <li
                                                key={doc.ID}
                                                className="flex items-center justify-between"
                                            >
                                                <span>{doc.DocumentType.toUpperCase()}</span>
                                                <a
                                                    href={doc.DocumentURL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition"                                                >
                                                    Preview Document
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            <hr />
                            <div className="flex gap-2">
                                {status === "pending" &&
                                    userDetail.Role === "business" && (
                                        <>
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    approveBusiness.mutate({
                                                        userId: userDetail.ID,
                                                    })
                                                }
                                                disabled={approveBusiness.isPending}
                                            >
                                                {approveBusiness.isPending
                                                    ? "Approving…"
                                                    : "Approve"}
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    rejectBusiness.mutate({
                                                        userId: userDetail.ID,
                                                    })
                                                }
                                                disabled={rejectBusiness.isPending}
                                            >
                                                {rejectBusiness.isPending
                                                    ? "Rejecting…"
                                                    : "Reject"}
                                            </Button>
                                        </>
                                    )}

                                {status === "approved" && (
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                            suspend.mutate({
                                                userId: userDetail.ID,
                                            })
                                        }
                                        disabled={suspend.isPending}
                                    >
                                        {suspend.isPending
                                            ? "Suspending…"
                                            : "Suspend"}
                                    </Button>
                                )}

                                {status === "suspended" && (
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            reactivate.mutate({
                                                userId: userDetail.ID,
                                            })
                                        }
                                        disabled={reactivate.isPending}
                                    >
                                        {reactivate.isPending
                                            ? "Reactivating…"
                                            : "Reactivate"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </DetailsDrawer>
        </>
    );
}
