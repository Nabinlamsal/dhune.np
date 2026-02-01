import axios, { AxiosRequestConfig } from "axios";

const apiClient = axios.create({
    baseURL: "https://localhost:8111",
    headers: {
        "Content-Type": "application/json",
    },
});
export async function api<T>(
    url: string,
    config?: AxiosRequestConfig
): Promise<T> {
    try {
        const response = await apiClient.request<T>({
            url,
            ...config,
        });

        return response.data;
    } catch (error: any) {
        // normalize error
        throw error;
    }
}
