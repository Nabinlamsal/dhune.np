// "use client"

// import { useState } from "react"

// import { DataTable } from "@/src/components/dashboard/table/DataTable"
// import { StatusBadge } from "@/src/components/dashboard/StatusBadge"
// import { ActionMenu } from "@/src/components/dashboard/ActionMenu"
// import { DetailsDrawer } from "@/src/components/dashboard/DetailsDrawer"
// import { FilterTabs } from "@/src/components/dashboard/FilterTabs"


// type UserRole = "user" | "business"
// type ApprovalStatus = "pending" | "approved" | "rejected"

// interface AdminUser {
//     id: string
//     displayName: string
//     email: string
//     phone: string
//     role: UserRole
//     isActive: boolean
//     createdAt: string

//     // business-only fields
//     ownerName?: string
//     businessType?: string
//     registrationNumber?: string
//     approvalStatus?: ApprovalStatus
// }

// //statis files

// const USERS: AdminUser[] = [
//     {
//         id: "1",
//         displayName: "Ramesh Shrestha",
//         email: "ramesh@gmail.com",
//         phone: "9800000001",
//         role: "user",
//         isActive: true,
//         createdAt: "2024-12-01",
//     },
//     {
//         id: "2",
//         displayName: "Sita Laundry Pvt Ltd",
//         email: "contact@sitalaundry.com",
//         phone: "9800000002",
//         role: "business",
//         isActive: true,
//         createdAt: "2024-12-05",
//         ownerName: "Sita Sharma",
//         businessType: "Laundry Service",
//         registrationNumber: "REG-12345",
//         approvalStatus: "pending",
//     },
//     {
//         id: "3",
//         displayName: "Everest Hostel",
//         email: "admin@everesthostel.com",
//         phone: "9800000003",
//         role: "business",
//         isActive: false,
//         createdAt: "2024-12-08",
//         ownerName: "Kiran Thapa",
//         businessType: "Hostel",
//         registrationNumber: "REG-67890",
//         approvalStatus: "approved",
//     },
// ]

// //admin page

// export default function AdminUsersPage() {
//     const [activeFilter, setActiveFilter] = useState<
//         "all" | "user" | "business"
//     >("all")

//     const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

//     const filteredUsers =
//         activeFilter === "all"
//             ? USERS
//             : USERS.filter((u) => u.role === activeFilter)

//     const columns = [
//         {
//             key: "displayName",
//             header: "Name",
//         },
//         {
//             key: "email",
//             header: "Email",
//         },
//         {
//             key: "phone",
//             header: "Phone",
//         },
//         {
//             key: "role",
//             header: "Role",
//             render: (user: AdminUser) =>
//                 user.role === "business" ? "Business" : "Normal",
//         },
//         {
//             key: "approvalStatus",
//             header: "Approval",
//             render: (user: AdminUser) =>
//                 user.role === "business" && user.approvalStatus ? (
//                     <StatusBadge status={user.approvalStatus} />
//                 ) : (
//                     "—"
//                 ),
//         },
//         {
//             key: "isActive",
//             header: "Active",
//             render: (user: AdminUser) =>
//                 user.isActive ? (
//                     <StatusBadge status="active" />
//                 ) : (
//                     <StatusBadge status="disabled" />
//                 ),
//         },
//         {
//             key: "createdAt",
//             header: "Joined",
//         },
//         {
//             key: "actions",
//             header: "",
//             render: (user: AdminUser) => (
//                 <ActionMenu
//                     onView={() => setSelectedUser(user)}
//                     onApprove={
//                         user.role === "business" &&
//                             user.approvalStatus === "pending"
//                             ? () => { }
//                             : undefined
//                     }
//                     onReject={
//                         user.role === "business" &&
//                             user.approvalStatus === "pending"
//                             ? () => { }
//                             : undefined
//                     }
//                     onDelete={() => { }}
//                 />
//             ),
//         },
//     ]

//     return (
//         <>
//             {/* Header */}
//             <div className="mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                     Users Management
//                 </h2>
//                 <p className="text-sm text-gray-500">
//                     Manage normal and business user accounts
//                 </p>
//             </div>

