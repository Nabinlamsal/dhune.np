
import { getUserDetail, getUsersFiltered } from "@/src/services/users/admin_users.service";
import { AdminUserProfile } from "@/src/types/users/admin-user-profile";
import { AdminUserSummary } from "@/src/types/users/admin-user-summary";
import { AdminUserFilter } from "@/src/types/users/filter";
import { useQuery } from "@tanstack/react-query";

export const useGetUsersFiltered = (filter: AdminUserFilter) => {
    return useQuery<AdminUserSummary[]>({
        queryKey: ["admin-users", filter],

        queryFn: () => getUsersFiltered(filter),

        placeholderData: (previousData) => previousData,
    });
}

export const useGetUserProfile = (userId: string) => {
    return useQuery<AdminUserProfile>({
        queryKey: ["admin-user", userId],

        queryFn: () => getUserDetail(userId),

        enabled: !!userId,
    });
};