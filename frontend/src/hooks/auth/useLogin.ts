"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "@/src/services/auth.service";
import { LoginRequest, LoginResponse } from "@/src/types/auth/login";

export const useLogin = () => {
    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: (payload: LoginRequest) => login(payload),
    });
};