"use client";

import { VendorSignupForm } from "@/src/components/forms/VendorSignupForm";
import { useRouter } from "next/navigation";

export default function VendorSignupPage() {
    const router = useRouter();

    return (
        <div className="w-full max-w-6xl rounded-2xl border border-white/70 bg-white/82 p-3 shadow-2xl shadow-[#040947]/10 backdrop-blur dark:border-white/10 dark:bg-white/[0.08] dark:shadow-cyan-300/10 sm:p-4">
            <VendorSignupForm
                onBack={() => router.push("/auth/login")}
                onSignupSuccess={(email) => router.push(`/verify-email?email=${encodeURIComponent(email)}`)}
            />
        </div>
    );
}