//             {/* Filters */}
//             <FilterTabs
//                 tabs={[
//                     { label: "All Users", value: "all" },
//                     { label: "Normal Users", value: "user" },
//                     { label: "Business Users", value: "business" },
//                 ]}
//                 active={activeFilter}
//                 onChange={(v) =>
//                     setActiveFilter(v as "all" | "user" | "business")
//                 }
//             />

//             {/* Table */}
//             <DataTable
//                 columns={columns}
//                 data={filteredUsers}
//                 onRowClick={(user) => setSelectedUser(user)}
//             />

//             {/* Details Drawer */}
//             <DetailsDrawer
//                 open={!!selectedUser}
//                 onClose={() => setSelectedUser(null)}
//                 title="User Details"
//             >
//                 {selectedUser && (
//                     <div className="space-y-4 text-sm">
//                         <Detail label="Name" value={selectedUser.displayName} />
//                         <Detail label="Email" value={selectedUser.email} />
//                         <Detail label="Phone" value={selectedUser.phone} />
//                         <Detail
//                             label="Role"
//                             value={
//                                 selectedUser.role === "business"
//                                     ? "Business"
//                                     : "Normal"
//                             }
//                         />
//                         <Detail
//                             label="Active"
//                             value={selectedUser.isActive ? "Yes" : "No"}
//                         />

//                         {selectedUser.role === "business" && (
//                             <>
//                                 <Detail
//                                     label="Owner Name"
//                                     value={selectedUser.ownerName}
//                                 />
//                                 <Detail
//                                     label="Business Type"
//                                     value={selectedUser.businessType}
//                                 />
//                                 <Detail
//                                     label="Registration Number"
//                                     value={selectedUser.registrationNumber}
//                                 />
//                                 <Detail
//                                     label="Approval Status"
//                                     value={selectedUser.approvalStatus}
//                                 />
//                             </>
//                         )}
//                     </div>
//                 )}
//             </DetailsDrawer>
//         </>
//     )
// }


// function Detail({
//     label,
//     value,
// }: {
//     label: string
//     value?: string
// }) {
//     return (
//         <div>
//             <p className="text-gray-500">{label}</p>
//             <p className="font-medium">{value ?? "—"}</p>
//         </div>
//     )
// }

"use client";

import { useState, useMemo } from "react";

/* UI */
import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { StatusBadge } from "@/src/components/dashboard/StatusBadge";
import { ActionMenu } from "@/src/components/dashboard/ActionMenu";
import { DetailsDrawer } from "@/src/components/dashboard/DetailsDrawer";
import { FilterTabs } from "@/src/components/dashboard/FilterTabs";

/* Hooks */
import { useGetUsersFiltered } from "@/src/hooks/users/useAdminUsers";
import {
    useBusinessApprove,
    useBusinessReject,
    useSuspendUser,
} from "@/src/hooks/users/useUserCommand";

/* Types */
import { AdminUserSummary } from "@/src/types/users/admin-user-summary";
import { AdminUserFilter } from "@/src/types/users/filter";
import { AdminUserFilterStatus } from "@/src/types/users/user.enums";

/* ------------------------------------------------ */

type RoleFilter = "all" | "business" | "user";

type UIStatusFilter =
    | "all"
    | "approved"   // maps to active
    | "pending"
    | "rejected"
    | "suspended";

const LIMIT = 10;

/* ------------------------------------------------ */

const mapUIStatusToApiStatus = (
    status: UIStatusFilter
): AdminUserFilterStatus | undefined => {
    if (status === "all") return undefined;
    if (status === "approved") return undefined; // CRITICAL LINE
    return status;
};

/* ------------------------------------------------ */

