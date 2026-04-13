import axios, { AxiosRequestConfig } from "axios";

export const API_BASE_URL = "http://localhost:8111";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
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
    } catch (error: unknown) {
        // normalize error
        throw error;
    }
}

export const getWebSocketUrl = (token: string) => {
    const url = new URL(API_BASE_URL);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/ws";
    url.searchParams.set("token", token);
    return url.toString();
};
