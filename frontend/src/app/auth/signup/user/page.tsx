"use client"
import Link from "next/link";
import { UserSignupForm } from "@/src/components/forms/UserSignupForm";
import { useRouter } from "next/navigation";

export default function UserSignupPage() {
    const router = useRouter();
    return (
        <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <section className="rounded-xl border border-[#040947]/10 bg-white p-6 shadow-sm dark:border-[#ebbc01]/15 dark:bg-card">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#ebbc01]">Dhune.np accounts</p>
                <h1 className="mt-3 text-3xl font-bold text-[#040947] dark:text-white">Create your account</h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Sign up as a customer or register a business account using the same Dhune authentication flow.
                </p>
                <Link href="/auth/signup/vendor" className="mt-5 inline-flex text-sm font-semibold text-[#040947] underline dark:text-[#ebbc01]">
                    Register as a laundry vendor
                </Link>
            </section>

            <section className="rounded-xl border border-border bg-card p-3 shadow-xl sm:p-4">
                <div className="mb-4 grid grid-cols-2 rounded-lg bg-muted p-1 text-sm font-semibold">
                    <Link className="rounded-md bg-[#040947] px-3 py-2 text-center text-white" href="/auth/signup/user">User</Link>
                    <Link className="rounded-md px-3 py-2 text-center text-muted-foreground hover:text-foreground" href="/auth/signup/business">Business</Link>
                </div>
                <UserSignupForm
                    onBack={() => router.push("/auth/login")}
                    onSignupSuccess={(email) => router.push(`/verify-email?email=${encodeURIComponent(email)}`)}
                />
            </section>
        </div>
    )
}