export default function AdminUsersPage() {
    /* ---------------- State ---------------- */

    const [roleFilter, setRoleFilter] =
        useState<RoleFilter>("all");

    const [statusFilter, setStatusFilter] =
        useState<UIStatusFilter>("all");

    const [page, setPage] = useState(0);

    const [selectedUserId, setSelectedUserId] =
        useState<string | null>(null);

    /* ---------------- Build API Filter ---------------- */

    const filter: AdminUserFilter = useMemo(() => {
        return {
            roles:
                roleFilter === "all"
                    ? undefined
                    : [roleFilter],

            status: mapUIStatusToApiStatus(statusFilter),

            limit: LIMIT,
            offset: page * LIMIT,
        };
    }, [roleFilter, statusFilter, page]);

    /* ---------------- Query ---------------- */

    const {
        data: users,
        isPending,
        error,
    } = useGetUsersFiltered(filter);

    /* ---------------- Mutations ---------------- */

    const { mutate: approveBusiness } =
        useBusinessApprove();

    const { mutate: rejectBusiness } =
        useBusinessReject();

    const { mutate: suspendUser } =
        useSuspendUser();

    /* ---------------- Guards ---------------- */

    if (isPending) {
        return (
            <p className="text-gray-500">
                Loading users...
            </p>
        );
    }

    if (error) {
        return (
            <p className="text-red-500">
                Failed to load users
            </p>
        );
    }

    /* ---------------- Helpers ---------------- */

    const renderStatus = (user: AdminUserSummary) => {
        if (!user.isActive) {
            return <StatusBadge status="suspended" />;
        }

        if (user.role === "business") {
            return (
                <StatusBadge
                    status={user.approvalStatus ?? "pending"}
                />
            );
        }

        // normal user
        return <StatusBadge status="approved" />;
    };

    /* ---------------- Table ---------------- */

    const columns = [
        {
            key: "displayName",
            header: "Name",
        },
        {
            key: "email",
            header: "Email",
        },
        {
            key: "role",
            header: "Role",
            render: (u: AdminUserSummary) =>
                u.role === "user"
                    ? "Normal User"
                    : "Business",
        },
        {
            key: "status",
            header: "Status",
            render: renderStatus,
        },
        {
            key: "actions",
            header: "",
            render: (user: AdminUserSummary) => {
                const isPendingBusiness =
                    user.role === "business" &&
                    user.approvalStatus === "pending";

                const isApprovedUser =
                    user.isActive &&
                    (user.role === "user" ||
                        user.approvalStatus === "approved");

                return (
                    <ActionMenu
                        onView={() =>
                            setSelectedUserId(user.id)
                        }

                        onApprove={
                            isPendingBusiness
                                ? () =>
                                    approveBusiness({
                                        userId: user.id,
                                    })
                                : undefined
                        }

                        onReject={
                            isPendingBusiness
                                ? () =>
                                    rejectBusiness({
                                        userId: user.id,
                                    })
                                : undefined
                        }

                        onSuspend={
                            isApprovedUser
                                ? () =>
                                    suspendUser({
                                        userId: user.id,
                                    })
                                : undefined
                        }
                    />
                );
            },
        },
    ];

    /* ---------------- Render ---------------- */

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">
                Users Management
            </h2>

            {/* Role Filter */}
            <FilterTabs
                tabs={[
                    { label: "All", value: "all" },
                    {
                        label: "Normal Users",
                        value: "user",
                    },
                    {
                        label: "Business Users",
                        value: "business",
                    },
                ]}
                active={roleFilter}
                onChange={(v) =>
                    setRoleFilter(v as RoleFilter)
                }
            />

            {/* Status Filter */}
            <FilterTabs
                tabs={[
                    { label: "All", value: "all" },
                    {
                        label: "Approved",
                        value: "approved",
                    },
                    {
                        label: "Pending",
                        value: "pending",
                    },
                    {
                        label: "Rejected",
                        value: "rejected",
                    },
                    {
                        label: "Suspended",
                        value: "suspended",
                    },
                ]}
                active={statusFilter}
                onChange={(v) =>
                    setStatusFilter(v as UIStatusFilter)
                }
            />

            {/* Table */}
            <DataTable
                columns={columns}
                data={users ?? []}
            />

            {/* Pagination (simple) */}
            <div className="flex gap-2 mt-4">
                <button
                    disabled={page === 0}
                    onClick={() =>
                        setPage((p) => Math.max(0, p - 1))
                    }
                >
                    Previous
                </button>

                <button
                    onClick={() =>
                        setPage((p) => p + 1)
                    }
                >
                    Next
                </button>
            </div>

            {/* Drawer */}
            <DetailsDrawer
                open={!!selectedUserId}
                onClose={() =>
                    setSelectedUserId(null)
                }
                title="User Details"
            >
                User ID: {selectedUserId}
            </DetailsDrawer>
        </>
    );
}