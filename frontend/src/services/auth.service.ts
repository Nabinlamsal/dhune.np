import { LoginRequest, LoginResponse } from "../types/auth/login";
import { api } from "../libs/api";
import { SignupRequest, SignupResponse } from "../types/auth/signup";
import { UserIdentity } from "../types/auth/identity";

export const login = async (
    payload: LoginRequest
): Promise<LoginResponse> => {
    return api<LoginResponse>("/auth/login", {
        method: "POST",
        data: payload,
    });
};



export const signup = async (
    payload: SignupRequest
): Promise<SignupResponse> => {
    return api<SignupResponse>("/auth/signup", {
        method: "POST",
        data: payload
    });
}
export const me = (): Promise<UserIdentity> => {
    return api<UserIdentity>("/auth/me", {
        method: "GET",
    })
}
