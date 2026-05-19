"use client";

import { AuthGuard } from "@/src/components/auth/AuthGuard";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard allow={["user", "business"]}>
            <main className="min-h-screen flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </AuthGuard>
    );
}
