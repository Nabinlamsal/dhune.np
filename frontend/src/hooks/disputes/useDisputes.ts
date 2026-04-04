"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createDispute,
    getAdminDisputeById,
    getAdminDisputes,
    getMyDisputes,
    resolveDispute,
} from "@/src/services/disputes/disputes_service";
import { DisputeStatus, ResolveDisputePayload } from "@/src/types/disputes/disputes";
import { toast } from "sonner";

export const useCreateDispute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDispute,
        onSuccess: () => {
            toast.success("Dispute created successfully.");
            queryClient.invalidateQueries({ queryKey: ["disputes"] });
            queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
        },
        onError: () => {
            toast.error("Failed to create dispute.");
        },
    });
};

export const useMyDisputes = (limit = 10, offset = 0) =>
    useQuery({
        queryKey: ["disputes", "my", limit, offset],
        queryFn: async () => {
            const res = await getMyDisputes(limit, offset);
            return res.data;
        },
    });

export const useAdminDisputes = (
    status?: DisputeStatus,
    limit = 10,
    offset = 0
) =>
    useQuery({
        queryKey: ["disputes", "admin", status, limit, offset],
        queryFn: async () => {
            const res = await getAdminDisputes(status, limit, offset);
            return res.data;
        },
    });

export const useAdminDisputeDetail = (id?: string) =>
    useQuery({
        queryKey: ["disputes", "admin", "detail", id],
        queryFn: async () => {
            const res = await getAdminDisputeById(id as string);
            return res.data;
        },
        enabled: !!id,
    });

export const useResolveDispute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: ResolveDisputePayload }) =>
            resolveDispute(id, payload),
        onSuccess: () => {
            toast.success("Dispute updated successfully.");
            queryClient.invalidateQueries({ queryKey: ["disputes"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: () => {
            toast.error("Failed to resolve dispute.");
        },
    });
};
