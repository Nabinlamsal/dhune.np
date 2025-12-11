"use client";

import { BusinessSignupForm } from "../forms/BusinessSignupForm";

export default function BusinessUserSignupModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-4xl relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
                <BusinessSignupForm />
            </div>
        </div>
    );
}
