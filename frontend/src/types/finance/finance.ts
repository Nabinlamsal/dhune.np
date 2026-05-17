import { ApiResponse } from "../api";

export interface Commission {
    id: string;
    orderId: string;
    vendorId: string;
    amount: string;
    percentage: string;
    orderAmount: string;
    createdAt: string;
}

export interface VendorSettlement {
    id: string;
    vendorId: string;
    amount: string;
    paymentMethod: string;
    status: string;
    reference: string | null;
    createdAt: string;
    updatedAt: string;
}

export type AdminFinanceDashboardResponse = ApiResponse<{
    stats: {
        totalCommission: string;
        pendingSettlements: string;
        completedSettlements: string;
    };
    recentCommissions: Commission[];
    recentSettlements: VendorSettlement[];
}>;

export type VendorFinanceDashboardResponse = ApiResponse<{
    stats: {
        totalEarnings: string;
        pendingSettlementAmount: string;
        lastSettlementAmount: string;
    };
    recentCommissions: Commission[];
    recentSettlements: VendorSettlement[];
}>;

export interface CreateSettlementPayload {
    vendor_id: string;
    amount: number;
    payment_method: string;
    reference: string;
}

export type CreateSettlementResponse = ApiResponse<{
    settlement: VendorSettlement;
}>;
