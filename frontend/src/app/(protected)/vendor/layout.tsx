"use client";

import { AuthGuard } from "@/src/components/auth/AuthGuard";
import NavbarVendor from "@/src/components/vendor/NavbarVendor";


export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard allow={["vendor"]}>
            <div className="min-h-screen bg-gray-50">
                <NavbarVendor />
                <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
