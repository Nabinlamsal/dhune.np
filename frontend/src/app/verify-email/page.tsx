"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useVerifyEmail } from "@/src/hooks/auth/useAuthActions";
import { AxiosError } from "axios";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const verifyEmail = useVerifyEmail();
    const token = searchParams.get("token") ?? "";
    const [message, setMessage] = useState(token ? "Verifying your email..." : "Verification token is missing.");
    const [isError, setIsError] = useState(!token);

    useEffect(() => {
        if (!token) {
            return;
        }

        verifyEmail.mutate(token, {
            onSuccess: (data) => {
                setIsError(false);
                setMessage(data.message);
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ error?: string }>;
                setIsError(true);
                setMessage(axiosError.response?.data?.error ?? "Unable to verify email.");
            },
        });
    }, [token, verifyEmail]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F7F5EE] px-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-yellow-600">Email Verification</CardTitle>
                        <CardDescription>Confirm your email address to activate your user account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className={`rounded-md p-3 text-sm ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            {message}
                        </div>

                        <Button asChild className="w-full bg-[#040947] hover:bg-[#09106a]">
                            <Link href="/auth/login">Go to login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F7F5EE] text-sm text-slate-500">Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
