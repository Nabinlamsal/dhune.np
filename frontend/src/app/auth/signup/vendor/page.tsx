"use client";

import { VendorSignupForm } from "@/src/components/forms/VendorSignupForm";
import { useRouter } from "next/navigation";

export default function VendorSignupPage() {
    const router = useRouter();

    return (
        <div className="w-full max-w-6xl rounded-xl border border-border bg-card p-3 shadow-xl sm:p-4">
            <VendorSignupForm
                onBack={() => router.push("/auth/login")}
                onSignupSuccess={(email) => router.push(`/verify-email?email=${encodeURIComponent(email)}`)}
            />
        </div>
    );
}
