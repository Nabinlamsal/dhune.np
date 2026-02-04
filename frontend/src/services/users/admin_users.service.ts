import { api } from "@/src/libs/api";
import { AdminUserProfile } from "@/src/types/users/admin-user-profile";
import { AdminUserSummary } from "@/src/types/users/admin-user-summary";
import { AdminUserFilter } from "@/src/types/users/filter";

export const getUsersFiltered = async (
    filter: AdminUserFilter
): Promise<AdminUserSummary[]> => {
    const res = await api<AdminUserSummary[]>(
        "/admin/users",
        {
            method: "GET",
            params: {
                roles: filter.roles?.join(","),
                status: filter.status,
                search: filter.search,
                limit: filter.limit,
                offset: filter.offset,
            },
        }
    );
    return res;
};


export const getUserDetail = async (
    userId: string
): Promise<AdminUserProfile> => {
    const res = await api<AdminUserProfile>(
        `/admin/users/${userId}/profile`,
        {
            method: "GET",
        }
    );

    return res;
};