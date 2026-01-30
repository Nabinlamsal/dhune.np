"use client";

import { VendorSignupForm } from "@/src/components/forms/VendorSignupForm";
import { useRouter } from "next/navigation";

export default function VendorSignupPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F5EE]">
            <VendorSignupForm onBack={() => router.push("/auth/login")} />
        </div>
    );
}
