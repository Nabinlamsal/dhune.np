import { UserRole, ApprovalStatus } from "./user.enums";

//for admin table
export interface AdminUserSummary {
    id: string; // uuid

    displayName: string;
    email: string;
    phone: string;

    role: UserRole;

    isActive: boolean;

    businessApprovalStatus?: ApprovalStatus;
    vendorApprovalStatus?: ApprovalStatus;

    createdAt: string;
}
