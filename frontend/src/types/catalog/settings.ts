import { ApiResponse } from "../api";

export interface Settings {
    id: string;
    commissionPercentage: string;
    updatedAt: string;
}

export type GetSettingsResponse = ApiResponse<{ settings: Settings }>;

export interface UpdateSettingsPayload {
    commission_percentage: string;
}
