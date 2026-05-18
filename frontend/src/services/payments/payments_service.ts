import { api, API_BASE_URL } from "@/src/libs/api";
import {
    PayCashPayload,
    PayCashResponse,
    PaymentURLResponse,
} from "@/src/types/payments/payments";

export const payCash = async (
    payload: PayCashPayload
): Promise<PayCashResponse> => {
    return api<PayCashResponse>("/payments/cash", {
        method: "POST",
        data: payload,
    });
};

export const initiateOrderPayment = async (
    orderId: string,
    method: "KHALTI" | "ESEWA"
): Promise<PaymentURLResponse> => {
    return api<PaymentURLResponse>(`/payments/orders/${orderId}/initiate`, {
        method: "POST",
        data: { method },
    });
};

export const initiateCommissionPayment = async (
    method: "KHALTI" | "ESEWA"
): Promise<PaymentURLResponse> => {
    return api<PaymentURLResponse>("/payments/commissions/initiate", {
        method: "POST",
        data: { method },
    });
};

export const getOrderEsewaPayUrl = (orderId: string): string => {
    const url = new URL(`/payments/orders/esewa/pay/${orderId}`, API_BASE_URL);
    appendToken(url);
    return url.toString();
};

export const getCommissionEsewaPayUrl = (): string => {
    const url = new URL("/payments/commissions/esewa/pay", API_BASE_URL);
    appendToken(url);
    return url.toString();
};

const appendToken = (url: URL) => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (token) {
        url.searchParams.set("token", token);
    }
};
