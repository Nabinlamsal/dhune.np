"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useForgotPassword } from "@/src/hooks/auth/useAuthActions";
import { AxiosError } from "axios";

export default function ForgotPasswordPage() {
    const forgotPassword = useForgotPassword();
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        forgotPassword.mutate(
            { email },
            {
                onSuccess: (data) => {
                    setSuccessMessage(data.message);
                },
                onError: (error) => {
                    const axiosError = error as AxiosError<{ error?: string }>;
                    setErrorMessage(axiosError.response?.data?.error ?? "Unable to send reset link.");
                },
            }
        );
    };

    return (
        <div className="w-full max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle className="text-yellow-600">Forgot Password</CardTitle>
                    <CardDescription>Enter your email to receive a password reset link.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
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
                                <FieldDescription>This works for any account that has a registered email address.</FieldDescription>
                            </Field>

                            {successMessage ? <p className="rounded-md bg-green-100 p-2 text-sm text-green-700">{successMessage}</p> : null}
                            {errorMessage ? <p className="rounded-md bg-red-100 p-2 text-sm text-red-700">{errorMessage}</p> : null}

                            <Button type="submit" className="bg-[#040947] hover:bg-[#09106a]" disabled={forgotPassword.isPending}>
                                {forgotPassword.isPending ? "Sending..." : "Send reset link"}
                            </Button>

                            <p className="text-center text-sm text-slate-500">
                                Remembered your password?{" "}
                                <Link href="/auth/login" className="font-medium text-[#040947] underline">
                                    Back to login
                                </Link>
                            </p>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
