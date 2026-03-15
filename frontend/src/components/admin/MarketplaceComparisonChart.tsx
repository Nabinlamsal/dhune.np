"use client";

import { Card } from "@/src/components/ui/card";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface MarketplaceComparisonChartProps {
    totalRequests: number;
    totalOffers: number;
    completedOrders: number;
}

export function MarketplaceComparisonChart({
    totalRequests,
    totalOffers,
    completedOrders,
}: MarketplaceComparisonChartProps) {
    const data = [
        { name: "Requests", value: totalRequests, fill: "#3b82f6" },
        { name: "Offers", value: totalOffers, fill: "#f59e0b" },
        { name: "Completed", value: completedOrders, fill: "#22c55e" },
    ];

    return (
        <Card className="p-4">
            <h3 className="font-semibold text-base">Volume Snapshot</h3>
            <p className="text-xs text-gray-400 mb-3">
                Requests vs offers vs completed orders
            </p>

            <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
                        barCategoryGap="10%"
                    >
                        <CartesianGrid stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9ca3af", fontSize: 12 }}
                            allowDecimals={false}
                        />
                        <Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                            {data.map((entry) => (
                                <Cell key={entry.name} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
