"use client"

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

    const isActive = (href: string) =>
        href === "/admin"
            ? pathname === "/admin"
            : pathname === href || pathname.startsWith(`${href}/`)

    return (
        <aside
            className="flex h-screen w-64 flex-col border-r border-[#040947]/70 bg-[#040947] text-slate-100"
        >
            <div className="flex h-16 items-center justify-between border-b border-[#13206e] px-3 py-3">
                <div>
                    <p className="text-sm font-semibold leading-none text-white">Admin Panel</p>
                    <p className="mt-1 text-[11px] text-amber-200/80">Dhune.np workspace</p>
                </div>
                <button className="relative rounded-lg p-2 text-slate-300 transition hover:bg-amber-300/15 hover:text-amber-100">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
                </button>
            </div>

            {/* Menu */}
            <div className="flex-1 space-y-1.5 px-3 py-3">
                {menu.map((item) => (
                    <SidebarItem
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        active={isActive(item.href)}
                        compact
                    />
                ))}
            </div>

            {/* Bottom */}
            <div className="border-t border-[#13206e] px-3 py-3">
                <div className="space-y-2 rounded-xl border border-amber-300/20 bg-[#0a1154] p-2.5">
                    <SidebarItem
                        href="/admin/settings"
                        label="Settings"
                        icon={<Settings />}
                        active={isActive("/admin/settings")}
                        compact
                        className="bg-[#040947]/30 hover:bg-[#040947]/40"
                    />
                    <button
                        onClick={logout}
                        type="button"
                        aria-label="Logout"
                        className="mt-3 flex w-full items-center gap-3 rounded-lg border border-red-300/40 bg-red-400/10 px-3 py-2.5 text-xs font-semibold text-red-200 transition hover:bg-red-400/20 hover:text-red-100"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    )
}
