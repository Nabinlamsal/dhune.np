"use client";

import { getCategories, createCategory, updateCategory, deactivateCategory } from "@/src/services/catalog/category_service";
import { Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/src/types/catalog/category";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export function useCategories() {
    return useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await getCategories();
            return res.data; // unwrap ApiResponse
        },
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCategoryPayload) =>
            createCategory(payload),

        onSuccess: () => {
            // Refetch categories after create
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateCategoryPayload;
        }) => updateCategory(id, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}

export function useDeactivateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deactivateCategory(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}