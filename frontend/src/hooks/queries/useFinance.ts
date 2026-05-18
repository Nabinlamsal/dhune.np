import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAdminFinanceDashboard,
    getVendorFinanceDashboard,
    createVendorSettlement,
    verifyVendorSettlement,
} from "@/src/services/finance/finance_service";
import { CreateSettlementPayload } from "@/src/types/finance/finance";
import { toast } from "react-hot-toast";

const financeErrorMessage = (error: unknown, fallback: string) => {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "error" in error.response.data &&
        typeof error.response.data.error === "string"
    ) {
        return error.response.data.error;
    }
    return fallback;
};

export const useAdminFinanceDashboard = () => {
    return useQuery({
        queryKey: ["adminFinanceDashboard"],
        queryFn: async () => {
            const res = await getAdminFinanceDashboard();
            return res.data;
        },
    });
};

export const useVendorFinanceDashboard = () => {
    return useQuery({
        queryKey: ["vendorFinanceDashboard"],
        queryFn: async () => {
            const res = await getVendorFinanceDashboard();
            return res.data;
        },
    });
};

export const useCreateSettlement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateSettlementPayload) => createVendorSettlement(payload),
        onSuccess: () => {
            toast.success("Settlement created successfully");
            queryClient.invalidateQueries({ queryKey: ["adminFinanceDashboard"] });
            queryClient.invalidateQueries({ queryKey: ["vendorFinanceDashboard"] });
        },
        onError: (error: unknown) => {
            toast.error(financeErrorMessage(error, "Failed to create settlement"));
        },
    });
};

export const useVerifySettlement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => verifyVendorSettlement(id),
        onSuccess: () => {
            toast.success("Settlement verified successfully");
            queryClient.invalidateQueries({ queryKey: ["adminFinanceDashboard"] });
            queryClient.invalidateQueries({ queryKey: ["vendorFinanceDashboard"] });
        },
        onError: (error: unknown) => {
            toast.error(financeErrorMessage(error, "Failed to verify settlement"));
        },
    });
};
