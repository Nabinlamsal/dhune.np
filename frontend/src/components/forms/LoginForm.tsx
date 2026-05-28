"use client"

import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { useEffect, useRef, useState } from "react"
import { useLogin } from "@/src/hooks/auth/useLogin"
import { AxiosError } from "axios"
import Link from "next/link";
import Script from "next/script";
import { useGoogleLogin } from "@/src/hooks/auth/useAuthActions";
import { toast } from "sonner";
import { NEPAL_PHONE_HELPER_TEXT, sanitizePhoneInput } from "@/src/utils/validation";

type GoogleAccountsWindow = Window & typeof globalThis & {
    google?: {
        accounts?: {
            id?: {
                initialize: (config: {
                    client_id: string;
                    callback: (response: { credential?: string }) => void;
                }) => void;
                prompt: () => void;
            };
        };
    };
};

export function LoginForm({
    onSignupSelect
}: { onSignupSelect: (type: "user_signup" | "business_signup" | "vendor_signup") => void }) {
    const { mutate, isPending } = useLogin();
    const googleLogin = useGoogleLogin();
    const [emailOrPhone, setEmailOrPhone] = useState("")
    const [authError, setAuthError] = useState<string | null>(null);
    const [password, setPassword] = useState("")
    const [googleReady, setGoogleReady] = useState(false);
    const initializedRef = useRef(false);
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    useEffect(() => {
        if (!googleReady || initializedRef.current || !googleClientId) {
            return;
        }

        const googleWindow = window as GoogleAccountsWindow;
        googleWindow.google?.accounts?.id?.initialize({
            client_id: googleClientId,
            callback: (response) => {
                if (!response.credential) {
                    setAuthError("Google login failed. Please try again.");
                    return;
                }

                googleLogin.mutate(
                    { id_token: response.credential },
                    {
                        onError: (err) => {
                            const axiosError = err as AxiosError<{ error?: string }>;
                            setAuthError(axiosError.response?.data?.error ?? "Google login failed. Please try again.");
                        },
                    }
                );
            },
        });
        initializedRef.current = true;
    }, [googleClientId, googleLogin, googleReady]);

    return (
        <div className={cn("w-full max-w-md gap-6")}>
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onLoad={() => setGoogleReady(true)}
            />
            <Card className="border-white/70 bg-white/82 text-slate-950 shadow-2xl shadow-[#040947]/10 backdrop-blur dark:border-white/10 dark:bg-white/[0.08] dark:text-white dark:shadow-cyan-300/10">
                <CardHeader>
                    <CardTitle className="text-yellow-600 dark:text-[#ebbc01]">Dhune.np</CardTitle>
                    <CardDescription className="font-light text-[#040947] dark:text-slate-300">
                        Login to your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();

                            setAuthError(null); // clear old errors

                            mutate(
                                {
                                    email_or_phone: emailOrPhone,
                                    password,
                                },
                                {
                                    onSuccess: () => {
                                        // form clear (optional)
                                        setEmailOrPhone("");
                                        setPassword("");
                                    },
                                    onError: (err: Error) => {
                                        const axiosError = err as AxiosError<{ error?: string }>;
                                        setAuthError(
                                            axiosError.response?.data?.error ??
                                            (axiosError.response?.status === 401
                                                ? "Your account is pending approval, unverified, or credentials are incorrect."
                                                : "Something went wrong. Please try again.")
                                        );
                                    },
                                }
                            );
                        }}>
                        <FieldGroup>

                            {/* Email */}
                            <Field>
                                <FieldLabel htmlFor="email">Email or Phone</FieldLabel>
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="example@gmail.com or 98XXXXXXXX"
                                    className="bg-background text-foreground placeholder:text-muted-foreground"
                                    value={emailOrPhone}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setEmailOrPhone(/^\d+$/.test(value) ? sanitizePhoneInput(value) : value);
                                    }}
                                    required
                                />
                                <FieldDescription>For phone login, use +977 and your 10-digit number. {NEPAL_PHONE_HELPER_TEXT}</FieldDescription>
                            </Field>

                            {/* Password */}
                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="ml-auto inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    className="bg-background text-foreground placeholder:text-muted-foreground"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                            </Field>

                            {/* Login Buttons */}
                            <Field>
                                {authError && (
                                    <div className="bg-red-100 text-red-600 text-sm p-2 rounded-md dark:bg-red-500/15 dark:text-red-200">
                                        {authError}
                                    </div>
                                )}
                                <Button className="bg-[#040947] text-white hover:bg-[#121008ea] dark:bg-[#ebbc01] dark:text-[#111827] dark:hover:bg-[#ffd84d]" type="submit" disabled={isPending}>
                                    {isPending ? "Logging In>>" : "Login"}
                                </Button>

                                <Button
                                    className="mt-2 border-border bg-[#6187c2] text-white hover:bg-[#357ae8] dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-accent"
                                    variant="outline"
                                    type="button"
                                    disabled={googleLogin.isPending}
                                    onClick={() => {
                                        setAuthError(null);

                                        if (!googleClientId) {
                                            toast.error("Google login is not configured");
                                            return;
                                        }

                                        const googleWindow = window as GoogleAccountsWindow;
                                        if (!googleWindow.google?.accounts?.id) {
                                            toast.error("Google login is still loading");
                                            return;
                                        }

                                        googleWindow.google.accounts.id.prompt();
                                    }}
                                >
                                    {googleLogin.isPending ? "Signing in..." : "Login with Google"}
                                </Button>

                                {/* SIGNUP DROPDOWN (FINAL) */}
                                <FieldDescription className="text-center mt-4 text-muted-foreground">
                                    Don&apos;t have an account?
                                    <Select
                                        onValueChange={(value) =>
                                            onSignupSelect(value as "user_signup" | "business_signup" | "vendor_signup")
                                        }
                                    >
                                        <SelectTrigger className="inline-flex w-[200px] ml-2 rounded-md border border-border bg-background text-foreground">
                                            <SelectValue placeholder="Sign up as..." />
                                        </SelectTrigger>

                                        <SelectContent className="rounded-md border-border bg-popover text-popover-foreground shadow-md">
                                            <SelectItem value="user_signup">Normal User</SelectItem>
                                            <SelectItem value="business_signup">Business User</SelectItem>
                                            <SelectItem value="vendor_signup">Laundry Vendor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FieldDescription>
                            </Field>

                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div >

    );
}
