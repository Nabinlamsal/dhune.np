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

export function VendorSignupForm({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Vendor Signup</CardTitle>
                    <CardDescription>
                        Fill in your business details to register as a vendor
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="businessName">Business/Company Name</FieldLabel>
                                <Input id="businessName" type="text" placeholder="Your business name" required />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="address">Address</FieldLabel>
                                <Input id="address" type="text" placeholder="Business address" required />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="contactNumber">Contact Number</FieldLabel>
                                <Input id="contactNumber" type="tel" placeholder="+977 98XXXXXXXX" required />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input id="email" type="email" placeholder="business@example.com" required />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="panVatNumber">PAN/VAT Number</FieldLabel>
                                <Input id="panVatNumber" type="text" placeholder="PAN or VAT number" required />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="regdNumber">Registration Number</FieldLabel>
                                <Input id="regdNumber" type="text" placeholder="Business registration number" required />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="panVatDoc">PAN/VAT Document</FieldLabel>
                                <Input id="panVatDoc" type="file" accept=".pdf,.jpg,.png" required />
                                <FieldDescription>Upload your PAN/VAT document (PDF or image)</FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="regdDoc">Registration Document</FieldLabel>
                                <Input id="regdDoc" type="file" accept=".pdf,.jpg,.png" required />
                                <FieldDescription>Upload your business registration document</FieldDescription>
                            </Field>

                            <Field>
                                <Button type="submit">Register as Vendor</Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
