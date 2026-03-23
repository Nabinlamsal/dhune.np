"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Gavel,
    ShoppingBag,
    Store,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronDown,
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
        <header className="sticky top-0 z-40 border-b border-[#040947]/10 bg-[#040947] text-white shadow-sm">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/vendor" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 font-bold text-black">
                        V
                    </div>
                    <div className="leading-tight">
                        <p className="font-semibold">Dhune.np</p>
                        <p className="text-xs text-gray-300">Vendor Portal</p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-2 lg:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1.5 text-xs font-medium tracking-wide transition",
                                isActive(item)
                                    ? "bg-white/10 text-white"
                                    : "text-gray-300 hover:bg-white/8 hover:text-white"
                            )}
                        >
                            {item.icon}
                            {item.label}
                            {isActive(item) && (
                                <span className="absolute inset-x-2 -bottom-1 h-[2px] rounded-full bg-orange-400" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        className="relative hidden rounded-lg border border-white/15 p-2 text-gray-200 transition hover:bg-white/10 hover:text-white lg:inline-flex"
                        aria-label="View notifications"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-400" />
                    </button>

                    <div className="relative hidden lg:block" ref={profileRef}>
                        <button
                            onClick={() => setProfileOpen((v) => !v)}
                            className="flex items-center gap-2 rounded-lg border border-white/15 px-2 py-1.5 transition hover:bg-white/10"
                            aria-haspopup="menu"
                            aria-expanded={profileOpen}
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs font-semibold text-white">
                                {avatarInitial}
                            </div>
                            <div className="text-left leading-tight">
                                <p className="text-xs font-semibold text-white">{businessName}</p>
                                <p className="text-[11px] capitalize text-gray-300">{vendorStatus} vendor</p>
                            </div>
                            <ChevronDown className={cn("h-4 w-4 text-gray-300 transition", profileOpen && "rotate-180")} />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-4 text-gray-700 shadow-xl">
                                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#040947] text-sm font-semibold text-white">
                                        {avatarInitial}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{ownerName}</p>
                                        <p className="text-xs text-gray-500">{email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 py-3 text-xs">
                                    <div className="rounded-lg bg-gray-50 p-2">
                                        <p className="text-gray-500">Business</p>
                                        <p className="font-medium text-gray-900">{businessName}</p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-2">
                                        <p className="text-gray-500">Vendor ID</p>
                                        <p className="font-medium text-gray-900">{vendorId}</p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-2">
                                        <p className="text-gray-500">Phone</p>
                                        <p className="font-medium text-gray-900">{phone}</p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-2">
                                        <p className="text-gray-500">Reg. Number</p>
                                        <p className="font-medium text-gray-900">{registrationNumber}</p>
                                    </div>
                                    <div className="col-span-2 rounded-lg bg-gray-50 p-2">
                                        <p className="text-gray-500">Address</p>
                                        <p className="font-medium text-gray-900">{address}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={logout}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setMobileOpen((v) => !v)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-200 transition hover:bg-white/10 hover:text-white lg:hidden"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="border-t border-white/10 bg-[#040947] lg:hidden">
                    <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
                        <div className="mb-2 flex items-center justify-between rounded-lg border border-white/15 bg-white/5 p-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                                    {avatarInitial}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-white">{ownerName}</p>
                                    <p className="text-[11px] text-gray-300">{businessName}</p>
                                </div>
                            </div>
                            <button
                                className="relative rounded-md p-2 text-gray-200 transition hover:bg-white/10 hover:text-white"
                                aria-label="View notifications"
                            >
                                <Bell className="h-4 w-4" />
                                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-400" />
                            </button>
                        </div>

                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition",
                                    isActive(item)
                                        ? "border-white/30 bg-white/10 text-white"
                                        : "border-transparent text-gray-200 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}

                        <button
                            onClick={logout}
                            className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
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
