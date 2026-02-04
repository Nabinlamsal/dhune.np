
//user roles
export type UserRole =
    | "user"
    | "admin"
    | "vendor"
    | "business";


//approval status
export type ApprovalStatus =
    | "pending"
    | "approved"
    | "rejected";


//account status
export type AccountStatus =
    | "active"
    | "suspended";


//admin filters
export type AdminUserFilterStatus =
    | "active"
    | "pending"
    | "rejected"
    | "suspended";
