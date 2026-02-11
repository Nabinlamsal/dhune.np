"use client";

import { useParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { StatusBadge } from "@/src/components/common/StatusBadge";

import {
    useGetUserProfile,
} from "@/src/hooks/users/useAdminUsers";

import {
    useVendorApprove,
    useVendorReject,
    useSuspendUser,
    useReactivateUser,
} from "@/src/hooks/users/useUserCommand";

import { AdminUserFilterStatus } from "@/src/types/users/user.enums";
import { Detail } from "@/src/components/common/DetailItem";

/* ---------------- Helper ---------------- */

function deriveVendorStatus(user: any): AdminUserFilterStatus {
    if (user.VendorApprovalStatus === "rejected") {
        return "rejected";
    }

    if (!user.IsActive) {
        return "suspended";
    }

    if (user.VendorApprovalStatus === "approved") {
        return "approved";
    }

    return "pending";
}

function humanize(value: string) {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

//page
export default function VendorDetailsPage() {
    const params = useParams();
    const vendorId = params.id as string;

    const { data: vendor, isLoading } =
        useGetUserProfile(vendorId);

    const approveVendor = useVendorApprove();
    const rejectVendor = useVendorReject();
    const suspend = useSuspendUser();
    const reactivate = useReactivateUser();

    if (isLoading) {
        return (
            <p className="text-sm text-gray-500">
                Loading vendor details…
            </p>
        );
    }

    if (!vendor || vendor.Role !== "vendor") {
        return (
            <p className="text-sm text-gray-500">
                Vendor not found.
            </p>
        );
    }

    const status = deriveVendorStatus(vendor);

    const documents = vendor.Documents ?? [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">
                        {vendor.DisplayName}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Vendor Profile Details
                    </p>
                </div>

                <StatusBadge status={status} />
            </div>

            {/* Vendor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm bg-white p-6 rounded-xl border">
                <Detail label="Owner Name" value={vendor.VendorProfile?.OwnerName} />
                <Detail label="Email" value={vendor.Email} />
                <Detail label="Phone" value={vendor.Phone} />
                <Detail label="Address" value={vendor.VendorProfile?.Address} />
                <Detail
                    label="Registration Number"
                    value={vendor.VendorProfile?.RegistrationNumber}
                />
                <Detail
                    label="Joined"
                    value={new Date(vendor.CreatedAt).toLocaleDateString()}
                />
            </div>

            {/* Documents (View Only) */}
            <div className="bg-white rounded-xl border p-6 space-y-4">
                <h3 className="text-lg font-semibold">
                    Uploaded Documents
                </h3>

                {documents.length === 0 ? (
                    <p className="text-sm text-gray-400">
                        No documents uploaded.
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {documents.map((doc: any) => (
                            <li
                                key={doc.ID}
                                className="flex items-center justify-between border rounded-lg p-4"
                            >
                                <span className="text-sm font-medium">
                                    {humanize(doc.DocumentType)}
                                </span>

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

            {/* Vendor Level Actions */}
            <div className="flex gap-3">

                {/* Pending → Approve / Reject */}
                {status === "pending" && (
                    <>
                        <Button
                            onClick={() =>
                                approveVendor.mutate({
                                    userId: vendor.ID,
                                })
                            }
                            disabled={approveVendor.isPending}
                        >
                            {approveVendor.isPending
                                ? "Approving…"
                                : "Approve Vendor"}
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={() =>
                                rejectVendor.mutate({
                                    userId: vendor.ID,
                                })
                            }
                            disabled={rejectVendor.isPending}
                        >
                            {rejectVendor.isPending
                                ? "Rejecting…"
                                : "Reject Vendor"}
                        </Button>
                    </>
                )}

                {/* Approved → Suspend */}
                {status === "approved" && (
                    <Button
                        variant="destructive"
                        onClick={() =>
                            suspend.mutate({
                                userId: vendor.ID,
                            })
                        }
                        disabled={suspend.isPending}
                    >
                        {suspend.isPending
                            ? "Suspending…"
                            : "Suspend Vendor"}
                    </Button>
                )}

                {/* Suspended → Reactivate */}
                {status === "suspended" && (
                    <Button
                        onClick={() =>
                            reactivate.mutate({
                                userId: vendor.ID,
                            })
                        }
                        disabled={reactivate.isPending}
                    >
                        {reactivate.isPending
                            ? "Reactivating…"
                            : "Reactivate Vendor"}
                    </Button>
                )}

                {/* Rejected → No Buttons */}
            </div>
        </div>
    );
}