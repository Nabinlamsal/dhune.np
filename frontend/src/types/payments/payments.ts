export interface Payment {
    id: string;
    orderId: string;
    payerId: string;
    vendorId: string;
    amount: string;
    paymentMethod: string;
    paymentStatus: string;
    gatewayReference: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PayCashPayload {
    order_id: string;
}

export interface InitiateKhaltiPayload {
    order_id: string;
}

export interface VerifyKhaltiPayload {
    pidx: string;
    amount: number;
    transaction_id: string;
    mobile: string;
    purchase_order_id: string;
}
