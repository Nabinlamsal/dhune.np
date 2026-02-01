
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function api<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: options.method || "GET",
        credentials: "include", // IMPORTANT: enables cookie-based auth
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!response.ok) {
        let errorPayload: any = null;

        try {
            errorPayload = await response.json();
        } catch {
            errorPayload = { message: "Unknown server error" };
        }

        throw {
            status: response.status,
            message: errorPayload.message || "Request failed",
            error: errorPayload,
        };
    }

    // Handle empty responses (e.g., 204 No Content)
    if (response.status === 204) {
        return null as T;
    }

    return response.json() as Promise<T>;
}