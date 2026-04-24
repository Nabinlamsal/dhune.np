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
        <div className={cn("w-1/3 gap-6")}>
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onLoad={() => setGoogleReady(true)}
            />
            <Card>
                <CardHeader>
                    <CardTitle className="text-yellow-600">Dhune.np</CardTitle>
                    <CardDescription className="font-light text-[#040947]">
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
                                    onError: (err: AxiosError<{ error?: string }>) => {
                                        setAuthError(
                                            err.response?.data?.error ??
                                            (err?.response?.status === 401
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
                                    value={emailOrPhone}
                                    onChange={(e) => setEmailOrPhone(e.target.value)}
                                    required
                                />
                            </Field>

                            {/* Password */}
                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline hover:text-[#040947]"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                            </Field>

                            {/* Login Buttons */}
                            <Field>
                                {authError && (
                                    <div className="bg-red-100 text-red-600 text-sm p-2 rounded-md">
                                        {authError}
                                    </div>
                                )}
                                <Button className="bg-[#040947] hover:bg-[#121008ea]" type="submit" disabled={isPending}>
                                    {isPending ? "Logging In>>" : "Login"}
                                </Button>

                                <Button
                                    className="bg-[#6187c2] hover:bg-[#357ae8] mt-2"
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
                                <FieldDescription className="text-center mt-4">
                                    Don&apos;t have an account?
                                    <Select
                                        onValueChange={(value) =>
                                            onSignupSelect(value as "user_signup" | "business_signup" | "vendor_signup")
                                        }
                                    >
                                        <SelectTrigger className="inline-flex w-[200px] ml-2 bg-white border border-gray-300 rounded-md">
                                            <SelectValue placeholder="Sign up as..." />
                                        </SelectTrigger>

                                        <SelectContent className="bg-white shadow-md rounded-md">
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
