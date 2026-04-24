"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useResetPassword } from "@/src/hooks/auth/useAuthActions";
import { AxiosError } from "axios";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const resetPassword = useResetPassword();
    const token = searchParams.get("token") ?? "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!token) {
            setErrorMessage("Reset token is missing.");
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage("Password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        resetPassword.mutate(
            {
                token,
                new_password: newPassword,
            },
            {
                onSuccess: (data) => {
                    setSuccessMessage(data.message);
                    setNewPassword("");
                    setConfirmPassword("");
                },
                onError: (error) => {
                    const axiosError = error as AxiosError<{ error?: string }>;
                    setErrorMessage(axiosError.response?.data?.error ?? "Unable to reset password.");
                },
            }
        );
    };

    return (
        <div className="w-full max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle className="text-yellow-600">Reset Password</CardTitle>
                    <CardDescription>Set a new password for your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    required
                                />
                                <FieldDescription>Password must be at least 6 characters.</FieldDescription>
                            </Field>

                            {successMessage ? <p className="rounded-md bg-green-100 p-2 text-sm text-green-700">{successMessage}</p> : null}
                            {errorMessage ? <p className="rounded-md bg-red-100 p-2 text-sm text-red-700">{errorMessage}</p> : null}

                            <Button type="submit" className="bg-[#040947] hover:bg-[#09106a]" disabled={resetPassword.isPending}>
                                {resetPassword.isPending ? "Resetting..." : "Reset password"}
                            </Button>

                            <p className="text-center text-sm text-slate-500">
                                <Link href="/auth/login" className="font-medium text-[#040947] underline">
                                    Return to login
                                </Link>
                            </p>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="w-full max-w-md text-center text-sm text-slate-500">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
