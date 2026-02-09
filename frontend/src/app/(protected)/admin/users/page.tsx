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
import { Button } from "@/src/components/ui/button";
import { StatusBadge } from "@/src/components/dashboard/StatusBadge";
import { DetailsDrawer } from "@/src/components/dashboard/DetailsDrawer";
import { FilterTabs } from "@/src/components/dashboard/FilterTabs";

/* ---------------- Types ---------------- */

type Role = "user" | "business";
type Status = "approved" | "pending" | "rejected" | "suspended";

interface UserDocument {
    id: string;
    documentType: string;
    verified: boolean;
}

interface AdminUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: Role;
    status: Status;
    joinedAt: string;

    // business-only
    ownerName?: string;
    businessType?: string;
    registrationNumber?: string;
    documents?: UserDocument[];
}

/* ---------------- Mock Data ---------------- */

const USERS: AdminUser[] = [
    {
        id: "1",
        name: "Ram Thapa",
        email: "ram@gmail.com",
        phone: "9800000001",
        role: "user",
        status: "approved",
        joinedAt: "2024-12-01",
    },
    {
        id: "2",
        name: "Sita Laundry Pvt Ltd",
        email: "contact@sitalaundry.com",
        phone: "9800000002",
        role: "business",
        status: "pending",
        joinedAt: "2024-12-05",
        ownerName: "Sita Sharma",
        businessType: "Laundry Service",
        registrationNumber: "REG-12345",
        documents: [
            { id: "d1", documentType: "PAN", verified: true },
            { id: "d2", documentType: "Registration", verified: false },
        ],
    },
    {
        id: "3",
        name: "Everest Hostel",
        email: "admin@everesthostel.com",
        phone: "9800000003",
        role: "business",
        status: "approved",
        joinedAt: "2024-12-08",
        ownerName: "Kiran Thapa",
        businessType: "Hostel",
        registrationNumber: "REG-67890",
        documents: [
            { id: "d3", documentType: "PAN", verified: true },
        ],
    },
    {
        id: "4",
        name: "Nabin User",
        email: "nabin@gmail.com",
        phone: "9800000004",
        role: "user",
        status: "suspended",
        joinedAt: "2024-11-20",
    },
];

/* ---------------- Page ---------------- */

export default function AdminUsersPage() {
    const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
    const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

    const [page, setPage] = useState(0);
    const pageSize = 5;

    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    const filteredUsers = useMemo(() => {
        return USERS.filter((u) => {
            if (roleFilter !== "all" && u.role !== roleFilter) return false;
            if (statusFilter !== "all" && u.status !== statusFilter) return false;
            return true;
        });
    }, [roleFilter, statusFilter]);

    const paginated = filteredUsers.slice(
        page * pageSize,
        page * pageSize + pageSize
    );

    return (
        <>
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold">Users Management</h2>
                <p className="text-sm text-gray-500">
                    Manage normal and business users
                </p>
            </div>
            <div className="flex gap-10">
                {/* Role Filter */}
                <FilterTabs
                    tabs={[
                        { label: "All Users", value: "all" },
                        { label: "Normal Users", value: "user" },
                        { label: "Business Users", value: "business" },
                    ]}
                    active={roleFilter}
                    onChange={(v) => setRoleFilter(v as any)}
                />

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="border rounded-md px-3 py-2 text-sm h-9 bg-gray-100"
                >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                </select>
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
                        {paginated.map((u) => (
                            <tr
                                key={u.id}
                                className="border-t hover:bg-gray-50 cursor-pointer"
                                onClick={() => setSelectedUser(u)}
                            >
                                <td className="p-3">{u.name}</td>
                                <td className="p-3">{u.email}</td>
                                <td className="p-3">{u.phone}</td>
                                <td className="p-3 capitalize">{u.role}</td>
                                <td className="p-3">
                                    <StatusBadge status={u.status} />
                                </td>
                                <td className="p-3">{u.joinedAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end gap-2 mt-4">
                <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                    Previous
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    disabled={(page + 1) * pageSize >= filteredUsers.length}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </Button>
            </div>

            {/* Drawer */}
            <DetailsDrawer
                open={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                title="User Details"
            >
                {selectedUser && (
                    <div className="space-y-4 text-sm">
                        <Detail label="Name" value={selectedUser.name} />
                        <Detail label="Email" value={selectedUser.email} />
                        <Detail label="Phone" value={selectedUser.phone} />
                        <Detail label="Role" value={selectedUser.role} />
                        <Detail label="Status" value={selectedUser.status} />

                        {selectedUser.role === "business" && (
                            <>
                                <hr />
                                <Detail label="Owner Name" value={selectedUser.ownerName} />
                                <Detail label="Business Type" value={selectedUser.businessType} />
                                <Detail
                                    label="Registration Number"
                                    value={selectedUser.registrationNumber}
                                />

                                <hr />
                                <p className="font-medium">Documents</p>
                                <ul className="space-y-1">
                                    {selectedUser.documents?.map((d) => (
                                        <li key={d.id} className="flex gap-2">
                                            <span>{d.documentType}</span>
                                            <StatusBadge
                                                status={d.verified ? "approved" : "pending"}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {/* Actions */}
                        <hr />
                        <div className="flex gap-2">
                            {selectedUser.status === "pending" &&
                                selectedUser.role === "business" && (
                                    <>
                                        <Button size="sm">Approve</Button>
                                        <Button size="sm" variant="destructive">
                                            Reject
                                        </Button>
                                    </>
                                )}

                            {selectedUser.status === "approved" && (
                                <Button size="sm" variant="destructive">
                                    Suspend
                                </Button>
                            )}

                            {selectedUser.status === "suspended" && (
                                <Button size="sm">Reactivate</Button>
                            )}
                        </div>
                    </div>
                )}
            </DetailsDrawer>
        </>
    );
}

/* ---------------- Helper ---------------- */

function Detail({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <p className="text-gray-500">{label}</p>
            <p className="font-medium">{value ?? "—"}</p>
        </div>
    );
}