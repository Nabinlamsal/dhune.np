import { useMutation } from "@tanstack/react-query";
import {
    payCash,
    initiateKhalti,
    verifyKhalti,
} from "@/src/services/payments/payments_service";
import {
    PayCashPayload,
    InitiateKhaltiPayload,
    VerifyKhaltiPayload,
} from "@/src/types/payments/payments";
import { toast } from "react-hot-toast";

export const usePayCash = () => {
    return useMutation({
        mutationFn: (payload: PayCashPayload) => payCash(payload),
        onSuccess: () => {
            toast.success("Cash payment recorded successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to record cash payment");
        },
    });
};

export const useInitiateKhalti = () => {
    return useMutation({
        mutationFn: (payload: InitiateKhaltiPayload) => initiateKhalti(payload),
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to initiate Khalti payment");
        },
    });
};

export const useVerifyKhalti = () => {
    return useMutation({
        mutationFn: (payload: VerifyKhaltiPayload) => verifyKhalti(payload),
        onSuccess: () => {
            toast.success("Payment verified successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to verify Khalti payment");
        },
    });
};
