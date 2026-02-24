"use client";


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createOffer,
    updateOffer,
    withdrawOffer,
    getMyOffers,
    getOffersByRequest,
    acceptOffer,
    getAdminOffers,
    getAdminOfferStats,
    getVendorOfferStats,
} from "@/src/services/orders/offer_service";
import { OfferStatus } from "@/src/types/orders/orders-enums";
import { toast } from "sonner"

//vendor
export const useCreateOffer = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createOffer,
        onSuccess: () => {
            toast.success("Offer submitted Successfylly. Wait for User Responce!")
            qc.invalidateQueries({ queryKey: ["my-offers"] });
            qc.invalidateQueries({ queryKey: ["offers-by-request"] });
            qc.invalidateQueries({ queryKey: ["admin-offers"] });
        },
        onError: (error: any) => {
            toast.error("Failed to Submit Offer!")
        },
    });
};

export const useUpdateOffer = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: any) =>
            updateOffer(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my-offers"] });
            qc.invalidateQueries({ queryKey: ["admin-offers"] });
        },
    });
};

export const useWithdrawOffer = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: withdrawOffer,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my-offers"] });
            qc.invalidateQueries({ queryKey: ["admin-offers"] });
        },
    });
};

export const useVendorOffers = ({
    status,
    sort = "newest",
    limit = 10,
    offset = 0,
}: {
    status?: OfferStatus;
    sort?: "newest" | "expiring";
    limit?: number;
    offset?: number;
}) => {
    return useQuery({
        queryKey: ["vendor-offers", status, sort, limit, offset],
        queryFn: async () => {
            const res = await getMyOffers({
                status,
                sort,
                limit,
                offset,
            });

            return res.data;
        },
    });
};
//user
export const useOffersByRequest = (
    requestId: string
) =>
    useQuery({
        queryKey: ["offers-by-request", requestId],
        queryFn: () => getOffersByRequest(requestId),
        enabled: !!requestId,
    });

export const useAcceptOffer = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: acceptOffer,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["offers-by-request"] });
            qc.invalidateQueries({ queryKey: ["my-offers"] });
            qc.invalidateQueries({ queryKey: ["admin-offers"] });
        },
    });
};

//admin
export const useAdminOffers = (
    status?: OfferStatus,
    vendorId?: string,
    requestId?: string,
    limit = 10,
    offset = 0
) =>
    useQuery({
        queryKey: [
            "admin-offers",
            status,
            vendorId,
            requestId,
            limit,
            offset,
        ],
        queryFn: () =>
            getAdminOffers(
                status,
                vendorId,
                requestId,
                limit,
                offset
            ),
    });

export const useAdminOfferStats = () =>
    useQuery({
        queryKey: ["admin-offer-stats"],
        queryFn: getAdminOfferStats,
    });

export const useVendorOfferStats = () =>
    useQuery({
        queryKey: ["vendor-offer-stats"],
        queryFn: getVendorOfferStats,
    });