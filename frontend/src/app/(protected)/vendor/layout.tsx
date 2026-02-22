"use client";

import Topbar from "@/src/components/admin/Topbar";
import { AuthGuard } from "@/src/components/auth/AuthGuard";
import SidebarVendor from "@/src/components/vendor/SidebarVendor";


export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard allow={["vendor"]}>
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <SidebarVendor />

                {/* Main Content */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto p-8">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}