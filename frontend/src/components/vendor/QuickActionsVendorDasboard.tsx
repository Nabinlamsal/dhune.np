"use client";

import Link from "next/link";
import { ArrowRight, Gavel, ShoppingBag, Store } from "lucide-react";

export function QuickActionsVendorDashboard() {
    return (
        <div className="flex flex-col h-[420px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 gap-y-">

                Quick Actions
            </h3>

            <div className="flex flex-col gap-y-5 flex-1">
                {/* Card 1 */}
                <Link
                    href="/vendor/marketplace"
                    className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
                >
                    <div className="flex items-center justify-between">
                        <Store className="text-orange-500 w-5 h-5" />
                        <ArrowRight className="text-gray-400 w-4 h-4 group-hover:text-black transition" />
                    </div>

                    <div className="mt-4 space-y-1">
                        <p className="text-sm font-medium">
                            Find requests and submit offers
                        </p>
                    </div>
                </Link>

                {/* Card 2 */}
                <Link
                    href="/vendor/offers"
                    className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
                >
                    <div className="flex items-center justify-between">
                        <Gavel className="text-blue-500 w-5 h-5" />
                        <ArrowRight className="text-gray-400 w-4 h-4 group-hover:text-black transition" />
                    </div>

                    <div className="mt-4 space-y-1">
                        <p className="text-sm font-medium">
                            Track pending and accepted bids
                        </p>
                    </div>
                </Link>

                {/* Card 3 */}
                <Link
                    href="/vendor/orders"
                    className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
                >
                    <div className="flex items-center justify-between">
                        <ShoppingBag className="text-green-500 w-5 h-5" />
                        <ArrowRight className="text-gray-400 w-4 h-4 group-hover:text-black transition" />
                    </div>

                    <div className="mt-4 space-y-1">
                        <p className="text-sm font-medium">
                            Manage Orders & deliveries
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}