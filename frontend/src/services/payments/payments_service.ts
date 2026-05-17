import { api } from "@/src/libs/api";
import {
    Payment,
    PayCashPayload,
    InitiateKhaltiPayload,
    VerifyKhaltiPayload,
    PayCashResponse,
    InitiateKhaltiResponse,
    VerifyKhaltiResponse,
} from "@/src/types/payments/payments";

export const payCash = async (
    payload: PayCashPayload
): Promise<PayCashResponse> => {
    return api<PayCashResponse>("/payments/cash", {
        method: "POST",
        data: payload,
    });
};

export const initiateKhalti = async (
    payload: InitiateKhaltiPayload
): Promise<InitiateKhaltiResponse> => {
    return api<InitiateKhaltiResponse>("/payments/khalti/initiate", {
        method: "POST",
        data: payload,
    });
};

export const verifyKhalti = async (
    payload: VerifyKhaltiPayload
): Promise<VerifyKhaltiResponse> => {
    return api<VerifyKhaltiResponse>("/payments/khalti/verify", {
        method: "POST",
        data: payload,
    });
};
