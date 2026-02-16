import { ApiResponse } from "../api";
import { PricingUnit } from "../catalog/category-enums";
import { PaymentMethod, RequestStatus } from "./orders-enums";

export interface RequestServiceItem {
    category_id: string;
    selected_unit: PricingUnit;
    quantity_value: number;
    description?: string;
    items_json?: any;
}

//create requests layload
export interface CreateRequestPayload {
    pickup_address: string;
    pickup_time_from: string; // ISO string
    pickup_time_to: string;   // ISO string
    payment_method: PaymentMethod;
    services: RequestServiceItem[];
}

//request summary
export interface RequestSummary {
    id: string;
    pickup_address: string;
    status: RequestStatus;
    created_at: string;
}

//detail of request
export interface RequestDetail {
    id: string;
    pickup_address: string;
    pickup_time_from: string;
    pickup_time_to: string;
    payment_method: PaymentMethod;
    status: RequestStatus;
    created_at: string;
    services: RequestServiceItem[];
}

//responces short hand types
export type CreateRequestResponse = ApiResponse<RequestDetail>;

export type GetRequestResponse = ApiResponse<RequestDetail>;

export type ListMyRequestsResponse = ApiResponse<RequestSummary[]>;

export type ListMarketplaceResponse = ApiResponse<RequestSummary[]>;

export type ListAdminRequestsResponse = ApiResponse<RequestSummary[]>;

export type CancelRequestResponse = ApiResponse<{
    message: string;
}>;