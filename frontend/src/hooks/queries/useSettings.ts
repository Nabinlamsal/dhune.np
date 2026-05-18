import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings } from "@/src/services/catalog/settings_service";
import { UpdateSettingsPayload } from "@/src/types/catalog/settings";
import { toast } from "react-hot-toast";

const settingsErrorMessage = (error: unknown, fallback: string) => {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "error" in error.response.data &&
        typeof error.response.data.error === "string"
    ) {
        return error.response.data.error;
    }

    return fallback;
};

export const useSettings = () => {
    return useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const res = await getSettings();
            return res.data;
        },
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
        onError: (error: unknown) => {
            toast.error(settingsErrorMessage(error, "Failed to update settings"));
        },
    });
};
