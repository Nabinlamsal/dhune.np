// components/ui/VendorSignupForm.tsx
"use client";

import { cn } from "@/lib/utils";
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
import { useSignup } from "@/src/hooks/auth/useSignup";

export function VendorSignupForm({ onBack }: { onBack: () => void }) {
    const { mutate, isPending } = useSignup();

    const [name, setName] = useState("");
    const [owner, setOwner] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [password, setPassword] = useState("");
    const [documentFile, setDocumentFile] = useState<File | null>(null);

    return (
        <div
            className={cn(
                "bg-white rounded-xl p-6 w-full max-w-5xl max-h-[80vh] overflow-y-auto"
            )}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-yellow-600">
                        Vendor Signup - Dhune.np
                    </CardTitle>
                    <CardDescription>
                        Provide your business details to register as a vendor.
                        <br />
                        <span className="text-red-600 font-semibold">
                            All details must match your official registration document.
                        </span>
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();

                            const formData = new FormData();

                            formData.append("role", "vendor");
                            formData.append("display_name", name);
                            formData.append("email", email);
                            formData.append("phone", phoneNumber);
                            formData.append("password", password);
                            formData.append("owner_name", owner);
                            formData.append("address", address);
                            formData.append(
                                "registration_number",
                                registrationNumber
                            );

                            if (documentFile) {
                                formData.append("document", documentFile);
                            }

                            mutate(formData);
                        }}
                    >
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Business / Shop Name */}
                            <Field>
                                <FieldLabel htmlFor="businessName">
                                    Business / Company Name
                                </FieldLabel>
                                <Input
                                    id="businessName"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Example: LaundryHub Pvt Ltd"
                                    required
                                />
                            </Field>

                            {/* Business Address */}
                            <Field>
                                <FieldLabel htmlFor="address">
                                    Business Address
                                </FieldLabel>
                                <Input
                                    id="address"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Business location"
                                    required
                                />
                            </Field>

                            {/* Business Contact Number */}
                            <Field>
                                <FieldLabel htmlFor="contactNumber">
                                    Business Contact Number
                                </FieldLabel>
                                <Input
                                    id="contactNumber"
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                        setPhoneNumber(e.target.value)
                                    }
                                    placeholder="+977 98XXXXXXXX"
                                    required
                                />
                            </Field>

                            {/* Business Email */}
                            <Field>
                                <FieldLabel htmlFor="email">
                                    Business Email
                                </FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="company@example.com"
                                    required
                                />
                            </Field>

                            {/* Registration Number */}
                            <Field>
                                <FieldLabel htmlFor="regdNumber">
                                    Registration Number
                                </FieldLabel>
                                <Input
                                    id="regdNumber"
                                    type="text"
                                    value={registrationNumber}
                                    onChange={(e) =>
                                        setRegistrationNumber(e.target.value)
                                    }
                                    placeholder="Business registration number"
                                    required
                                />
                            </Field>

                            {/* Registration Document */}
                            <Field>
                                <FieldLabel htmlFor="regdDoc">
                                    Registration Document
                                </FieldLabel>
                                <Input
                                    id="regdDoc"
                                    type="file"
                                    accept=".pdf,.jpg,.png"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setDocumentFile(file);
                                    }}
                                    required
                                />
                                <FieldDescription>
                                    Upload the official business registration
                                    document (PDF or Image)
                                </FieldDescription>
                            </Field>

                            {/* Owner Full Name */}
                            <Field>
                                <FieldLabel htmlFor="ownerName">
                                    Owner Full Name
                                </FieldLabel>
                                <Input
                                    id="ownerName"
                                    type="text"
                                    value={owner}
                                    onChange={(e) => setOwner(e.target.value)}
                                    placeholder="Owner’s full legal name"
                                    required
                                />
                            </Field>

                            {/* Password */}
                            <Field>
                                <FieldLabel htmlFor="password">
                                    Password
                                </FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Create a strong password"
                                    required
                                />
                            </Field>

                            {/* Submit Button */}
                            <Field className="col-span-full">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-[#ebbc01] hover:bg-[#040947] hover:text-yellow-500 text-black font-bold py-2 px-4 rounded w-full"
                                >
                                    {isPending
                                        ? "Registering..."
                                        : "Register as Vendor"}
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
