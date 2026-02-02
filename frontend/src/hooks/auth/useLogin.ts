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
            console.log("LOGIN RESPONSE:", data);
            localStorage.setItem("token", data.access_token);
            queryClient.invalidateQueries({ queryKey: ["me"] });
            router.replace("/dashboard");
        },
    });
};