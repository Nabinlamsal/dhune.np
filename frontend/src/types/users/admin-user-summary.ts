import { Role } from "../auth/identity";
import { ApprovalStatus } from "./user.enums";

//for admin table
export interface AdminUserSummary {
    id: string; // uuid

    displayName: string;
    email: string;
    phone: string;

    role: Role;

    isActive: boolean;

    approvalStatus?: ApprovalStatus;

    createdAt: string;
}
