"use client";

import { VendorSignupForm } from "@/src/components/forms/VendorSignupForm";
import { useRouter } from "next/navigation";

export default function VendorSignupPage() {
    const router = useRouter();

    return (
        <VendorSignupForm onBack={() => router.push("/auth/login")} />
    );
}
