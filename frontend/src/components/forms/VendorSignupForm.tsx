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
import { isValidPhone, sanitizePhoneInput } from "@/src/utils/phone";
import { AxiosError } from "axios";
import LeafletLocationMap from "@/src/components/maps/LeafletLocationMap";

const DEFAULT_VENDOR_LOCATION = {
    latitude: 27.7172,
    longitude: 85.324,
};

export function VendorSignupForm({ onBack, onSignupSuccess }: { onBack: () => void; onSignupSuccess?: (email: string) => void }) {
    const { mutate, isPending } = useSignup();

    const [name, setName] = useState("");
    const [owner, setOwner] = useState("");
    const [address, setAddress] = useState("");
    const [businessLatitude, setBusinessLatitude] = useState<number | null>(null);
    const [businessLongitude, setBusinessLongitude] = useState<number | null>(null);
    const [serviceRadiusKm, setServiceRadiusKm] = useState("5");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [password, setPassword] = useState("");
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    return (
        <div
            className={cn(
                "w-full max-w-5xl max-h-[80vh] overflow-y-auto rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl"
            )}
        >
            <Card className="border-border bg-card text-card-foreground shadow-none">
                <CardHeader>
                    <CardTitle className="text-yellow-600 dark:text-[#ebbc01]">
                        Vendor Signup - Dhune.np
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Provide your business details to register as a vendor.
                        <br />
                        <span className="text-red-600 font-semibold dark:text-red-300">
                            All details must match your official registration document.
                        </span>
                    </CardDescription>
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
                            if (businessLatitude !== null && businessLongitude !== null) {
                                formData.append("business_latitude", String(businessLatitude));
                                formData.append("business_longitude", String(businessLongitude));
                            }
                            if (serviceRadiusKm.trim()) {
                                formData.append("service_radius_km", serviceRadiusKm.trim());
                            }

                            if (documentFile) {
                                formData.append("document", documentFile);
                            }

                            mutate(formData, {
                                onSuccess: (data) => {
                                    const submittedEmail = email;
                                    setName("");
                                    setOwner("");
                                    setAddress("");
                                    setBusinessLatitude(null);
                                    setBusinessLongitude(null);
                                    setServiceRadiusKm("5");
                                    setPhoneNumber("");
                                    setEmail("");
                                    setRegistrationNumber("");
                                    setPassword("");
                                    setDocumentFile(null);

                                    setSuccessMessage(data.response_message ?? data.message ?? "Registration successful! Verify your email OTP and then wait for admin approval.");
                                    setTimeout(() => {
                                        if (onSignupSuccess) {
                                            onSignupSuccess(submittedEmail);
                                        }
                                    }, 1500);
                                },
                                onError: (error) => {
                                    const axiosError = error as AxiosError<{ error?: string }>;
                                    setErrorMessage(axiosError.response?.data?.error ?? "Something went wrong. Please try again.");
                                },
                            });
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

                            <Field className="md:col-span-2">
                                <FieldLabel>Business Location</FieldLabel>
                                <LeafletLocationMap
                                    latitude={businessLatitude ?? DEFAULT_VENDOR_LOCATION.latitude}
                                    longitude={businessLongitude ?? DEFAULT_VENDOR_LOCATION.longitude}
                                    editable
                                    height={260}
                                    onLocationChange={({ latitude, longitude }) => {
                                        setBusinessLatitude(latitude);
                                        setBusinessLongitude(longitude);
                                    }}
                                />
                                <FieldDescription>
                                    Tap or drag the marker to select your shop location. The address above remains the official text address.
                                </FieldDescription>
                                <div className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                                    <span>Lat: {businessLatitude !== null ? businessLatitude.toFixed(6) : "Not selected"}</span>
                                    <span>Lng: {businessLongitude !== null ? businessLongitude.toFixed(6) : "Not selected"}</span>
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="serviceRadius">
                                    Service Radius (km)
                                </FieldLabel>
                                <Input
                                    id="serviceRadius"
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={serviceRadiusKm}
                                    onChange={(e) => setServiceRadiusKm(e.target.value)}
                                    placeholder="5"
                                />
                                <FieldDescription>
                                    Used later to prioritize nearby pickup requests.
                                </FieldDescription>
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
                                        setPhoneNumber(sanitizePhoneInput(e.target.value))
                                    }
                                    placeholder="98XXXXXXXX"
                                    maxLength={10}
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
                                {successMessage && (
                                    <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-sm dark:bg-[#ebbc01]/15 dark:text-[#ebbc01]">
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
                                    disabled={isPending}
                                    className="bg-[#ebbc01] hover:bg-[#040947] hover:text-yellow-500 text-black font-bold py-2 px-4 rounded w-full dark:hover:text-[#ebbc01]"
                                >
                                    {isPending
                                        ? "Registering..."
                                        : "Register as Vendor"}
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
