import { Role } from "../auth/identity";
import { ApprovalStatus } from "./user.enums";
export interface ApiResponse<T> {
    success: boolean;
    data: T;
}

//for admin table
export interface AdminUserSummary {
    id: string; // uuid

    displayName: string;
    email: string;
    phone: string;

    role: Role;

    isActive: boolean;

    businessApprovalStatus?: ApprovalStatus | null;
    vendorApprovalStatus?: ApprovalStatus | null;

    createdAt: string;
}
export interface AdminUsersPayload {
    users: AdminUserSummary[];
}