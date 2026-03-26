"use client";

import { useQuery } from "@tanstack/react-query";
import {
    getAdminTopRatedVendors,
    getAdminVendorReviews,
    getVendorRatings,
} from "@/src/services/ratings/ratings_service";

export const useVendorRatings = (limit = 10, offset = 0) =>
    useQuery({
        queryKey: ["ratings", "vendor", limit, offset],
        queryFn: async () => {
            const res = await getVendorRatings(limit, offset);
            return res.data;
        },
    });

export const useAdminTopRatedVendors = (limit = 10, offset = 0) =>
    useQuery({
        queryKey: ["ratings", "admin", "top", limit, offset],
        queryFn: async () => {
            const res = await getAdminTopRatedVendors(limit, offset);
            return res.data;
        },
    });

export const useAdminVendorReviews = (
    vendorId?: string,
    limit = 10,
    offset = 0
) =>
    useQuery({
        queryKey: ["ratings", "admin", "vendor", vendorId, limit, offset],
        queryFn: async () => {
            const res = await getAdminVendorReviews(vendorId as string, limit, offset);
            return res.data;
        },
        enabled: !!vendorId,
    });
