"use client";

import Sidebar from "@/src/components/admin/Sidebar";
import { AuthGuard } from "@/src/components/auth/AuthGuard";


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard allow={["admin"]}>
            <div className="flex h-[100dvh] overflow-hidden bg-gray-50">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
