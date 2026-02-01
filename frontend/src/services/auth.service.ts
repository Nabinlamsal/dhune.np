import { LoginRequest, LoginResponse } from "../types/auth/login";
import { api } from "../libs/api";

export const login = async (
    payload: LoginRequest
): Promise<LoginResponse> => {
    return api<LoginResponse>("auth/login", {
        method: "POST",
        data: payload,
    });
};
