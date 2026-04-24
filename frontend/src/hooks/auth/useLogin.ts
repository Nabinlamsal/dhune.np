"use client";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/src/services/auth/auth.service";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "sonner";

const getAuthErrorMessage = (error: unknown) => {
    const axiosError = error as AxiosError<{ error?: string }>;
    return axiosError.response?.data?.error ?? "Unable to login";
};

export const useLogin = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: login,
        onSuccess: (res) => {
            localStorage.setItem("token", res.access_token);
            toast.success("Logged in successfully");

            const role = res.user.role

            if (role === "admin") {
                router.replace("/admin");
                return;
            }
            if (role === "vendor") {
                router.replace("/vendor");
                return;
            }
            router.replace("/mobile-app");
        },
        onError: (error) => {
            toast.error(getAuthErrorMessage(error));
        }
    });
};
