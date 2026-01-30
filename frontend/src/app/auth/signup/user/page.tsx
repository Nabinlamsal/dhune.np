"use client"
import { UserSignupForm } from "@/src/components/forms/UserSignupForm";
import { useRouter } from "next/navigation";

export default function UserSignupPage() {
    const router = useRouter();
    return (
        <UserSignupForm onBack={() => router.push("/auth/login")} />
    )
}