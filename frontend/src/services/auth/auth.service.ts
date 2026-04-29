import { LoginRequest, LoginResponse } from "../../types/auth/login";
import { api } from "../../libs/api";
import { SignupResponse } from "../../types/auth/signup";
import { UserIdentity } from "../../types/auth/identity";
import {
    ChangePasswordRequest,
    ForgotPasswordRequest,
    GoogleLoginRequest,
    MessageResponse,
    SendVerificationOTPRequest,
    VerifyEmailRequest,
    ResetPasswordRequest,
} from "../../types/auth/auth-actions";

export const login = async (
    payload: LoginRequest
): Promise<LoginResponse> => {
    const res = await api<{
        success: boolean;
        data: LoginResponse;
    }>("/auth/login", {
        method: "POST",
        data: payload,
    });

    return res.data;
};

export const signup = async (
    payload: FormData
): Promise<SignupResponse> => {
    return api<SignupResponse>("/auth/signup", {
        method: "POST",
        data: payload,
        headers: {
            "Content-type": "multipart/form-data",
        },
    });
}

export const me = (): Promise<UserIdentity> => {
    return api<UserIdentity>("/auth/me", {
        method: "GET",
    })
}

export const sendVerificationOTP = async (
    payload: SendVerificationOTPRequest
): Promise<MessageResponse> => {
    const res = await api<{
        success: boolean;
        data: MessageResponse;
    }>("/auth/verify-email/send-otp", {
        method: "POST",
        data: payload,
    });

    return res.data;
};

export const verifyEmail = async (
    payload: VerifyEmailRequest
): Promise<MessageResponse> => {
    const res = await api<{
        success: boolean;
        data: MessageResponse;
    }>("/auth/verify-email", {
        method: "POST",
        data: payload,
    });

    return res.data;
};

export const forgotPassword = async (
    payload: ForgotPasswordRequest
): Promise<MessageResponse> => {
    const res = await api<{
        success: boolean;
        data: MessageResponse;
    }>("/auth/forgot-password", {
        method: "POST",
        data: payload,
    });

    return res.data;
};

export const resetPassword = async (
    payload: ResetPasswordRequest
): Promise<MessageResponse> => {
    const res = await api<{
        success: boolean;
        data: MessageResponse;
    }>("/auth/reset-password", {
        method: "POST",
        data: payload,
    });

    return res.data;
};

export const changePassword = async (
    payload: ChangePasswordRequest
): Promise<MessageResponse> => {
    const res = await api<{
        success: boolean;
        data: MessageResponse;
    }>("/auth/change-password", {
        method: "PUT",
        data: payload,
    });

    return res.data;
};

export const googleLogin = async (
    payload: GoogleLoginRequest
): Promise<LoginResponse> => {
    const res = await api<{
        success: boolean;
        data: LoginResponse;
    }>("/auth/google-login", {
        method: "POST",
        data: payload,
    });

    return res.data;
};
