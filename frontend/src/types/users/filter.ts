import {
    UserRole,
    AdminUserFilterStatus,
} from "./user.enums";

//admin-user filters
export interface AdminUserFilter {
    roles?: UserRole[];

    status?: AdminUserFilterStatus;

    search?: string;

    limit: number;

    offset: number;
}
