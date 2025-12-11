
import { cn } from "@/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/src/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@/src/components/ui/field"
import { Input } from "@/src/components/ui/input"
import { VendorSignupForm } from "./VendorSignupForm"
import { BusinessSignupForm } from "./BusinessSignupForm"
import { useState } from "react"


export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [showVendorSignup, setShowVendorSignup] = useState(false);
    const [showBusinessUserSignup, setShowBusinessUserSignup] = useState(false);
    const [showNormalUserSignup, setShowNormalUserSignup] = useState(false);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-yellow-600">Dhune.np</CardTitle>
                    <CardDescription className="font-light text-[#040947]">
                        Login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@gmail.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
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
                            <Field>
                                <Button className="bg-[#040947] hover:bg-[#121008ea]" type="submit">Login</Button>
                                <Button className="bg-[#6187c2] hover:bg-[#357ae8]" variant="outline" type="button">
                                    Login with Google
                                </Button>
                                <FieldDescription className="text-center">
                                    Don't have an account?{" "}

                                    <select
                                        className="border border-amber-400 rounded-md px-2 py-1 ml-1 text-[#121008ea] bg-amber-400font-semibold cursor-pointer"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!value) return;

                                            // Redirect depending on selection
                                            if (value === "normal") window.location.href = "/signup/normal";
                                            if (value === "business") window.location.href = "/signup/business";
                                            if (value === "vendor") window.location.href = "/signup/vendor";
                                        }}
                                    >
                                        <option value="" hidden>Sign up as...</option>
                                        <option value="normal" onClick={() => setShowNormalUserSignup(true)}>Normal User</option>
                                        <option value="business" onClick={() => setShowBusinessUserSignup(true)}>Business User</option>
                                        <option value="vendor" onClick={() => setShowVendorSignup(true)}>Laundry Vendor</option>
                                    </select>
                                </FieldDescription>

                            </Field>
                        </FieldGroup>
                    </form>
                    <NormalUserSignupForm open={showNormalUserSignup} onClose={() => setShowNormalUserSignup(false)} />
                    <BusinessSignupForm open={showBusinessUserSignup} onClose={() => setShowBusinessUserSignup(false)} />
                    <VendorSignupForm open={showVendorSignup} onClose={() => setShowVendorSignup(false)} />
                </CardContent>
            </Card>
        </div>
    )
}
