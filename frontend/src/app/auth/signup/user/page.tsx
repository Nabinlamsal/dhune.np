import { UserSignupForm } from "@/src/components/forms/UserSignupForm";
import { useRouter } from "next/router";

export default function UserSignupPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f3ed]">
            <UserSignupForm onBack={() => router.push("/auth/login")} />
        </div>
    )
}