import { getMyProfile } from "@/src/services/users/my_profle.service";
import { AdminUserProfile } from "@/src/types/users/admin-user-profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProfileImage, updateMyProfile, uploadProfileImage } from "@/src/services/users/my_profle.service";
import { toast } from "sonner";

export const useMyProfile = () => {
    return useQuery<AdminUserProfile>({
        queryKey: ["my-profile"],
        queryFn: getMyProfile,
        staleTime: 1000 * 60 * 5,
    });
};

export const useUpdateMyProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMyProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-profile"] });
            toast.success("Profile updated successfully");
        },
    });
};

export const useUploadProfileImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadProfileImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-profile"] });
            toast.success("Profile image updated successfully");
        },
    });
};

export const useDeleteProfileImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProfileImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-profile"] });
            toast.success("Profile image deleted successfully");
        },
    });
};
