import { ApiResponse } from "../api";
import { Payment } from "../payments/payments";

export interface Commission {
    ID: string;
    OrderID: string;
    VendorID: string;
    OrderAmount: string;
    CommissionPercent: string;
    CommissionAmount: string;
    Status: "PENDING" | "PAID";
    CreatedAt: string;
}

export interface VendorSettlement {
    ID: string;
    VendorID: string;
    Amount: string;
    PaymentMethod: string;
    Status: string;
    Reference?: { String: string; Valid: boolean };
    CreatedAt: string;
    UpdatedAt: string;
}

export interface VendorDue {
    VendorID: string;
    CommissionDue: string;
    CommissionPaid: string;
    TotalOrderEarnings: string;
}

export interface VendorFinanceStats {
    TotalOrderValue: string;
    TotalCompletedOrders: number;
    CommissionPercent: string;
    TotalCommission: string;
    TotalPaidToPlatform: string;
    TotalPendingDue: string;
}

export interface AdminFinanceStats {
    TotalCompletedOrderValue: string;
    TotalCompletedOrders: number;
    TotalPlatformCommissionEarned: string;
    TotalCommissionReceived: string;
    TotalPendingDues: string;
}

export type AdminFinanceDashboardResponse = ApiResponse<{
    stats: AdminFinanceStats;
    recentCommissions: Commission[];
    commissionPaymentHistory: Payment[];
    vendorDues: VendorDue[];
}>;

export type VendorFinanceDashboardResponse = ApiResponse<{
    stats: VendorFinanceStats;
    recentCommissions: Commission[];
    commissionPaymentHistory: Payment[];
}>;

export interface CreateSettlementPayload {
    vendor_id: string;
    amount: number;
    payment_method: string;
    reference: string;
}

export type CreateSettlementResponse = ApiResponse<VendorSettlement>;
