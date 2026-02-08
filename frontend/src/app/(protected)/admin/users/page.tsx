"use client"

import { useState } from "react"

import { DataTable } from "@/src/components/dashboard/table/DataTable"
import { StatusBadge } from "@/src/components/dashboard/StatusBadge"
import { ActionMenu } from "@/src/components/dashboard/ActionMenu"
import { DetailsDrawer } from "@/src/components/dashboard/DetailsDrawer"
import { FilterTabs } from "@/src/components/dashboard/FilterTabs"


type UserRole = "user" | "business"
type ApprovalStatus = "pending" | "approved" | "rejected"

interface AdminUser {
    id: string
    displayName: string
    email: string
    phone: string
    role: UserRole
    isActive: boolean
    createdAt: string

    // business-only fields
    ownerName?: string
    businessType?: string
    registrationNumber?: string
    approvalStatus?: ApprovalStatus
}

//statis files

const USERS: AdminUser[] = [
    {
        id: "1",
        displayName: "Ramesh Shrestha",
        email: "ramesh@gmail.com",
        phone: "9800000001",
        role: "user",
        isActive: true,
        createdAt: "2024-12-01",
    },
    {
        id: "2",
        displayName: "Sita Laundry Pvt Ltd",
        email: "contact@sitalaundry.com",
        phone: "9800000002",
        role: "business",
        isActive: true,
        createdAt: "2024-12-05",
        ownerName: "Sita Sharma",
        businessType: "Laundry Service",
        registrationNumber: "REG-12345",
        approvalStatus: "pending",
    },
    {
        id: "3",
        displayName: "Everest Hostel",
        email: "admin@everesthostel.com",
        phone: "9800000003",
        role: "business",
        isActive: false,
        createdAt: "2024-12-08",
        ownerName: "Kiran Thapa",
        businessType: "Hostel",
        registrationNumber: "REG-67890",
        approvalStatus: "approved",
    },
]

//admin page

export default function AdminUsersPage() {
    const [activeFilter, setActiveFilter] = useState<
        "all" | "user" | "business"
    >("all")

    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

    const filteredUsers =
        activeFilter === "all"
            ? USERS
            : USERS.filter((u) => u.role === activeFilter)

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
            key: "phone",
            header: "Phone",
        },
        {
            key: "role",
            header: "Role",
            render: (user: AdminUser) =>
                user.role === "business" ? "Business" : "Normal",
        },
        {
            key: "approvalStatus",
            header: "Approval",
            render: (user: AdminUser) =>
                user.role === "business" && user.approvalStatus ? (
                    <StatusBadge status={user.approvalStatus} />
                ) : (
                    "—"
                ),
        },
        {
            key: "isActive",
            header: "Active",
            render: (user: AdminUser) =>
                user.isActive ? (
                    <StatusBadge status="active" />
                ) : (
                    <StatusBadge status="disabled" />
                ),
        },
        {
            key: "createdAt",
            header: "Joined",
        },
        {
            key: "actions",
            header: "",
            render: (user: AdminUser) => (
                <ActionMenu
                    onView={() => setSelectedUser(user)}
                    onApprove={
                        user.role === "business" &&
                            user.approvalStatus === "pending"
                            ? () => { }
                            : undefined
                    }
                    onReject={
                        user.role === "business" &&
                            user.approvalStatus === "pending"
                            ? () => { }
                            : undefined
                    }
                    onDelete={() => { }}
                />
            ),
        },
    ]

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Users Management
                </h2>
                <p className="text-sm text-gray-500">
                    Manage normal and business user accounts
                </p>
            </div>

            {/* Filters */}
            <FilterTabs
                tabs={[
                    { label: "All Users", value: "all" },
                    { label: "Normal Users", value: "user" },
                    { label: "Business Users", value: "business" },
                ]}
                active={activeFilter}
                onChange={(v) =>
                    setActiveFilter(v as "all" | "user" | "business")
                }
            />

            {/* Table */}
            <DataTable
                columns={columns}
                data={filteredUsers}
                onRowClick={(user) => setSelectedUser(user)}
            />

            {/* Details Drawer */}
            <DetailsDrawer
                open={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                title="User Details"
            >
                {selectedUser && (
                    <div className="space-y-4 text-sm">
                        <Detail label="Name" value={selectedUser.displayName} />
                        <Detail label="Email" value={selectedUser.email} />
                        <Detail label="Phone" value={selectedUser.phone} />
                        <Detail
                            label="Role"
                            value={
                                selectedUser.role === "business"
                                    ? "Business"
                                    : "Normal"
                            }
                        />
                        <Detail
                            label="Active"
                            value={selectedUser.isActive ? "Yes" : "No"}
                        />

                        {selectedUser.role === "business" && (
                            <>
                                <Detail
                                    label="Owner Name"
                                    value={selectedUser.ownerName}
                                />
                                <Detail
                                    label="Business Type"
                                    value={selectedUser.businessType}
                                />
                                <Detail
                                    label="Registration Number"
                                    value={selectedUser.registrationNumber}
                                />
                                <Detail
                                    label="Approval Status"
                                    value={selectedUser.approvalStatus}
                                />
                            </>
                        )}
                    </div>
                )}
            </DetailsDrawer>
        </>
    )
}


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
