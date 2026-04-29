"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useSendVerificationOTP, useVerifyEmail } from "@/src/hooks/auth/useAuthActions";
import { AxiosError } from "axios";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const verifyEmail = useVerifyEmail();
    const resendOTP = useSendVerificationOTP();
    const [email, setEmail] = useState(searchParams.get("email") ?? "");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);
        setIsError(false);

        verifyEmail.mutate(
            { email, otp },
            {
                onSuccess: (data) => {
                    setIsError(false);
                    setMessage(data.message);
                    setOtp("");
                },
                onError: (error) => {
                    const axiosError = error as AxiosError<{ error?: string }>;
                    setIsError(true);
                    setMessage(axiosError.response?.data?.error ?? "Unable to verify email.");
                },
            }
        );
    };

    const handleResend = () => {
        setMessage(null);
        setIsError(false);

        resendOTP.mutate(
            { email },
            {
                onSuccess: (data) => {
                    setIsError(false);
                    setMessage(data.message);
                },
                onError: (error) => {
                    const axiosError = error as AxiosError<{ error?: string }>;
                    setIsError(true);
                    setMessage(axiosError.response?.data?.error ?? "Unable to resend OTP.");
                },
            }
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F7F5EE] px-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-yellow-600">Email Verification</CardTitle>
                        <CardDescription>Enter the OTP sent to your email to verify your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="name@example.com"
                                        required
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="otp">OTP</FieldLabel>
                                    <Input
                                        id="otp"
                                        value={otp}
                                        onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                                        placeholder="6-digit OTP"
                                        inputMode="numeric"
                                        required
                                    />
                                    <FieldDescription>Use the code from Gmail before it expires.</FieldDescription>
                                </Field>

                                {message ? (
                                    <div className={`rounded-md p-3 text-sm ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                        {message}
                                    </div>
                                ) : null}

                                <Button
                                    type="submit"
                                    className="w-full bg-[#040947] hover:bg-[#09106a]"
                                    disabled={verifyEmail.isPending}
                                >
                                    {verifyEmail.isPending ? "Verifying..." : "Verify email"}
                                </Button>
                            </FieldGroup>
                        </form>

                        <Button type="button" variant="outline" className="w-full" disabled={!email || resendOTP.isPending} onClick={handleResend}>
                            {resendOTP.isPending ? "Sending..." : "Resend OTP"}
                        </Button>

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
