import { useState } from "react";
import { login } from "../../services/auth.service";
import { LoginRequest, LoginResponse } from "../../types/auth/login";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loginUser = async (
        payload: LoginRequest
    ): Promise<LoginResponse> => {
        setLoading(true);
        setError(null);

        try {
            const response = await login(payload);
            return response;
        } catch (err: any) {
            setError(err?.message || "Login failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        login: loginUser,
        loading,
        error,
    };
};
