"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    changePassword,
    forgotPassword,
    googleLogin,
    sendVerificationOTP,
    verifyEmail,
    resetPassword,
} from "@/src/services/auth/auth.service";
import {
    ChangePasswordRequest,
    ForgotPasswordRequest,
    GoogleLoginRequest,
    SendVerificationOTPRequest,
    VerifyEmailRequest,
    ResetPasswordRequest,
} from "@/src/types/auth/auth-actions";
import { LoginResponse } from "@/src/types/auth/login";
import { useRouter } from "next/navigation";

const redirectByRole = (role: string, router: ReturnType<typeof useRouter>) => {
    if (role === "admin") {
        router.replace("/admin");
        return;
    }

    if (role === "vendor") {
        router.replace("/vendor");
        return;
    }

    router.replace("/mobile-app");
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (payload: ForgotPasswordRequest) => forgotPassword(payload),
        onSuccess: (data) => {
            toast.success(data.message);
        },
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (payload: ResetPasswordRequest) => resetPassword(payload),
        onSuccess: (data) => {
            toast.success(data.message);
        },
    });
};

export const useSendVerificationOTP = () => {
    return useMutation({
        mutationFn: (payload: SendVerificationOTPRequest) => sendVerificationOTP(payload),
        onSuccess: (data) => {
            toast.success(data.message);
        },
    });
};

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: (payload: VerifyEmailRequest) => verifyEmail(payload),
    });
};

export const useChangePassword = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ChangePasswordRequest) => changePassword(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["my-profile"] });
            toast.success(data.message);
        },
    });
};

export const useGoogleLogin = () => {
    const router = useRouter();

    return useMutation<LoginResponse, Error, GoogleLoginRequest>({
        mutationFn: (payload) => googleLogin(payload),
        onSuccess: (res) => {
            localStorage.setItem("token", res.access_token);
            toast.success("Logged in successfully");
            redirectByRole(res.user.role, router);
        },
    });
};
