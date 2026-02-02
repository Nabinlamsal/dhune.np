"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { DataTable } from "@/src/components/dashboard/table/DataTable"
import { StatusBadge } from "@/src/components/dashboard/StatusBadge"
import { FilterTabs } from "@/src/components/dashboard/FilterTabs"

type VendorStatus = "pending" | "approved" | "rejected"

interface AdminVendor {
    id: string
    displayName: string
    email: string
    phone: string
    approvalStatus: VendorStatus
    isActive: boolean
    createdAt: string
}

const VENDORS: AdminVendor[] = [
    {
        id: "v1",
        displayName: "CleanMax Laundry",
        email: "cleanmax@gmail.com",
        phone: "9800001111",
        approvalStatus: "pending",
        isActive: true,
        createdAt: "2024-12-10",
    },
    {
        id: "v2",
        displayName: "SnowWash Services",
        email: "snowwash@gmail.com",
        phone: "9800002222",
        approvalStatus: "approved",
        isActive: true,
        createdAt: "2024-11-22",
    },
]

export default function VendorsPage() {
    const router = useRouter()
    const [filter, setFilter] = useState<
        "all" | "pending" | "approved" | "rejected"
    >("all")

    const filteredVendors =
        filter === "all"
            ? VENDORS
            : VENDORS.filter((v) => v.approvalStatus === filter)

    const columns = [
        { key: "displayName", header: "Vendor Name" },
        { key: "email", header: "Email" },
        { key: "phone", header: "Phone" },
        {
            key: "approvalStatus",
            header: "Status",
            render: (vendor: AdminVendor) => (
                <StatusBadge status={vendor.approvalStatus} />
            ),
        },
        { key: "createdAt", header: "Joined" },
    ]

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Vendors</h2>
                <p className="text-sm text-gray-500">
                    Manage laundry service providers
                </p>
            </div>

            {/* Filters */}
            <FilterTabs
                tabs={[
                    { label: "All", value: "all" },
                    { label: "Pending", value: "pending" },
                    { label: "Approved", value: "approved" },
                    { label: "Rejected", value: "rejected" },
                ]}
                active={filter}
                onChange={(v) =>
                    setFilter(v as "all" | "pending" | "approved" | "rejected")
                }
            />

            {/* Table */}
            <DataTable
                columns={columns}
                data={filteredVendors}
                onRowClick={(vendor) =>
                    router.push(`/admin/vendors/${vendor.id}`)
                }
            />
        </>
    )
}
