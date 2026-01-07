"use client"

import {
    LayoutDashboard,
    Users,
    Building2,
    Store,
    ShoppingBag,
    Gavel,
    CreditCard,
    Layers,
    Settings,
    LogOut,
} from "lucide-react"
import SidebarItem from "./SidebarItem"
import { usePathname } from "next/navigation"

export default function Sidebar() {
    const pathname = usePathname()

    const menu = [
        { href: "/admin", label: "Dashboard", icon: <LayoutDashboard /> },
        { href: "/admin/users", label: "Users", icon: <Users /> },
        { href: "/admin/business", label: "Business Accounts", icon: <Building2 /> },
        { href: "/admin/vendors", label: "Vendors", icon: <Store /> },
        { href: "/admin/orders", label: "Orders", icon: <ShoppingBag /> },
        { href: "/admin/marketplace", label: "Requests & Offers", icon: <Gavel /> },
        { href: "/admin/payments", label: "Payments", icon: <CreditCard /> },
        { href: "/admin/categories", label: "Categories", icon: <Layers /> },
    ]

    return (
        <aside className="w-64 h-screen bg-black text-white flex flex-col border-r border-white/10">
            {/* Logo */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
                <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-black font-bold">
                    D
                </div>
                <div>
                    <p className="font-semibold">Dhune.np</p>
                    <p className="text-xs text-gray-400">Admin Panel</p>
                </div>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {menu.map((item) => (
                    <SidebarItem
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        active={pathname === item.href}
                    />
                ))}
            </div>

            {/* Bottom */}
            <div className="px-3 py-4 border-t border-white/10 space-y-1">
                <SidebarItem
                    href="/admin/settings"
                    label="Admin Settings"
                    icon={<Settings />}
                />
                <button className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    )
}
