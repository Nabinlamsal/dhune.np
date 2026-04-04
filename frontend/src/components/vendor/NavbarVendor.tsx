"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Gavel,
    ShoppingBag,
    Store,
    Star,
    ShieldAlert,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/src/hooks/auth/useLogout";
import { useMyProfile } from "@/src/hooks/users/useMyProfile";
import { formatDisplayId } from "@/src/utils/display";

type NavItem = {
    href: string;
    label: string;
    icon: React.ReactNode;
    exact?: boolean;
};

export default function NavbarVendor() {
    const pathname = usePathname();
    const logout = useLogout();
    const { data: myProfile } = useMyProfile();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const navItems: NavItem[] = [
        { href: "/vendor", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, exact: true },
        { href: "/vendor/marketplace", label: "Marketplace", icon: <Store className="h-4 w-4" /> },
        { href: "/vendor/my-offers", label: "My Offers", icon: <Gavel className="h-4 w-4" /> },
        { href: "/vendor/my-orders", label: "My Orders", icon: <ShoppingBag className="h-4 w-4" /> },
        { href: "/vendor/disputes", label: "Disputes", icon: <ShieldAlert className="h-4 w-4" /> },
        { href: "/vendor/ratings", label: "Ratings", icon: <Star className="h-4 w-4" /> },
    ];

    const isActive = (item: NavItem) =>
        item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

    const businessName = myProfile?.DisplayName || "Vendor";
    const ownerName = myProfile?.VendorProfile?.OwnerName || myProfile?.DisplayName || "Vendor User";
    const email = myProfile?.Email || "--";
    const phone = myProfile?.Phone || "--";
    const vendorId = formatDisplayId(myProfile?.ID, "VND");
    const registrationNumber = myProfile?.VendorProfile?.RegistrationNumber || "--";
    const address = myProfile?.VendorProfile?.Address || "--";
    const vendorStatus = myProfile?.VendorApprovalStatus ?? myProfile?.VendorProfile?.ApprovalStatus ?? "pending";
    const avatarInitial = businessName.charAt(0).toUpperCase() || "V";

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/vendor" className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#040947]/20 bg-gradient-to-br from-[#040947]/5 to-amber-50 text-[#040947]">
                        <Building2 className="h-4 w-4" />
                    </div>
                    <div className="leading-tight">
                        <p className="text-sm font-semibold text-slate-900">Dhune.np</p>
                        <p className="text-xs text-slate-500">Vendor Workspace</p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-1 lg:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition",
                                isActive(item)
                                    ? "border-[#040947]/20 bg-[#040947]/8 text-[#040947]"
                                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <div className="relative hidden lg:block" ref={profileRef}>
                        <button
                            onClick={() => setProfileOpen((v) => !v)}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50"
                            aria-haspopup="menu"
                            aria-expanded={profileOpen}
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#040947]/20 bg-[#040947]/8 text-xs font-semibold text-[#040947]">
                                {avatarInitial}
                            </div>
                            <div className="text-left leading-tight">
                                <p className="text-xs font-semibold text-slate-900">{businessName}</p>
                                <p className="text-[11px] text-slate-500">Vendor account</p>
                            </div>
                            <ChevronDown className={cn("h-4 w-4 text-slate-500 transition", profileOpen && "rotate-180")} />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 text-slate-700 shadow-lg">
                                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                                        {avatarInitial}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{ownerName}</p>
                                        <p className="text-xs text-slate-500">{email}</p>
                                        <span className="mt-1 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-800">
                                            {vendorStatus}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 py-3 text-xs">
                                    <div className="rounded-lg bg-slate-50 p-2">
                                        <p className="text-slate-500">Business</p>
                                        <p className="font-medium text-slate-900">{businessName}</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 p-2">
                                        <p className="text-slate-500">Vendor ID</p>
                                        <p className="font-medium text-slate-900">{vendorId}</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 p-2">
                                        <p className="text-slate-500">Phone</p>
                                        <p className="font-medium text-slate-900">{phone}</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 p-2">
                                        <p className="text-slate-500">Reg. Number</p>
                                        <p className="font-medium text-slate-900">{registrationNumber}</p>
                                    </div>
                                    <div className="col-span-2 rounded-lg bg-slate-50 p-2">
                                        <p className="text-slate-500">Address</p>
                                        <p className="font-medium text-slate-900">{address}</p>
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
                        onClick={() => setMobileOpen((v) => !v)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 transition hover:bg-[#040947]/8 hover:text-[#040947] lg:hidden"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="border-t border-slate-200 bg-white lg:hidden">
                    <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
                        <div className="mb-2 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                                    {avatarInitial}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-900">{ownerName}</p>
                                    <p className="text-[11px] text-slate-500">{businessName}</p>
                                </div>
                            </div>
                            <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-amber-700">
                                {vendorStatus}
                            </span>
                        </div>

                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition",
                                    isActive(item)
                                        ? "border-[#040947]/20 bg-[#040947]/8 text-[#040947]"
                                        : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}

                        <button
                            onClick={logout}
                            className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
}
