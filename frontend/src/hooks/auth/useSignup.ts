"use client";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/src/services/auth/auth.service";

import { SignupRequest, SignupResponse } from "../../types/auth/signup";

export const useSignup = () => {
    return useMutation<SignupResponse, Error, SignupRequest>({
        mutationFn: signup,
        onSuccess: (data) => {
            console.log("User Signed Up", data)
        }
    })
}
