import { api } from "@/src/libs/api";
import { ApiResponse } from "@/src/types/api";
import {
    TopRatedVendor,
    VendorRatingsPayload,
} from "@/src/types/ratings/ratings";

const pick = <T = unknown>(
    obj: Record<string, unknown>,
    keys: string[]
): T | undefined => {
    for (const key of keys) {
        if (obj[key] !== undefined && obj[key] !== null) {
            return obj[key] as T;
        }
    }
    return undefined;
};

const normalizeTopRatedVendor = (raw: unknown): TopRatedVendor => {
    const src = (raw ?? {}) as Record<string, unknown>;

    return {
        vendor_id:
            pick<string>(src, ["vendor_id", "vendorId", "VendorID", "vendorID"]) ??
            "",
        vendor_name:
            pick<string>(src, ["vendor_name", "vendorName", "VendorName"]) ?? "Unknown Vendor",
        total_ratings: Number(
            pick<number | string>(src, ["total_ratings", "totalRatings", "TotalRatings"]) ??
                0
        ),
        average_rating: String(
            pick<string | number>(src, ["average_rating", "averageRating", "AverageRating"]) ??
                "0.00"
        ),
    };
};

const normalizeTopRatedVendors = (raw: unknown): TopRatedVendor[] => {
    if (Array.isArray(raw)) {
        return raw.map(normalizeTopRatedVendor);
    }

    const src = (raw ?? {}) as Record<string, unknown>;
    const list =
        pick<unknown[]>(src, [
            "top_rated_vendors",
            "topRatedVendors",
            "vendors",
            "items",
            "data",
        ]) ?? [];

    return Array.isArray(list) ? list.map(normalizeTopRatedVendor) : [];
};

export const getVendorRatings = async (
    limit = 10,
    offset = 0
): Promise<ApiResponse<VendorRatingsPayload>> => {
    return api<ApiResponse<VendorRatingsPayload>>(
        `/vendor/ratings?limit=${limit}&offset=${offset}`,
        { method: "GET" }
    );
};

export const getAdminTopRatedVendors = async (
    limit = 10,
    offset = 0
): Promise<ApiResponse<TopRatedVendor[]>> => {
    const res = await api<ApiResponse<unknown>>(
        `/admin/ratings/top-rated-vendors?limit=${limit}&offset=${offset}`,
        { method: "GET" }
    );

    return {
        ...res,
        data: normalizeTopRatedVendors(res.data),
    };
};

export const getAdminVendorReviews = async (
    vendorId: string,
    limit = 10,
    offset = 0
): Promise<ApiResponse<VendorRatingsPayload>> => {
    return api<ApiResponse<VendorRatingsPayload>>(
        `/admin/ratings/vendors/${vendorId}/reviews?limit=${limit}&offset=${offset}`,
        { method: "GET" }
    );
};
