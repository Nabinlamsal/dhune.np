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
export function UserSignupForm({ onBack }: { onBack: () => void }) {
    const { mutate, isPending } = useSignup()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [password, setPassword] = useState("")
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    return (
        <div className={cn("bg-white rounded-xl p-6 w-full max-w-5xl max-h-[80vh] overflow-y-auto")}>
            <Card>
                <CardHeader className="flex md:grid-cols-2 gap-10">
                    <div>
                        <CardTitle className="text-yellow-600">User Signup - Dhune.np</CardTitle>
                        <CardDescription>
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

                            const formData = new FormData();
                            formData.append("role", "user");
                            formData.append("display_name", name);
                            formData.append("email", email);
                            formData.append("phone", phoneNumber);
                            formData.append("password", password);

                            mutate(formData, {
                                onSuccess: () => {
                                    // clear form
                                    setName("");
                                    setEmail("");
                                    setPhoneNumber("");
                                    setPassword("");

                                    setSuccessMessage("Registration successful! Please login.");

                                    // optional: auto switch to login after 2 sec
                                    setTimeout(() => {
                                        onBack();
                                    }, 2000);
                                },
                                onError: () => {
                                    setErrorMessage("Something went wrong. Please try again.");
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
                                <Input
                                    id="contactNumber"
                                    type="tel"
                                    placeholder="+977 98XXXXXXXX"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
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
                            </Field>

                            {/* Submit Button */}
                            <Field className="col-span-full">
                                {successMessage && (
                                    <div className="bg-green-100 text-green-700 p-2 rounded text-sm">
                                        {successMessage}
                                    </div>
                                )}

                                {errorMessage && (
                                    <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
                                        {errorMessage}
                                    </div>
                                )}
                                <Button
                                    type="submit"
                                    className="bg-[#ebbc01] hover:bg-[#040947] hover:text-yellow-500 text-black font-bold py-2 px-4 rounded w-full"
                                    disabled={isPending}
                                >
                                    {isPending ? "Registering..." : "Register as User"}
                                </Button>
                            </Field>

                            {/* Already Have Account */}
                            <Field className="col-span-full">
                                <FieldDescription className="text-center text-md font-semibold mx-0">
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        className="text-blue-800 underline"
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
