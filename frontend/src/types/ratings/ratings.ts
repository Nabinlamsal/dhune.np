export interface VendorRatingSummary {
    total_ratings: number;
    average_rating: string;
}

export interface VendorRatingItem {
    id: string;
    order_id: string;
    user_id: string;
    user_name: string;
    rating: number;
    review?: string;
    created_at: string;
}

export interface VendorRatingsPayload {
    summary: VendorRatingSummary;
    ratings: VendorRatingItem[];
}

export interface TopRatedVendor {
    vendor_id: string;
    vendor_name: string;
    total_ratings: number;
    average_rating: string;
}
