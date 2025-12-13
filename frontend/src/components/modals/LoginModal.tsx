"use client";

import { LoginForm } from "../forms/LoginForm";
import { UserSignupForm } from "../forms/UserSignupForm";
import { BusinessSignupForm } from "../forms/BusinessSignupForm";
import { VendorSignupForm } from "../forms/VendorSignupForm";
import { useState } from "react";

type AuthView = "login" | "user_signup" | "business_signup" | "vendor_signup"
export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {

    const [view, setView] = useState<AuthView>("login");
    if (!open) return null;

    const modalWidth = view === "login" ? "max-w-md" : "max-w-4xl";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div
                className={`bg-white p-6 rounded-xl shadow-xl w-full ${modalWidth} relative transition-all duration-300`}
            >

                {/* Close Button */}
                <button
                    onClick={() => {
                        setView("login");
                        onClose();
                    }}
                >
                    ✕
                </button>


                {view == "login" && <LoginForm onSignupSelect={(view) => setView(view as AuthView)} />}
                {view == "user_signup" && <UserSignupForm onBack={() => setView("login")} />}
                {view == "business_signup" && <BusinessSignupForm onBack={() => setView("login")} />}
                {view == "vendor_signup" && <VendorSignupForm onBack={() => setView("login")} />}
            </div>
        </div>
    );
}
