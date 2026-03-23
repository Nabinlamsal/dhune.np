import { getMyProfile } from "@/src/services/users/my_profle.service";
import { AdminUserProfile } from "@/src/types/users/admin-user-profile";
import { useQuery } from "@tanstack/react-query";

export const useMyProfile = () => {
    return useQuery<AdminUserProfile>({
        queryKey: ["my-profile"],
        queryFn: getMyProfile,
        staleTime: 1000 * 60 * 5,
    });
};