import { ApiResponse } from "../api";

export type DisputeRaisedBy = "USER" | "VENDOR";
export type DisputeType = "quantity" | "damage" | "missing" | "pricing";
export type DisputeStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED";
export type DisputeDecision = "APPROVE_USER" | "APPROVE_VENDOR" | "REJECT";

export interface DisputeSummary {
    id: string;
    order_id: string;
    raised_by: DisputeRaisedBy;
    raised_by_id: string;
    dispute_type: DisputeType;
    description: string;
    image_url?: string;
    status: DisputeStatus;
    admin_decision?: string;
    adjustment_amount?: number;
    order_status?: string;
    created_at: string;
    updated_at: string;
}

export interface DisputeAdminSummary extends DisputeSummary {
    final_price: string;
    user_name: string;
    vendor_name: string;
}

export interface DisputeDetail extends DisputeSummary {
    order: {
        id: string;
        request_id: string;
        offer_id: string;
        order_status: string;
        payment_status: string;
        final_price: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    vendor: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
}

export interface CreateDisputePayload {
    order_id: string;
    dispute_type: DisputeType;
    description: string;
    image_url?: string;
    image_file?: File | null;
}

export interface ResolveDisputePayload {
    decision: DisputeDecision;
    adjustment_amount?: number;
    admin_note?: string;
}

export type CreateDisputeResponse = ApiResponse<DisputeSummary>;
export type ListMyDisputesResponse = ApiResponse<DisputeSummary[]>;
export type ListAdminDisputesResponse = ApiResponse<DisputeAdminSummary[]>;
export type GetDisputeDetailResponse = ApiResponse<DisputeDetail>;
export type ResolveDisputeResponse = ApiResponse<DisputeSummary>;
