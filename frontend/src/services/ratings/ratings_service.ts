import { api } from "@/src/libs/api";
import { ApiResponse } from "@/src/types/api";
import {
    TopRatedVendor,
    VendorRatingsPayload,
} from "@/src/types/ratings/ratings";

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
    return api<ApiResponse<TopRatedVendor[]>>(
        `/admin/ratings/top-rated-vendors?limit=${limit}&offset=${offset}`,
        { method: "GET" }
    );
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
