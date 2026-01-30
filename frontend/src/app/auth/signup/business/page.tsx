"use client"
import { BusinessSignupForm } from "@/src/components/forms/BusinessSignupForm";
import { useRouter } from "next/navigation";

export default function UserSignupPage() {
    const router = useRouter();
    return (
        <BusinessSignupForm onBack={() => router.push("/auth/login")} />
    )
}