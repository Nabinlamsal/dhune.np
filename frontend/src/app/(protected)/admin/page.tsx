"use client"

import { StatCard } from "@/src/components/dashboard/StatCard"
import { ConversionFunnel } from "@/src/components/dashboard/ConversionFunnel"
import { AuthRedirect } from "@/src/components/auth/AuthRedirect"

export default function DashboardPage() {
    return (
        <>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-500">
                    Real-time overview of your multi-vendor laundry marketplace
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Active Requests"
                    value={342}
                    trend="12%"
                    description="Waiting for vendor offers"
                />
                <StatCard
                    title="Pending Offers"
                    value={1284}
                    trend="8%"
                    description="From active vendors"
                />
                <StatCard
                    title="Active Orders"
                    value={156}
                    trend="5%"
                    description="In progress or scheduled"
                />
                <StatCard
                    title="Conversion Rate"
                    value="45%"
                    trend="3%"
                    description="Requests → Orders"
                    negative
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Line Chart Placeholder */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-lg">
                        Requests vs Offers vs Completions
                    </h3>
                    <p className="text-xs text-gray-400 mb-6">
                        Track the marketplace funnel over time
                    </p>

                    <div className="relative h-[300px] w-full border-l border-b border-gray-100">
                        <svg className="w-full h-full" viewBox="0 0 400 200">
                            <path
                                d="M0,180 Q100,160 200,140 T400,100"
                                fill="none"
                                stroke="#4338ca"
                                strokeWidth="2"
                            />
                            <path
                                d="M0,190 Q100,180 200,160 T400,130"
                                fill="none"
                                stroke="#fbbf24"
                                strokeWidth="2"
                            />
                            <path
                                d="M0,200 Q100,195 200,180 T400,150"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                </div>

                {/* Funnel */}
                <ConversionFunnel />

            </div>
            <AuthRedirect />
        </>
    )
}
