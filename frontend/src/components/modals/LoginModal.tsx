"use client";

import { LoginForm } from "../forms/LoginForm";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                <LoginForm />
            </div>
        </div>
    );
}
