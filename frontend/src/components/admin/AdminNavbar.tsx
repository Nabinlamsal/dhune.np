"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
    Building2,
    ChevronDown,
    Gavel,
    Layers,
    LayoutDashboard,
    LogOut,
    Menu,
    ShieldAlert,
    ShoppingBag,
    Star,
    Store,
    Users,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/src/hooks/auth/useLogout";
import { useMyProfile } from "@/src/hooks/users/useMyProfile";
import { formatDisplayId } from "@/src/utils/display";
import NotificationBell from "@/src/components/common/NotificationBell";

type NavItem = {
    href: string;
    label: string;
    icon: React.ReactNode;
    exact?: boolean;
};

export default function AdminNavbar() {
    const pathname = usePathname();
    const logout = useLogout();
    const { data: myProfile } = useMyProfile();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [operationsOpen, setOperationsOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const operationsRef = useRef<HTMLDivElement>(null);

    const primaryItems: NavItem[] = [
        { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, exact: true },
        { href: "/admin/users", label: "Users", icon: <Users className="h-4 w-4" /> },
        { href: "/admin/vendors", label: "Vendors", icon: <Store className="h-4 w-4" /> },
        { href: "/admin/disputes", label: "Disputes", icon: <ShieldAlert className="h-4 w-4" /> },
        { href: "/admin/ratings", label: "Ratings", icon: <Star className="h-4 w-4" /> },
        { href: "/admin/categories", label: "Categories", icon: <Layers className="h-4 w-4" /> },
    ];

    const operationsItems = useMemo<NavItem[]>(
        () => [
            { href: "/admin/orders", label: "Orders", icon: <ShoppingBag className="h-4 w-4" /> },
            { href: "/admin/offers", label: "Offers", icon: <Building2 className="h-4 w-4" /> },
            { href: "/admin/requests", label: "Requests", icon: <Gavel className="h-4 w-4" /> },
        ],
        []
    );

    const isActive = (item: NavItem) =>
        item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

    const operationsActive = operationsItems.some((item) => isActive(item));
    const allMobileItems = [...primaryItems, ...operationsItems];

    const displayName = myProfile?.DisplayName || "Admin";
    const email = myProfile?.Email || "--";
    const phone = myProfile?.Phone || "--";
    const adminId = formatDisplayId(myProfile?.ID, "ADM");
    const roleLabel = myProfile?.Role || "admin";
    const avatarInitial = displayName.charAt(0).toUpperCase() || "A";

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node;

            if (profileRef.current && !profileRef.current.contains(target)) {
                setProfileOpen(false);
            }

            if (operationsRef.current && !operationsRef.current.contains(target)) {
                setOperationsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 text-slate-900 shadow-sm backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#040947]/15 bg-gradient-to-br from-[#040947] to-[#0b1570] text-amber-200 shadow-sm">
                        <Building2 className="h-4 w-4" />
                    </div>
                    <div className="leading-tight">
                        <p className="text-sm font-semibold text-slate-900">Dhune.np</p>
                        <p className="text-xs text-slate-500">Admin Control Room</p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-1 lg:flex">
                    {primaryItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition",
                                isActive(item)
                                    ? "border-[#040947]/15 bg-[#040947] text-white shadow-sm"
                                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}

                    <div className="relative" ref={operationsRef}>
                        <button
                            type="button"
                            onClick={() => setOperationsOpen((value) => !value)}
                            className={cn(
                                "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition",
                                operationsActive || operationsOpen
                                    ? "border-amber-300 bg-amber-50 text-[#040947]"
                                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                            )}
                            aria-haspopup="menu"
                            aria-expanded={operationsOpen}
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Operations
                            <ChevronDown className={cn("h-4 w-4 transition", operationsOpen && "rotate-180")} />
                        </button>

                        {operationsOpen && (
                            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                                {operationsItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOperationsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                                            isActive(item)
                                                ? "bg-[#040947] text-white"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                <div className="flex items-center gap-2">
                    <NotificationBell role="admin" theme="light" />

                    <div className="relative hidden lg:block" ref={profileRef}>
                        <button
                            onClick={() => setProfileOpen((value) => !value)}
                            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50"
                            aria-haspopup="menu"
                            aria-expanded={profileOpen}
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#040947] text-xs font-semibold text-amber-100">
                                {avatarInitial}
                            </div>
                            <div className="text-left leading-tight">
                                <p className="text-xs font-semibold text-slate-900">{displayName}</p>
                                <p className="text-[11px] text-slate-500">Admin account</p>
                            </div>
                            <ChevronDown className={cn("h-4 w-4 text-slate-500 transition", profileOpen && "rotate-180")} />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#040947] text-sm font-semibold text-amber-100">
                                        {avatarInitial}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                                        <p className="text-xs text-slate-500">{email}</p>
                                        <span className="mt-1 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700">
                                            {roleLabel}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 py-3 text-xs">
                                    <div className="rounded-lg bg-slate-50 p-2">
                                        <p className="text-slate-500">Admin ID</p>
                                        <p className="font-medium text-slate-900">{adminId}</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 p-2">
                                        <p className="text-slate-500">Role</p>
                                        <p className="font-medium capitalize text-slate-900">{roleLabel}</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 p-2">
                                        <p className="text-slate-500">Phone</p>
                                        <p className="font-medium text-slate-900">{phone}</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 p-2">
                                        <p className="text-slate-500">Workspace</p>
                                        <p className="font-medium text-slate-900">Dhune.np</p>
                                    </div>
                                </div>

                                <button
                                    onClick={logout}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setMobileOpen((value) => !value)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 transition hover:bg-[#040947]/8 hover:text-[#040947] lg:hidden"
                        aria-label="Toggle admin navigation"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            <div className="hidden border-t border-slate-200/80 bg-slate-50/70 lg:block">
                <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 py-2 sm:px-6 lg:px-8">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Operations</span>
                    <div className="flex flex-wrap gap-2">
                        {operationsItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "rounded-full border px-3 py-1 text-xs font-medium transition",
                                    isActive(item)
                                        ? "border-amber-300 bg-amber-50 text-amber-800"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {mobileOpen && (
                <div className="border-t border-slate-200 bg-white lg:hidden">
                    <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6">
                        <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#040947] text-sm font-semibold text-amber-100">
                                    {avatarInitial}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                                    <p className="text-xs text-slate-500">{email}</p>
                                </div>
                            </div>
                        </div>

                        <nav className="flex flex-col gap-1">
                            {allMobileItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition",
                                        isActive(item)
                                            ? "border-[#040947]/15 bg-[#040947] text-white"
                                            : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}

                            <button
                                onClick={logout}
                                className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
