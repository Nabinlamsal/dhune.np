"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, signup, me } from "@/src/services/auth.service";

import { LoginRequest, LoginResponse } from "@/src/types/auth/login";
import { SignupRequest, SignupResponse } from "../types/auth/signup";
import { UserIdentity } from "../types/auth/identity";
import { useRouter } from "next/navigation";

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            console.log("LOGIN RESPONSE:", data);
            localStorage.setItem("token", data.data.access_token);
            queryClient.invalidateQueries({ queryKey: ["me"] });
            router.replace("/dashboard");
        },
    });
};


export const useSignup = () => {
    return useMutation<SignupResponse, Error, SignupRequest>({
        mutationFn: signup,
        onSuccess: (data) => {
            console.log("User Signed Up", data)
        }
    })
}

export const useMe = () => {
    const router = useRouter();
    return useQuery<UserIdentity>({
        queryKey: ["me"],
        queryFn: me,
        enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
        retry: false,

    })
}