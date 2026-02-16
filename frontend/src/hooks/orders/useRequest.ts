"use client";

import { cancelRequest, createRequest, getAdminRequests, getMarketplaceRequests, getMyRequests } from "@/src/services/orders/request_service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//create req
export const useCreateRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-requests"] });
            queryClient.invalidateQueries({ queryKey: ["marketplace-requests"] });
            queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
        },
    });
};

//my requests
export const useMyRequests = (limit = 10, offset = 0) => {
    return useQuery({
        queryKey: ["my-requests", limit, offset],
        queryFn: () => getMyRequests(limit, offset),
    });
};

//get request detail
export const useRequestDetail = (id: string) => {
    return useQuery({
        queryKey: ["request-detail", id],
        queryFn: () => getRequestById(id),
        enabled: !!id,
    });
};

//cancel requests
export const useCancelRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-requests"] });
            queryClient.invalidateQueries({ queryKey: ["marketplace-requests"] });
            queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
        },
    });
};

//vendor requests
export const useVendorRequests = (limit = 10, offset = 0) => {
    return useQuery({
        queryKey: ["vendor-requests", limit, offset],
        queryFn: () => getMarketplaceRequests(limit, offset),
    });
};

//admin requests
export const useAdminRequests = (
    status?: string,
    limit = 10,
    offset = 0
) => {
    return useQuery({
        queryKey: ["admin-requests", status, limit, offset],
        queryFn: () => getAdminRequests(status, limit, offset),
    });
};

function getRequestById(id: string): any {
    throw new Error("Function not implemented.");
}
