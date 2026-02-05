"use client";

import Sidebar from "@/src/components/admin/Sidebar";
import Topbar from "@/src/components/admin/Topbar";
import { AuthGuard } from "@/src/components/auth/AuthGuard";


export default function UsersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard allow={["user", "business"]}>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </AuthGuard>
    );
}