import { ApiResponse } from "../api";

export interface Payment {
    ID: string;
    OrderID?: { UUID: string; Valid: boolean };
    PayerID: string;
    VendorID: string;
    Amount: string;
    PaymentMethod: string;
    PaymentStatus: string;
    GatewayReference?: { String: string; Valid: boolean };
    PaymentType: "ORDER_PAYMENT" | "COMMISSION_PAYMENT";
    CreatedAt: string;
    UpdatedAt: string;
}

export interface PayCashPayload {
    order_id: string;
}

export type PayCashResponse = ApiResponse<Payment>;
export type PaymentURLResponse = ApiResponse<{ payment_url: string }>;
