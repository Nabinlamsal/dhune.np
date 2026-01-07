"use client"

import { Bell } from "lucide-react"

export default function Topbar() {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>

            <div className="flex items-center gap-4">
                <button className="relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
                </button>

                <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-black font-semibold">
                    A
                </div>
            </div>
        </header>
    )
}
