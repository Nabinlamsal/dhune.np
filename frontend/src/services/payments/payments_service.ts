import { api } from "@/src/libs/api";
import {
    Payment,
    PayCashPayload,
    InitiateKhaltiPayload,
    VerifyKhaltiPayload,
} from "@/src/types/payments/payments";

export const payCash = async (
    payload: PayCashPayload
): Promise<{ payment: Payment }> => {
    return api<{ payment: Payment }>("/payments/cash", {
        method: "POST",
        data: payload,
    });
};

export const initiateKhalti = async (
    payload: InitiateKhaltiPayload
): Promise<{ pidx: string; payment_url: string }> => {
    return api<{ pidx: string; payment_url: string }>("/payments/khalti/initiate", {
        method: "POST",
        data: payload,
    });
};

export const verifyKhalti = async (
    payload: VerifyKhaltiPayload
): Promise<{ message: string; payment: Payment }> => {
    return api<{ message: string; payment: Payment }>("/payments/khalti/verify", {
        method: "POST",
        data: payload,
    });
};
