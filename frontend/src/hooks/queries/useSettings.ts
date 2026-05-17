import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings } from "@/src/services/catalog/settings_service";
import { UpdateSettingsPayload } from "@/src/types/catalog/settings";
import { toast } from "react-hot-toast";

export const useSettings = () => {
    return useQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
    });
};

export const useUpdateSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateSettingsPayload) => updateSettings(payload),
        onSuccess: () => {
            toast.success("Settings updated successfully");
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Failed to update settings");
        },
    });
};
