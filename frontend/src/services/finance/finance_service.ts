import { api } from "@/src/libs/api";
import {
    AdminFinanceDashboardResponse,
    VendorFinanceDashboardResponse,
    CreateSettlementPayload,
    CreateSettlementResponse,
    VendorSettlement,
} from "@/src/types/finance/finance";

export const getAdminFinanceDashboard = async (): Promise<AdminFinanceDashboardResponse> => {
    return api<AdminFinanceDashboardResponse>("/admin/finance/dashboard", {
        method: "GET",
    });
};

export const getVendorFinanceDashboard = async (): Promise<VendorFinanceDashboardResponse> => {
    return api<VendorFinanceDashboardResponse>("/vendor/finance/dashboard", {
        method: "GET",
    });
};

export const createVendorSettlement = async (
    payload: CreateSettlementPayload
): Promise<CreateSettlementResponse> => {
    return api<CreateSettlementResponse>("/vendor/finance/settlements", {
        method: "POST",
        data: payload,
    });
};

export const verifyVendorSettlement = async (
    id: string
): Promise<{ settlement: VendorSettlement }> => {
    return api<{ settlement: VendorSettlement }>(`/admin/finance/settlements/${id}/verify`, {
        method: "POST",
    });
};
