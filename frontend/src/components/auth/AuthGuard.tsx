"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/src/hooks/auth/useMe";
import { Role } from "@/src/types/auth/identity";

export function AuthGuard({
    children,
    allow,
}: {
    children: React.ReactNode;
    allow: Role[];
}) {
    const router = useRouter();
    const { data, isLoading, isError } = useMe();

    const [mounted, setMounted] = useState(false);

    // Wait for client
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const token = localStorage.getItem("token");

        // Not logged in
        if (!token) {
            router.replace("/auth/login");
            return;
        }

        // Invalid token
        if (!isLoading && (isError || !data)) {
            localStorage.removeItem("token");
            router.replace("/auth/login");
            return;
        }

        const role = data?.role;

        if (!isLoading && role && !allow.includes(role)) {
            switch (role) {
                case "admin":
                    router.replace("/admin");
                    break;
                case "vendor":
                    router.replace("/vendor");
                    break;
                case "user":
                case "business":
                    router.replace("/mobile-app");
                    break;
                default:
                    router.replace("/auth/login");
            }
        }
    }, [mounted, data, isLoading, isError]);

    //render nothing on server
    if (!mounted) return null;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                Checking authentication...
            </div>
        );
    }

    if (!data) return null;

    return <>{children}</>;
}