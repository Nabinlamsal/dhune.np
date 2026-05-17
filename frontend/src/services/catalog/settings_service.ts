import { api } from "@/src/libs/api";
import { GetSettingsResponse, UpdateSettingsPayload } from "@/src/types/catalog/settings";

export const getSettings = async (): Promise<GetSettingsResponse> => {
    return api<GetSettingsResponse>("/admin/settings", {
        method: "GET",
    });
};

export const updateSettings = async (
    payload: UpdateSettingsPayload
): Promise<GetSettingsResponse> => {
    return api<GetSettingsResponse>("/admin/settings", {
        method: "PUT",
        data: payload,
    });
};
