"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/src/hooks/auth/useMe";


export function AuthRedirect() {
    const router = useRouter();
    const { data: user, isLoading } = useMe();

    useEffect(() => {
        if (isLoading) return;

        const token = localStorage.getItem("token");

        //if not logged in
        if (!token) {
            router.replace("/auth/login");
            return;
        }

        // still loading user info → wait
        if (!user) return;

        // role-based redirect
        if (user.role === "admin") {
            router.replace("/admin");
            return;
        }

        if (user.role === "vendor") {
            router.replace("/vendor");
            return;
        }

        router.replace("/mobile-app");
    }, [user, isLoading, router]);

    return null;
}
