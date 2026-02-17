export type PaymentMethod = "CASH" | "ONLINE";

export type RequestStatus =
    | "OPEN"
    | "CANCELLED"
    | "ORDER_CREATED"
    | "EXPIRED";

export type OfferStatus =
    | "PENDING"
    | "ACCEPTED"
    | "REJECTED"
    | "WITHDRAWN"
    | "EXPIRED"