import { api } from "@/src/libs/api";
import {
    ListCategoriesResponse,
    CategoryResponse,
    DeactivateCategoryResponse,
    CreateCategoryPayload,
    UpdateCategoryPayload,
} from "@/src/types/catalog/category";

export const getCategories = async (): Promise<ListCategoriesResponse> => {
    return api<ListCategoriesResponse>("/categories", {
        method: "GET",
    });
};

export const createCategory = async (
    payload: CreateCategoryPayload
): Promise<CategoryResponse> => {
    return api<CategoryResponse>("/admin/categories", {
        method: "POST",
        data: payload,
    });
};

export const updateCategory = async (
    id: string,
    payload: UpdateCategoryPayload
): Promise<CategoryResponse> => {
    return api<CategoryResponse>(`/admin/categories/${id}`, {
        method: "PUT",
        data: payload,
    });
};

export const deactivateCategory = async (
    id: string
): Promise<DeactivateCategoryResponse> => {
    return api<DeactivateCategoryResponse>(
        `/admin/categories/${id}/deactivate`,
        {
            method: "PATCH",
        }
    );
};