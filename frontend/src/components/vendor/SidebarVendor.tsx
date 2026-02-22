"use client";

import {
    LayoutDashboard,
    Gavel,
    ShoppingBag,
    Store,
    Settings,
    LogOut,
    Menu,
    X,
} from "lucide-react";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLogout } from "@/src/hooks/auth/useLogout";
import SidebarItem from "../admin/SidebarItem";

export default function SidebarVendor() {
    const pathname = usePathname();
    const logout = useLogout();

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const menu = [
        { href: "/vendor", label: "Dashboard", icon: <LayoutDashboard /> },
        { href: "/vendor/marketplace", label: "Marketplace", icon: <Store /> },
        { href: "/vendor/offers", label: "My Offers", icon: <Gavel /> },
        { href: "/vendor/orders", label: "My Orders", icon: <ShoppingBag /> },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 bg-black text-white p-2 rounded-md"
                onClick={() => setMobileOpen(true)}
            >
                <Menu size={20} />
            </button>

            {/* Overlay (Mobile) */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={`
          fixed lg:static z-50
          h-screen bg-[#040947] text-white flex flex-col
          border-r border-white/10
          transition-all duration-300
          ${collapsed ? "w-18" : "w-54"}
          ${mobileOpen ? "left-0" : "-left-64"} 
          lg:left-0
        `}
            >
                {/* Top Section */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
                    {!collapsed && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-black font-bold">
                                V
                            </div>
                            <div>
                                <p className="font-semibold">Dhune.np</p>
                                <p className="text-xs text-gray-400">Vendor</p>
                            </div>
                        </div>
                    )}

                    {/* Collapse Toggle (Desktop) */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:block text-gray-400 hover:text-white"
                    >
                        {collapsed ? <Menu size={20} /> : <X size={20} />}
                    </button>

                    {/* Close Mobile */}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Menu */}
                <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                    {menu.map((item) => (
                        <SidebarItem
                            key={item.href}
                            href={item.href}
                            label={collapsed ? "" : item.label}
                            icon={item.icon}
                            active={pathname === item.href}
                            collapsed={collapsed}
                        />
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="px-2 py-4 border-t border-white/10 space-y-1">
                    <SidebarItem
                        href="/vendor/profile"
                        label={collapsed ? "" : "Profile & Settings"}
                        icon={<Settings />}
                        active={pathname === "/vendor/profile"}
                        collapsed={collapsed}
                    />

                    <button
                        onClick={logout}
                        className={`
              flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
              text-red-400 hover:bg-red-500/10
              ${collapsed ? "justify-center" : ""}
            `}
                    >
                        <LogOut className="w-5 h-5" />
                        {!collapsed && "Logout"}
                    </button>
                </div>
            </aside>
        </>
    );
}