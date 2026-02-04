"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/src/services/auth/auth.service";
import { useRouter } from "next/navigation";

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem("token", data.access_token);

            const role = data.user.role;

            if (role === "admin") {
                router.replace("/admin");
                return;
            }

            if (role === "vendor") {
                router.replace("/vendor");
                return;
            }

            router.replace("/mobile-app");
        }

    });
};