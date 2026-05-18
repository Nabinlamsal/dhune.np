import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
    getCommissionEsewaPayUrl,
    getOrderEsewaPayUrl,
    initiateCommissionPayment,
    initiateOrderPayment,
    payCash,
} from "@/src/services/payments/payments_service";
import { PayCashPayload } from "@/src/types/payments/payments";

const paymentErrorMessage = (error: unknown, fallback: string) => {
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

export const usePayCash = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: PayCashPayload) => payCash(payload),
        onSuccess: () => {
            toast.success("Cash payment recorded successfully");
            queryClient.invalidateQueries({ queryKey: ["vendorFinanceDashboard"] });
            queryClient.invalidateQueries({ queryKey: ["adminFinanceDashboard"] });
        },
        onError: (error: unknown) => {
            toast.error(paymentErrorMessage(error, "Failed to record cash payment"));
        },
    });
};

export const useOpenOrderPayment = () => {
    return useMutation({
        mutationFn: async ({ orderId, method }: { orderId: string; method: "KHALTI" | "ESEWA" }) => {
            if (method === "ESEWA") {
                return getOrderEsewaPayUrl(orderId);
            }
            const response = await initiateOrderPayment(orderId, method);
            return response.data.payment_url;
        },
        onSuccess: (paymentUrl) => {
            window.location.href = paymentUrl;
        },
        onError: (error: unknown) => {
            toast.error(paymentErrorMessage(error, "Failed to start payment"));
        },
    });
};

export const useOpenCommissionPayment = () => {
    return useMutation({
        mutationFn: async (method: "KHALTI" | "ESEWA") => {
            if (method === "ESEWA") {
                return getCommissionEsewaPayUrl();
            }
            const response = await initiateCommissionPayment(method);
            return response.data.payment_url;
        },
        onSuccess: (paymentUrl) => {
            window.location.href = paymentUrl;
        },
        onError: (error: unknown) => {
            toast.error(paymentErrorMessage(error, "Failed to start commission payment"));
        },
    });
};
