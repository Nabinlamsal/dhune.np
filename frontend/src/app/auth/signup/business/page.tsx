"use client";

import { BusinessSignupForm } from "@/src/components/forms/BusinessSignupForm";
import { useRouter } from "next/navigation";

export default function BusinessSignupPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F5EE]">
            <BusinessSignupForm onBack={() => router.push("/auth/login")} />
        </div>
    );
}
