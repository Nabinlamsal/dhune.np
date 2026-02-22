"use client"

import { StatCard } from "@/src/components/dashboard/StatCard"
import { ArrowRight, Gavel, ShoppingBag, Store } from "lucide-react"
import Link from "next/link"

export default function VendorPage() {
    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                    Vendor Dashboard
                </h2>
                <p className="text-gray-500">
                    Manage your offers, track orders, and grow your business
                </p>
            </div>

            {/* Personal Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Pending Offers"
                    value={12}
                    trend=""
                    description="Waiting for customer decision"
                />
                <StatCard
                    title="Accepted Offers"
                    value={8}
                    trend=""
                    description="Converted to active jobs"
                />
                <StatCard
                    title="Active Orders"
                    value={5}
                    trend=""
                    description="Currently in progress"
                />
                <StatCard
                    title="Completed Orders"
                    value={24}
                    trend=""
                    description="Successfully delivered"
                />
            </div>

            {/* Quick Actions */}
            <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Quick Actions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        href="/vendor/marketplace"
                        className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <Store className="text-orange-500" />
                            <ArrowRight className="text-gray-400 group-hover:text-black transition" />
                        </div>
                        <h4 className="mt-4 font-semibold">
                            Browse Marketplace
                        </h4>
                        <p className="text-sm text-gray-500">
                            Find new customer requests and submit offers
                        </p>
                    </Link>

                    <Link
                        href="/vendor/offers"
                        className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <Gavel className="text-blue-500" />
                            <ArrowRight className="text-gray-400 group-hover:text-black transition" />
                        </div>
                        <h4 className="mt-4 font-semibold">
                            Manage My Offers
                        </h4>
                        <p className="text-sm text-gray-500">
                            Track pending and accepted bids
                        </p>
                    </Link>

                    <Link
                        href="/vendor/orders"
                        className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <ShoppingBag className="text-green-500" />
                            <ArrowRight className="text-gray-400 group-hover:text-black transition" />
                        </div>
                        <h4 className="mt-4 font-semibold">
                            View My Orders
                        </h4>
                        <p className="text-sm text-gray-500">
                            Update order status and manage deliveries
                        </p>
                    </Link>
                </div>
            </div>

            {/* Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Offers */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">
                        Recent Offers
                    </h3>

                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Offer #1234</span>
                            <span className="text-yellow-600">PENDING</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Offer #1233</span>
                            <span className="text-green-600">ACCEPTED</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Offer #1232</span>
                            <span className="text-gray-500">REJECTED</span>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">
                        Recent Orders
                    </h3>

                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Order #8912</span>
                            <span className="text-blue-600">IN_PROGRESS</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Order #8911</span>
                            <span className="text-green-600">COMPLETED</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Order #8910</span>
                            <span className="text-yellow-600">ACCEPTED</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}