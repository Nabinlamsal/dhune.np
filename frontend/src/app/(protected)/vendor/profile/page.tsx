"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useMyProfile, useUpdateMyProfile, useUploadProfileImage } from "@/src/hooks/users/useMyProfile";
import { useChangePassword } from "@/src/hooks/auth/useAuthActions";
import { isValidPhone, sanitizePhoneInput } from "@/src/utils/phone";
import { AxiosError } from "axios";

const getApiError = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ error?: string }>;
    return axiosError.response?.data?.error ?? fallback;
};

export default function VendorProfilePage() {
    const { data: profile, isLoading } = useMyProfile();
    const updateProfile = useUpdateMyProfile();
    const uploadProfileImage = useUploadProfileImage();
    const changePassword = useChangePassword();

    const [phone, setPhone] = useState<string | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    if (isLoading) {
        return <div className="text-sm text-slate-500">Loading profile...</div>;
    }

    if (!profile) {
        return <div className="text-sm text-red-600">Unable to load profile.</div>;
    }

    const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setProfileError(null);

        const nextPhone = phone ?? profile.Phone ?? "";

        if (!isValidPhone(nextPhone)) {
            setProfileError("Phone number must be exactly 10 digits.");
            return;
        }

        updateProfile.mutate(
            { phone: nextPhone },
            {
                onError: (error) => {
                    setProfileError(getApiError(error, "Unable to update profile."));
                },
            }
        );
    };

    const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPasswordError(null);

        if (newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New password and confirm password must match.");
            return;
        }

        changePassword.mutate(
            {
                old_password: oldPassword,
                new_password: newPassword,
            },
            {
                onSuccess: () => {
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                },
                onError: (error) => {
                    setPasswordError(getApiError(error, "Unable to change password."));
                },
            }
        );
    };

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        setImageError(null);
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        uploadProfileImage.mutate(file, {
            onError: (error) => {
                setImageError(getApiError(error, "Unable to upload profile image."));
            },
        });
    };

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-semibold text-[#040947]">Profile Settings</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Update your vendor contact details, profile image, and password.
                </p>
            </section>

            <div className="grid gap-6 xl:grid-cols-3">
                <Card className="xl:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile Overview</CardTitle>
                        <CardDescription>Your vendor profile information from the current account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            {profile.ProfileImageURL ? (
                                <img
                                    src={profile.ProfileImageURL}
                                    alt={profile.DisplayName}
                                    className="h-20 w-20 rounded-full border border-slate-200 object-cover"
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#040947]/10 text-2xl font-semibold text-[#040947]">
                                    {(profile.DisplayName || "V").charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="text-base font-semibold text-slate-900">{profile.DisplayName}</p>
                                <p className="text-sm text-slate-500">{profile.Email}</p>
                                <p className="mt-1 text-xs uppercase tracking-wide text-amber-700">
                                    {profile.VendorApprovalStatus ?? profile.VendorProfile?.ApprovalStatus ?? "pending"}
                                </p>
                            </div>
                        </div>

                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="profile-image">Profile Image</FieldLabel>
                                <Input
                                    id="profile-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploadProfileImage.isPending}
                                />
                                <FieldDescription>Upload a new profile image for your vendor account.</FieldDescription>
                            </Field>
                            {imageError ? <p className="text-sm text-red-600">{imageError}</p> : null}
                        </FieldGroup>

                        <div className="rounded-lg bg-slate-50 p-4 text-sm">
                            <p className="font-medium text-slate-900">Vendor restrictions</p>
                            <p className="mt-1 text-slate-600">
                                Vendor name cannot be changed from the frontend. Only phone, password, and profile image are editable.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6 xl:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Details</CardTitle>
                            <CardDescription>Keep your reachable phone number up to date.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileSubmit}>
                                <FieldGroup className="grid gap-6 md:grid-cols-2">
                                    <Field>
                                        <FieldLabel htmlFor="business-name">Business Name</FieldLabel>
                                        <Input id="business-name" value={profile.DisplayName} disabled />
                                        <FieldDescription>Business name is locked for vendor accounts.</FieldDescription>
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="owner-name">Owner Name</FieldLabel>
                                        <Input id="owner-name" value={profile.VendorProfile?.OwnerName ?? ""} disabled />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="phone">Phone</FieldLabel>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={phone ?? profile.Phone ?? ""}
                                            onChange={(event) => setPhone(sanitizePhoneInput(event.target.value))}
                                            maxLength={10}
                                            required
                                        />
                                        <FieldDescription>Phone number must be exactly 10 digits.</FieldDescription>
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input id="email" type="email" value={profile.Email} disabled />
                                    </Field>

                                    <Field className="md:col-span-2">
                                        {profileError ? <p className="mb-2 text-sm text-red-600">{profileError}</p> : null}
                                        <Button type="submit" className="bg-[#040947] hover:bg-[#09106a]" disabled={updateProfile.isPending}>
                                            {updateProfile.isPending ? "Saving..." : "Save changes"}
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your password without affecting the rest of your account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordSubmit}>
                                <FieldGroup className="grid gap-6 md:grid-cols-2">
                                    <Field>
                                        <FieldLabel htmlFor="old-password">Current Password</FieldLabel>
                                        <Input
                                            id="old-password"
                                            type="password"
                                            value={oldPassword}
                                            onChange={(event) => setOldPassword(event.target.value)}
                                            required
                                        />
                                    </Field>

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
                                    </Field>

                                    <Field className="md:col-span-2">
                                        {passwordError ? <p className="mb-2 text-sm text-red-600">{passwordError}</p> : null}
                                        <Button type="submit" className="bg-[#040947] hover:bg-[#09106a]" disabled={changePassword.isPending}>
                                            {changePassword.isPending ? "Updating..." : "Change password"}
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
