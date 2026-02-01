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
import { useLogin } from "@/src/hooks/auth/useLogin"
import { useState } from "react"
import router from "next/navigation"

export function LoginForm({
    onSignupSelect
}: { onSignupSelect: (type: "user_signup" | "business_signup" | "vendor_signup") => void }) {


    return (
        <div className={cn("w-1/3 gap-6")}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-yellow-600">Dhune.np</CardTitle>
                    <CardDescription className="font-light text-[#040947]">
                        Login to your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={(e) => e.preventDefault()
                        }>
                        <FieldGroup>

                            {/* Email */}
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@gmail.com"
                                    required
                                />
                            </Field>

                            {/* Password */}
                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline hover:text-[#040947]"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" type="password" required />
                            </Field>

                            {/* Login Buttons */}
                            <Field>
                                <Button className="bg-[#040947] hover:bg-[#121008ea]" type="submit">
                                    Login
                                </Button>

                                <Button
                                    className="bg-[#6187c2] hover:bg-[#357ae8] mt-2"
                                    variant="outline"
                                    type="button"
                                >
                                    Login with Google
                                </Button>

                                {/* SIGNUP DROPDOWN (FINAL) */}
                                <FieldDescription className="text-center mt-4">
                                    Don&apos;t have an account?
                                    <Select
                                        onValueChange={(value) => onSignupSelect(value as any)
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
