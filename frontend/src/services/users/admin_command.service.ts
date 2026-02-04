import { api } from "@/src/libs/api";
import { CommandResponse, UserCommandPayload } from "@/src/types/users/command"

export const approveVendor = async (
    payload: UserCommandPayload
): Promise<CommandResponse> => {
    const res = await api<CommandResponse>(
        `/admin/vendors/${payload.userId}/approve`,
        {
            method: "PATCH",
        }
    );

    return res;
};
export const rejectVendor = async (
    payload: UserCommandPayload
): Promise<CommandResponse> => {
    const res = await api<CommandResponse>(
        `/admin/vendors/${payload.userId}/reject`,
        {
            method: "PATCH",
        }
    );

    return res;
};
export const approveBusiness = async (
    payload: UserCommandPayload
): Promise<CommandResponse> => {
    const res = await api<CommandResponse>(
        `/admin/business/${payload.userId}/approve`,
        {
            method: "PATCH",
        }
    );
    return res;
};

export const rejectBusiness = async (
    payload: UserCommandPayload
): Promise<CommandResponse> => {
    const res = await api<CommandResponse>(
        `/admin/business/${payload.userId}/reject`,
        {
            method: "PATCH",
        }
    );
    return res;
};

export const suspend = async (
    payload: UserCommandPayload
): Promise<CommandResponse> => {
    const res = await api<CommandResponse>(
        `/admin/users/${payload.userId}/suspend`,
        {
            method: "PATCH",
        }
    );
    return res;
};

export const reactivate = async (
    payload: UserCommandPayload
): Promise<CommandResponse> => {
    const res = await api<CommandResponse>(
        `/admin/users/${payload.userId}/reactivate`,
        {
            method: "PATCH",
        }
    );
    return res;
};

