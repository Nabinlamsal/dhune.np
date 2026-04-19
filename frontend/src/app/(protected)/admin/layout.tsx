"use client";

import AdminNavbar from "@/src/components/admin/AdminNavbar";
import { AuthGuard } from "@/src/components/auth/AuthGuard";


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard allow={["admin"]}>
            <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.08),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)]">
                <AdminNavbar />
                <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="min-h-[calc(100vh-8rem)]">
                        {children}
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
