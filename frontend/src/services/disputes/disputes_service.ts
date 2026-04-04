import { api } from "@/src/libs/api";
import {
    CreateDisputePayload,
    CreateDisputeResponse,
    DisputeStatus,
    GetDisputeDetailResponse,
    ListAdminDisputesResponse,
    ListMyDisputesResponse,
    ResolveDisputePayload,
    ResolveDisputeResponse,
} from "@/src/types/disputes/disputes";

export const createDispute = async (
    payload: CreateDisputePayload
): Promise<CreateDisputeResponse> => {
    const formData = new FormData();
    formData.append("order_id", payload.order_id);
    formData.append("dispute_type", payload.dispute_type);
    formData.append("description", payload.description);

    if (payload.image_url) {
        formData.append("image_url", payload.image_url);
    }

    if (payload.image_file) {
        formData.append("image", payload.image_file);
    }

    return api<CreateDisputeResponse>("/disputes", {
        method: "POST",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getMyDisputes = async (
    limit = 10,
    offset = 0
): Promise<ListMyDisputesResponse> => {
    return api<ListMyDisputesResponse>(`/disputes/my?limit=${limit}&offset=${offset}`, {
        method: "GET",
    });
};

export const getAdminDisputes = async (
    status?: DisputeStatus,
    limit = 10,
    offset = 0
): Promise<ListAdminDisputesResponse> => {
    let url = `/admin/disputes?limit=${limit}&offset=${offset}`;

    if (status) {
        url += `&status=${status}`;
    }

    return api<ListAdminDisputesResponse>(url, {
        method: "GET",
    });
};

export const getAdminDisputeById = async (
    id: string
): Promise<GetDisputeDetailResponse> => {
    return api<GetDisputeDetailResponse>(`/admin/disputes/${id}`, {
        method: "GET",
    });
};

export const resolveDispute = async (
    id: string,
    payload: ResolveDisputePayload
): Promise<ResolveDisputeResponse> => {
    return api<ResolveDisputeResponse>(`/admin/disputes/${id}/resolve`, {
        method: "PATCH",
        data: payload,
    });
};
