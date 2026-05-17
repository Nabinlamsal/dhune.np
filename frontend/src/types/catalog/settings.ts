export interface Settings {
    id: string;
    commissionPercentage: string;
    updatedAt: string;
}

export interface GetSettingsResponse {
    settings: Settings;
}

export interface UpdateSettingsPayload {
    commission_percentage: string;
}
