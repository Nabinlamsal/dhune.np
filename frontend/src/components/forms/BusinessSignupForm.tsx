// components/ui/BusinessSignupForm.tsx
"use client"

import { cn } from "@/lib/utils";
import LoginModal from "../modals/LoginModal";
import { useState } from "react";
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

export function BusinessSignupForm({ className, ...props }: React.ComponentProps<"div">) {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div className={cn("bg-white rounded-xl p-6 w-full max-w-5xl max-h-[80vh] overflow-y-auto", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-blue-700">Business User Signup - Dhune.np</CardTitle>
                    <CardDescription>
                        Register your business account to access Dhune services.
                        <br />
                        <span className="text-red-600 font-semibold">
                            All business details must match your registration document.
                        </span>
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="flex flex-col gap-4">
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-10">

                            {/* Owner Full Name */}
                            <Field>
                                <FieldLabel htmlFor="ownerName">Owner Full Name</FieldLabel>
                                <Input
                                    id="ownerName"
                                    type="text"
                                    placeholder="Owner’s legal full name"
                                    required
                                />
                            </Field>

                            {/* Business Name */}
                            <Field>
                                <FieldLabel htmlFor="businessName">Business/Company Name</FieldLabel>
                                <Input
                                    id="businessName"
                                    type="text"
                                    placeholder="Example: Everest Hospital Pvt Ltd"
                                    required
                                />
                            </Field>

                            {/* Business Type */}
                            <Field>
                                <FieldLabel htmlFor="businessType">Business Type</FieldLabel>
                                <Input
                                    id="businessType"
                                    type="text"
                                    placeholder="Hospital, Hotel, Hostel, Laundry, etc."
                                    required
                                />
                            </Field>

                            {/* Email */}
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="business@example.com"
                                    required
                                />
                            </Field>

                            {/* Contact Number */}
                            <Field>
                                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+977 98XXXXXXXX"
                                    required
                                />
                            </Field>

                            {/* Registration Number */}
                            <Field>
                                <FieldLabel htmlFor="registrationNumber">Registration Number</FieldLabel>
                                <Input
                                    id="registrationNumber"
                                    type="text"
                                    placeholder="Official business registration number"
                                    required
                                />
                            </Field>

                            {/* Registration Document */}
                            <Field>
                                <FieldLabel htmlFor="registrationDoc">Registration Document</FieldLabel>
                                <Input
                                    id="registrationDoc"
                                    type="file"
                                    accept=".pdf,.jpg,.png"
                                    required
                                />
                                <FieldDescription>
                                    Upload your official business registration document (PDF or Image)
                                </FieldDescription>
                            </Field>

                            {/* Password */}
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    required
                                />
                            </Field>

                            {/* Submit Button */}
                            <Field className="col-span-full">
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                                >
                                    Register as Business User
                                </Button>
                            </Field>

                            {/* Already account */}
                            <Field className="col-span-full">
                                <FieldDescription className="text-center text-md font-semibold mx-0">
                                    Already have an account?{" "}
                                    <a
                                        href="#"
                                        className="text-blue-800"
                                        onClick={() => setShowLogin(true)}
                                    >
                                        Sign In
                                    </a>
                                </FieldDescription>
                            </Field>

                        </FieldGroup>
                    </form>

                    <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
                </CardContent>
            </Card>
        </div>
    );
}
