import { api } from "@/src/libs/api";
import { ApiResponse } from "@/src/types/api";
import { AdminUserProfile } from "@/src/types/users/admin-user-profile";
import { ApprovalStatus } from "@/src/types/users/user.enums";

const pick = <T = unknown>(obj: Record<string, unknown>, keys: string[]): T | undefined => {
    for (const key of keys) {
        if (obj[key] !== undefined && obj[key] !== null) {
            return obj[key] as T;
        }
    }
    return undefined;
};

const normalizeMyProfile = (raw: unknown): AdminUserProfile => {
    const src = (raw ?? {}) as Record<string, unknown>;
    const vendorRaw = (pick<Record<string, unknown>>(src, ["VendorProfile", "vendor_profile", "vendorProfile"]) ?? {}) as Record<string, unknown>;

    return {
        ID: pick<string>(src, ["ID", "id"]) ?? "",
        DisplayName: pick<string>(src, ["DisplayName", "display_name", "displayName"]) ?? "",
        Email: pick<string>(src, ["Email", "email"]) ?? "",
        Phone: pick<string>(src, ["Phone", "phone"]) ?? "",
        Role: (pick<string>(src, ["Role", "role"]) as AdminUserProfile["Role"]) ?? "vendor",
        IsActive: Boolean(pick<boolean>(src, ["IsActive", "is_active", "isActive"])),
        IsVerified: Boolean(pick<boolean>(src, ["IsVerified", "is_verified", "isVerified"])),
        CreatedAt: pick<string>(src, ["CreatedAt", "created_at", "createdAt"]) ?? "",
        VendorApprovalStatus: pick<AdminUserProfile["VendorApprovalStatus"]>(src, ["VendorApprovalStatus", "vendor_approval_status", "vendorApprovalStatus"]),
        BusinessApprovalStatus: pick<AdminUserProfile["BusinessApprovalStatus"]>(src, ["BusinessApprovalStatus", "business_approval_status", "businessApprovalStatus"]),
        VendorProfile: {
            OwnerName: pick<string>(vendorRaw, ["OwnerName", "owner_name", "ownerName"]) ?? "",
            Address: pick<string>(vendorRaw, ["Address", "address"]) ?? "",
            RegistrationNumber: pick<string>(vendorRaw, ["RegistrationNumber", "registration_number", "registrationNumber"]) ?? "",
            ApprovalStatus: (pick(vendorRaw, ["ApprovalStatus", "approval_status", "approvalStatus"]) as ApprovalStatus) ?? "pending",
        },
    };
};

export const getMyProfile = async (): Promise<AdminUserProfile> => {
    const res = await api<ApiResponse<{ profile: AdminUserProfile }>>(
        `/user/me/profile`,
        { method: "GET" }
    );

    return normalizeMyProfile(res.data.profile);
};
