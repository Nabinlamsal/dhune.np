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
import { FilePreviewModal } from "@/src/components/common/FilePreviewModal";
import { ConfirmActionDialog } from "@/src/components/common/ConfirmActionDialog";
import LeafletLocationMap from "@/src/components/maps/LeafletLocationMap";

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
    const [previewDoc, setPreviewDoc] = useState<{
        title: string;
        url: string;
    } | null>(null);
    const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | "suspend" | "reactivate" | null>(null);

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
    const businessLatitude = vendor.VendorProfile?.BusinessLatitude;
    const businessLongitude = vendor.VendorProfile?.BusinessLongitude;
    const hasBusinessLocation =
        typeof businessLatitude === "number" &&
        typeof businessLongitude === "number" &&
        Number.isFinite(businessLatitude) &&
        Number.isFinite(businessLongitude);

    const handleConfirmedAction = () => {
        if (!confirmAction) return;

        if (confirmAction === "approve") {
            approveVendor.mutate(
                { userId: vendor.ID },
                {
                    onSuccess: () => {
                        setStatusOverride({ vendorId: vendor.ID, status: "approved" });
                        setConfirmAction(null);
                    },
                }
            );
            return;
        }

        if (confirmAction === "reject") {
            rejectVendor.mutate(
                { userId: vendor.ID },
                {
                    onSuccess: () => {
                        setStatusOverride({ vendorId: vendor.ID, status: "rejected" });
                        setConfirmAction(null);
                    },
                }
            );
            return;
        }

        if (confirmAction === "suspend") {
            suspend.mutate(
                { userId: vendor.ID },
                {
                    onSuccess: () => {
                        setStatusOverride({ vendorId: vendor.ID, status: "suspended" });
                        setConfirmAction(null);
                    },
                }
            );
            return;
        }

        reactivate.mutate(
            { userId: vendor.ID },
            {
                onSuccess: () => {
                    setStatusOverride({ vendorId: vendor.ID, status: "approved" });
                    setConfirmAction(null);
                },
            }
        );
    };

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
                <Detail label="Service Radius" value={vendor.VendorProfile?.ServiceRadiusKm ? `${vendor.VendorProfile.ServiceRadiusKm} km` : undefined} />
                <Detail label="Joined" value={new Date(vendor.CreatedAt).toLocaleDateString()} />
            </div>

            {hasBusinessLocation ? (
                <div className="rounded-xl border bg-white p-6">
                    <h3 className="mb-3 text-lg font-semibold">Business Location</h3>
                    <LeafletLocationMap
                        latitude={businessLatitude}
                        longitude={businessLongitude}
                        height={260}
                        zoom={15}
                    />
                </div>
            ) : null}

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
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPreviewDoc({
                                            title: humanize(doc.DocumentType),
                                            url: doc.DocumentURL,
                                        })
                                    }
                                    className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition"
                                >
                                    View Document
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="flex gap-3">
                {status === "pending" && (
                    <>
                        <Button
                            onClick={() => setConfirmAction("approve")}
                            disabled={approveVendor.isPending}
                        >
                            {approveVendor.isPending ? "Approving..." : "Approve Vendor"}
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={() => setConfirmAction("reject")}
                            disabled={rejectVendor.isPending}
                        >
                            {rejectVendor.isPending ? "Rejecting..." : "Reject Vendor"}
                        </Button>
                    </>
                )}

                {status === "approved" && (
                    <Button
                        variant="destructive"
                        onClick={() => setConfirmAction("suspend")}
                        disabled={suspend.isPending}
                    >
                        {suspend.isPending ? "Suspending..." : "Suspend Vendor"}
                    </Button>
                )}

                {status === "suspended" && (
                    <Button
                        onClick={() => setConfirmAction("reactivate")}
                        disabled={reactivate.isPending}
                    >
                        {reactivate.isPending ? "Reactivating..." : "Reactivate Vendor"}
                    </Button>
                )}
            </div>

            <FilePreviewModal
                open={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
                title={previewDoc?.title}
                url={previewDoc?.url}
            />
            <ConfirmActionDialog
                open={!!confirmAction}
                title={
                    confirmAction === "approve"
                        ? "Approve vendor?"
                        : confirmAction === "reject"
                            ? "Reject vendor?"
                            : confirmAction === "suspend"
                                ? "Suspend vendor?"
                                : "Reactivate vendor?"
                }
                message={`Confirm this action for ${vendor.DisplayName}.`}
                confirmLabel={
                    confirmAction === "approve"
                        ? "Approve"
                        : confirmAction === "reject"
                            ? "Reject"
                            : confirmAction === "suspend"
                                ? "Suspend"
                                : "Reactivate"
                }
                tone={confirmAction === "approve" || confirmAction === "reactivate" ? "success" : "danger"}
                isLoading={approveVendor.isPending || rejectVendor.isPending || suspend.isPending || reactivate.isPending}
                onCancel={() => setConfirmAction(null)}
                onConfirm={handleConfirmedAction}
            />
        </div>
    );
}
