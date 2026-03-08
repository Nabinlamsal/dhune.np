"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { StatusBadge } from "@/src/components/common/StatusBadge";
import { useGetUserProfile } from "@/src/hooks/users/useAdminUsers";
import {
    useVendorApprove,
    useVendorReject,
    useSuspendUser,
    useReactivateUser,
} from "@/src/hooks/users/useUserCommand";
import { AdminUserFilterStatus } from "@/src/types/users/user.enums";
import { Detail } from "@/src/components/common/DetailItem";
import { AdminUserProfile } from "@/src/types/users/admin-user-profile";

function normalizeApprovalStatus(value?: string | null): AdminUserFilterStatus | null {
    if (!value) return null;
    const normalized = value.toLowerCase();
    if (normalized === "approved") return "approved";
    if (normalized === "rejected") return "rejected";
    if (normalized === "pending") return "pending";
    return null;
}

function deriveVendorStatus(user: AdminUserProfile): AdminUserFilterStatus {
    if (!user.IsActive) return "suspended";

    const topLevelStatus = normalizeApprovalStatus(user.VendorApprovalStatus);
    if (topLevelStatus) return topLevelStatus;

    const profileStatus = normalizeApprovalStatus(user.VendorProfile?.ApprovalStatus);
    if (profileStatus) return profileStatus;

    return "pending";
}

function humanize(value: string) {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function VendorDetailsPage() {
    const params = useParams();
    const vendorId = params.id as string;

    const { data: vendor, isLoading } = useGetUserProfile(vendorId);
    const [statusOverride, setStatusOverride] = useState<{
        vendorId: string;
        status: AdminUserFilterStatus;
    } | null>(null);

    const approveVendor = useVendorApprove();
    const rejectVendor = useVendorReject();
    const suspend = useSuspendUser();
    const reactivate = useReactivateUser();

    if (isLoading) {
        return <p className="text-sm text-gray-500">Loading vendor details...</p>;
    }

    if (!vendor || vendor.Role !== "vendor") {
        return <p className="text-sm text-gray-500">Vendor not found.</p>;
    }

    const status =
        statusOverride?.vendorId === vendor.ID
            ? statusOverride.status
            : deriveVendorStatus(vendor);
    const documents = vendor.Documents ?? [];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">{vendor.DisplayName}</h2>
                    <p className="text-sm text-gray-500">Vendor Profile Details</p>
                </div>
                <StatusBadge status={status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm bg-white p-6 rounded-xl border">
                <Detail label="Owner Name" value={vendor.VendorProfile?.OwnerName} />
                <Detail label="Email" value={vendor.Email} />
                <Detail label="Phone" value={vendor.Phone} />
                <Detail label="Address" value={vendor.VendorProfile?.Address} />
                <Detail label="Registration Number" value={vendor.VendorProfile?.RegistrationNumber} />
                <Detail label="Joined" value={new Date(vendor.CreatedAt).toLocaleDateString()} />
            </div>

            <div className="bg-white rounded-xl border p-6 space-y-4">
                <h3 className="text-lg font-semibold">Uploaded Documents</h3>
                {documents.length === 0 ? (
                    <p className="text-sm text-gray-400">No documents uploaded.</p>
                ) : (
                    <ul className="space-y-3">
                        {documents.map((doc) => (
                            <li
                                key={doc.ID}
                                className="flex items-center justify-between border rounded-lg p-4"
                            >
                                <span className="text-sm font-medium">{humanize(doc.DocumentType)}</span>
                                <a
                                    href={doc.DocumentURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition"
                                >
                                    View Document
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="flex gap-3">
                {status === "pending" && (
                    <>
                        <Button
                            onClick={() =>
                                approveVendor.mutate(
                                    { userId: vendor.ID },
                                    {
                                        onSuccess: () =>
                                            setStatusOverride({
                                                vendorId: vendor.ID,
                                                status: "approved",
                                            }),
                                    }
                                )
                            }
                            disabled={approveVendor.isPending}
                        >
                            {approveVendor.isPending ? "Approving..." : "Approve Vendor"}
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={() =>
                                rejectVendor.mutate(
                                    { userId: vendor.ID },
                                    {
                                        onSuccess: () =>
                                            setStatusOverride({
                                                vendorId: vendor.ID,
                                                status: "rejected",
                                            }),
                                    }
                                )
                            }
                            disabled={rejectVendor.isPending}
                        >
                            {rejectVendor.isPending ? "Rejecting..." : "Reject Vendor"}
                        </Button>
                    </>
                )}

                {status === "approved" && (
                    <Button
                        variant="destructive"
                        onClick={() =>
                            suspend.mutate(
                                { userId: vendor.ID },
                                {
                                    onSuccess: () =>
                                        setStatusOverride({
                                            vendorId: vendor.ID,
                                            status: "suspended",
                                        }),
                                }
                            )
                        }
                        disabled={suspend.isPending}
                    >
                        {suspend.isPending ? "Suspending..." : "Suspend Vendor"}
                    </Button>
                )}

                {status === "suspended" && (
                    <Button
                        onClick={() =>
                            reactivate.mutate(
                                { userId: vendor.ID },
                                {
                                    onSuccess: () =>
                                        setStatusOverride({
                                            vendorId: vendor.ID,
                                            status: "approved",
                                        }),
                                }
                            )
                        }
                        disabled={reactivate.isPending}
                    >
                        {reactivate.isPending ? "Reactivating..." : "Reactivate Vendor"}
                    </Button>
                )}
            </div>
        </div>
    );
}
