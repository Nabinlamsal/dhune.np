export type Role =
    | "user"
    | "business"
    | "vendor"
    | "admin";

export type UserStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "suspended";

export type UserIdentity = {
    id: string;
    display_name: string;
    role: Role;
};
