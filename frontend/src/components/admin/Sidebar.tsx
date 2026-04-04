"use client"

import {
    Bell,
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    Users,
    Building2,
    ShoppingBag,
    Gavel,
    CreditCard,
    Layers,
    Star,
    ShieldAlert,
    LogOut,
    Store,
} from "lucide-react"
import SidebarItem from "./SidebarItem"
import { usePathname } from "next/navigation"
import { useLogout } from "@/src/hooks/auth/useLogout"
import { cn } from "@/lib/utils"
import { useMemo, useState } from "react"

export default function Sidebar() {
    const pathname = usePathname()
    const logout = useLogout()
    const [flowOpen, setFlowOpen] = useState(false)

    const menu = [
        { href: "/admin", label: "Dashboard", icon: <LayoutDashboard /> },
        { href: "/admin/users", label: "Users", icon: <Users /> },
        { href: "/admin/vendors", label: "Vendors", icon: <Store /> },
        { href: "/admin/disputes", label: "Disputes", icon: <ShieldAlert /> },
        { href: "/admin/ratings", label: "Ratings", icon: <Star /> },
        { href: "/admin/payments", label: "Payments", icon: <CreditCard /> },
        { href: "/admin/categories", label: "Categories", icon: <Layers /> },
    ]

    const flowMenu = useMemo(
        () => [
            { href: "/admin/orders", label: "Orders", icon: <ShoppingBag /> },
            { href: "/admin/offers", label: "Offers", icon: <Building2 /> },
            { href: "/admin/requests", label: "Requests", icon: <Gavel /> },
        ],
        []
    )

    const isActive = (href: string) =>
        href === "/admin"
            ? pathname === "/admin"
            : pathname === href || pathname.startsWith(`${href}/`)

    const isFlowActive = flowMenu.some((item) => isActive(item.href))

    return (
        <aside
            className="sticky top-0 flex h-[100dvh] w-64 shrink-0 flex-col border-r border-[#040947]/70 bg-[#040947] text-slate-100"
        >
            <div className="flex h-14 items-center justify-between border-b border-[#13206e] px-3 py-2">
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
            <div className="flex-1 space-y-1 px-2.5 py-2.5">
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

                <div
                    className="relative"
                    onMouseEnter={() => setFlowOpen(true)}
                    onMouseLeave={() => setFlowOpen(false)}
                >
                    <button
                        type="button"
                        onClick={() => setFlowOpen((open) => !open)}
                        className={cn(
                            "group flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-xs font-medium transition",
                            isFlowActive
                                ? "border-amber-300/70 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-[#040947] shadow-sm"
                                : "text-slate-200 hover:border-amber-300/40 hover:bg-amber-400/15 hover:text-amber-100"
                        )}
                    >
                        <span className="h-4 w-4 shrink-0">
                            <ShoppingBag className="h-4 w-4" />
                        </span>
                        <span className="flex-1 text-left">Orders Flow</span>
                        {flowOpen ? (
                            <ChevronDown className="h-4 w-4 shrink-0" />
                        ) : (
                            <ChevronRight className="h-4 w-4 shrink-0" />
                        )}
                    </button>

                    {flowOpen && (
                        <div className="absolute left-full top-0 z-20 ml-2 w-44 rounded-xl border border-[#13206e] bg-[#0a1154] p-2 shadow-2xl">
                            <div className="space-y-1">
                                {flowMenu.map((item) => (
                                    <SidebarItem
                                        key={item.href}
                                        href={item.href}
                                        label={item.label}
                                        icon={item.icon}
                                        active={isActive(item.href)}
                                        compact
                                        className="bg-[#040947]/30 hover:bg-[#040947]/40"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-[#13206e] px-2.5 py-2.5">
                <div className="rounded-xl border border-amber-300/20 bg-[#0a1154] p-2">
                    <button
                        onClick={logout}
                        type="button"
                        aria-label="Logout"
                        className="mt-2 flex w-full items-center gap-3 rounded-lg border border-red-300/40 bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-400/20 hover:text-red-100"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    )
}
