"use client";

import { LoginForm } from "@/src/components/forms/LoginForm";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    return (
        <LoginForm
            onSignupSelect={(type) => {
                if (type === "user_signup") router.push("/auth/signup/user");
                if (type === "business_signup") router.push("/auth/signup/business");
                if (type === "vendor_signup") router.push("/auth/signup/vendor");
            }}
        />
    );
}
