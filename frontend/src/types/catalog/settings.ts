import { ApiResponse } from "../api";

export interface Settings {
    id: string;
    commissionPercentage: string;
    commission_percentage?: string;
    updatedAt: string;
    updated_at?: string;
}

export type GetSettingsResponse = ApiResponse<Settings>;

export interface UpdateSettingsPayload {
    commission_percentage: number;
}
