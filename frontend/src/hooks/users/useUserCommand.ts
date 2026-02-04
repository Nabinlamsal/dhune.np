import { approveBusiness, approveVendor, reactivate, rejectBusiness, rejectVendor, suspend } from "@/src/services/users/admin_command.service";
import { UserCommandPayload } from "@/src/types/users/command";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useVendorApprove = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: approveVendor,

        onSuccess: (_, variables: UserCommandPayload) => {
            queryClient.invalidateQueries({
                queryKey: ["admin-users"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin-user", variables.userId],
            });
        },
    });
};

export const useVendorReject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rejectVendor,

        onSuccess: (_, variables: UserCommandPayload) => {
            queryClient.invalidateQueries({
                queryKey: ["admin-users"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin-user", variables.userId],
            });
        },
    });
};

/* ---------------- Business ---------------- */

export const useBusinessApprove = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: approveBusiness,

        onSuccess: (_, variables: UserCommandPayload) => {
            queryClient.invalidateQueries({
                queryKey: ["admin-users"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin-user", variables.userId],
            });
        },
    });
};

export const useBusinessReject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rejectBusiness,

        onSuccess: (_, variables: UserCommandPayload) => {
            queryClient.invalidateQueries({
                queryKey: ["admin-users"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin-user", variables.userId],
            });
        },
    });
};

/* ---------------- User Governance ---------------- */

export const useSuspendUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: suspend,

        onSuccess: (_, variables: UserCommandPayload) => {
            queryClient.invalidateQueries({
                queryKey: ["admin-users"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin-user", variables.userId],
            });
        },
    });
};

export const useReactivateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: reactivate,

        onSuccess: (_, variables: UserCommandPayload) => {
            queryClient.invalidateQueries({
                queryKey: ["admin-users"],
            });

            queryClient.invalidateQueries({
                queryKey: ["admin-user", variables.userId],
            });
        },
    });
};