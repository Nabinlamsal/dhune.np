"use client"

import Image from "next/image"
import {
    Bell,
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
import { useLogout } from "@/src/hooks/auth/useLogout"

export default function Sidebar() {
    const pathname = usePathname()
    const logout = useLogout()

    const menu = [
        { href: "/admin", label: "Dashboard", icon: <LayoutDashboard /> },
        { href: "/admin/users", label: "Users", icon: <Users /> },
        { href: "/admin/vendors", label: "Vendors", icon: <Store /> },
        { href: "/admin/orders", label: "Orders", icon: <ShoppingBag /> },
        { href: "/admin/offers", label: "Offers", icon: <Building2 /> },
        { href: "/admin/requests", label: "Requests", icon: <Gavel /> },
        { href: "/admin/payments", label: "Payments", icon: <CreditCard /> },
        { href: "/admin/categories", label: "Categories", icon: <Layers /> },
    ]

    return (
        <aside className="w-64 h-screen bg-[#040947] text-white flex flex-col border-r border-white/10">
            {/* Logo */}
            <div className="h-16 flex items-center gap-3 px-4 border-b border-white/10">
                <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-white/15 bg-white/10">
                    <Image
                        src="/logo.jpg"
                        alt="Dhune logo"
                        fill
                        sizes="36px"
                        className="object-cover"
                    />
                </div>
                <div>
                    <p className="text-sm font-semibold leading-none">Dhune.np</p>
                    <p className="mt-1 text-[11px] text-gray-400">Admin Panel</p>
                </div>
                <button className="relative ml-auto rounded-lg p-2 text-gray-200 transition hover:bg-white/10 hover:text-white">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-orange-400" />
                </button>
            </div>

            {/* Menu */}
            <div className="sidebar-scroll flex-1 px-3 py-4 space-y-1">
                {menu.map((item) => (
                    <SidebarItem
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        active={pathname === item.href}
                        compact
                    />
                ))}
            </div>

            {/* Bottom */}
            <div className="px-3 py-4 border-t border-white/10 space-y-1">
                <SidebarItem
                    href="/admin/settings"
                    label="Admin Settings"
                    icon={<Settings />}
                    compact
                />
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10">
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </aside>
    )
}
