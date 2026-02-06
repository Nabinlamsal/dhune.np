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

import { useMemo, useState } from "react";

/* UI */
import { DataTable } from "@/src/components/dashboard/table/DataTable";
import { StatusBadge } from "@/src/components/dashboard/StatusBadge";
import { ActionMenu } from "@/src/components/dashboard/ActionMenu";
import { DetailsDrawer } from "@/src/components/dashboard/DetailsDrawer";
import { FilterTabs } from "@/src/components/dashboard/FilterTabs";

/* Hooks */
import { useGetUsersFiltered } from "@/src/hooks/users/useAdminUsers";
import { useGetUserProfile } from "@/src/hooks/users/useAdminUsers";
import {
    useBusinessApprove,
    useBusinessReject,
    useVendorApprove,
    useVendorReject,
    useSuspendUser,
    useReactivateUser,
} from "@/src/hooks/users/useUserCommand";

/* Types */
import { Role } from "@/src/types/auth/identity";
import { AdminUserSummary } from "@/src/types/users/admin-user-summary";
import { AdminUserFilter } from "@/src/types/users/filter";

/* ---------------- Helpers ---------------- */

function getApprovalStatus(user: AdminUserSummary) {
    if (!user.isActive) return "suspended";

    if (user.role === "user") return "approved";

    return user.role === "business"
        ? user.businessApprovalStatus ?? "pending"
        : user.vendorApprovalStatus ?? "pending";
}

/* ---------------- Page ---------------- */

export default function AdminUsersPage() {
    /* Filters */
    const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
    const [statusFilter, setStatusFilter] = useState<
        "all" | "pending" | "approved" | "rejected" | "suspended"
    >("all");

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    /* API Filter */
    const filter: AdminUserFilter = useMemo(
        () => ({
            roles: roleFilter === "all" ? undefined : [roleFilter],
            status: statusFilter === "all" ? undefined : statusFilter,
            limit: 10,
            offset: 0,
        }),
        [roleFilter, statusFilter]
    );

    /* Queries */
    const { data: users, isPending } = useGetUsersFiltered(filter);
    const { data: profile } = useGetUserProfile(selectedUserId ?? "");

    /* Mutations */
    const { mutate: approveBusiness } = useBusinessApprove();
    const { mutate: rejectBusiness } = useBusinessReject();
    const { mutate: approveVendor } = useVendorApprove();
    const { mutate: rejectVendor } = useVendorReject();
    const { mutate: suspendUser } = useSuspendUser();
    const { mutate: reactivateUser } = useReactivateUser();

    /* Table Columns */
    const columns = [
        { key: "displayName", header: "Name" },
        { key: "email", header: "Email" },
        { key: "phone", header: "Phone" },
        {
            key: "role",
            header: "Role",
            render: (u: AdminUserSummary) => u.role.toUpperCase(),
        },
        {
            key: "status",
            header: "Approval Status",
            render: (u: AdminUserSummary) => (
                <StatusBadge status={getApprovalStatus(u)} />
            ),
        },
        {
            key: "createdAt",
            header: "Joined",
            render: (u: AdminUserSummary) =>
                new Date(u.createdAt).toLocaleDateString(),
        },
        {
            key: "actions",
            header: "",
            render: (u: AdminUserSummary) => {
                const status = getApprovalStatus(u);

                return (
                    <ActionMenu
                        onView={() => setSelectedUserId(u.id)}
                        onApprove={
                            status === "pending"
                                ? () =>
                                    u.role === "business"
                                        ? approveBusiness({ userId: u.id })
                                        : approveVendor({ userId: u.id })
                                : undefined
                        }
                        onReject={
                            status === "pending"
                                ? () =>
                                    u.role === "business"
                                        ? rejectBusiness({ userId: u.id })
                                        : rejectVendor({ userId: u.id })
                                : undefined
                        }
                        onSuspend={
                            status === "approved"
                                ? () => suspendUser({ userId: u.id })
                                : undefined
                        }
                    // onReactivate={
                    //     status === "suspended"
                    //         ? () => reactivateUser({ userId: u.id })
                    //         : undefined
                    // }
                    />
                );
            },
        },
    ];

    /* ---------------- Render ---------------- */

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Users Management</h2>

            {/* Role Filter */}
            <FilterTabs
                tabs={[
                    { label: "All", value: "all" },
                    { label: "Normal Users", value: "user" },
                    { label: "Business Users", value: "business" },
                    { label: "Vendors", value: "vendor" },
                ]}
                active={roleFilter}
                onChange={(v) => setRoleFilter(v as any)}
            />

            {/* Status Filter */}
            <FilterTabs
                tabs={[
                    { label: "All", value: "all" },
                    { label: "Approved", value: "approved" },
                    { label: "Pending", value: "pending" },
                    { label: "Rejected", value: "rejected" },
                    { label: "Suspended", value: "suspended" },
                ]}
                active={statusFilter}
                onChange={(v) => setStatusFilter(v as any)}
            />

            {/* Table */}
            <DataTable
                // loading={isPending}
                columns={columns}
                data={users ?? []}
                onRowClick={(u) => setSelectedUserId(u.id)}
            // compact
            />

            {/* Drawer */}
            <DetailsDrawer
                open={!!selectedUserId}
                onClose={() => setSelectedUserId(null)}
                title="User Details"
            >
                {!profile ? (
                    <p className="text-sm text-gray-500">Loading...</p>
                ) : (
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="text-gray-500">Name</p>
                            <p className="font-medium">{profile.displayName}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium">{profile.email}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-medium">{profile.phone}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Role</p>
                            <p className="font-medium">{profile.role}</p>
                        </div>

                        {profile.businessProfile && (
                            <>
                                <hr />
                                <div>
                                    <p className="text-gray-500">Owner Name</p>
                                    <p className="font-medium">
                                        {profile.businessProfile.ownerName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Business Type</p>
                                    <p className="font-medium">
                                        {profile.businessProfile.businessType}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Registration Number</p>
                                    <p className="font-medium">
                                        {profile.businessProfile.registrationNumber}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </DetailsDrawer>
        </>
    );
}