// components/ui/VendorSignupForm.tsx
"use client"

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { useSignup } from "@/src/hooks/auth/useSignup";
import { useState } from "react";
import { isValidPhone, sanitizePhoneInput } from "@/src/utils/phone";
import { NEPAL_PHONE_HELPER_TEXT, PASSWORD_HELPER_TEXT, validatePassword } from "@/src/utils/validation";
import { AxiosError } from "axios";
export function UserSignupForm({ onBack, onSignupSuccess }: { onBack: () => void; onSignupSuccess?: (email: string) => void }) {
    const { mutate, isPending } = useSignup()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [password, setPassword] = useState("")
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    return (
        <div className={cn("w-full")}>
            <Card className="border-border bg-card text-card-foreground shadow-none">
                <CardHeader className="flex md:grid-cols-2 gap-10">
                    <div>
                        <CardTitle className="text-yellow-600 dark:text-[#ebbc01]">User Signup - Dhune.np</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Provide your personal details to register as a User<br />
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();

                            setSuccessMessage(null);
                            setErrorMessage(null);

                            if (!isValidPhone(phoneNumber)) {
                                setErrorMessage("Phone number must be exactly 10 digits.");
                                return;
                            }
                            const passwordError = validatePassword(password);
                            if (passwordError) {
                                setErrorMessage(passwordError);
                                return;
                            }

                            const formData = new FormData();
                            formData.append("role", "user");
                            formData.append("display_name", name);
                            formData.append("email", email);
                            formData.append("phone", phoneNumber);
                            formData.append("password", password);

                            mutate(formData, {
                                onSuccess: (data) => {
                                    const submittedEmail = email;
                                    // clear form
                                    setName("");
                                    setEmail("");
                                    setPhoneNumber("");
                                    setPassword("");

                                    setSuccessMessage(data.response_message ?? data.message ?? "Registration successful. Please verify your email before logging in.");

                                    setTimeout(() => {
                                        if (onSignupSuccess) {
                                            onSignupSuccess(submittedEmail);
                                            return;
                                        }
                                        onBack();
                                    }, 1500);
                                },
                                onError: (error) => {
                                    const axiosError = error as AxiosError<{ error?: string }>;
                                    setErrorMessage(axiosError.response?.data?.error ?? "Something went wrong. Please try again.");
                                },
                            });
                        }}>
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-10">

                            {/* Business / Shop Name */}
                            <Field>
                                <FieldLabel htmlFor="businessName">Full Name</FieldLabel>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Example: Rajesh Hamal"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Field>

                            {/* Business Contact Number */}
                            <Field>
                                <FieldLabel htmlFor="contactNumber">Contact Number</FieldLabel>
                                <div className="flex rounded-md border border-input bg-background">
                                    <span className="inline-flex items-center gap-1 border-r px-3 text-sm text-muted-foreground">🇳🇵 +977</span>
                                    <Input
                                        id="contactNumber"
                                        type="tel"
                                        inputMode="numeric"
                                        placeholder="98XXXXXXXX"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(sanitizePhoneInput(e.target.value))}
                                        maxLength={10}
                                        className="border-0 focus-visible:ring-0"
                                        required
                                    />
                                </div>
                                <FieldDescription>{NEPAL_PHONE_HELPER_TEXT}</FieldDescription>
                            </Field>

                            {/* Business Email */}
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>

                            {/* Password */}
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <FieldDescription>{PASSWORD_HELPER_TEXT}</FieldDescription>
                            </Field>

                            {/* Submit Button */}
                            <Field className="col-span-full">
                                {successMessage && (
                                    <div className="bg-green-100 text-green-700 p-2 rounded text-sm dark:bg-green-500/15 dark:text-green-200">
                                        {successMessage}
                                    </div>
                                )}

                                {errorMessage && (
                                    <div className="bg-red-100 text-red-700 p-2 rounded text-sm dark:bg-red-500/15 dark:text-red-200">
                                        {errorMessage}
                                    </div>
                                )}
                                <Button
                                    type="submit"
                                    className="bg-[#ebbc01] hover:bg-[#040947] hover:text-yellow-500 text-black font-bold py-2 px-4 rounded w-full dark:hover:text-[#ebbc01]"
                                    disabled={isPending}
                                >
                                    {isPending ? "Registering..." : "Register as User"}
                                </Button>
                            </Field>

                            {/* Already Have Account */}
                            <Field className="col-span-full">
                                <FieldDescription className="text-center text-md font-semibold mx-0 text-muted-foreground">
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        className="text-[#040947] underline dark:text-[#ebbc01]"
                                        onClick={onBack}
                                    >
                                        Sign In
                                    </button>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
