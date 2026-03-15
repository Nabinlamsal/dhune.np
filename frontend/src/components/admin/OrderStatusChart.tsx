"use client";

import { Card } from "@/src/components/ui/card";
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

interface OrderStatusChartProps {
    accepted: number;
    pickedUp: number;
    inProgress: number;
    delivering: number;
    completed: number;
    cancelled: number;
}

export function OrderStatusChart({
    accepted,
    pickedUp,
    inProgress,
    delivering,
    completed,
    cancelled,
}: OrderStatusChartProps) {
    const data = [
        { name: "Accepted", value: accepted, color: "#3b82f6" },
        { name: "Picked Up", value: pickedUp, color: "#06b6d4" },
        { name: "In Progress", value: inProgress, color: "#f59e0b" },
        { name: "Delivering", value: delivering, color: "#8b5cf6" },
        { name: "Completed", value: completed, color: "#22c55e" },
        { name: "Cancelled", value: cancelled, color: "#ef4444" },
    ].filter((item) => item.value > 0);

    const hasData = data.length > 0;

    return (
        <Card className="p-5">
            <h3 className="font-bold text-lg">Order Status Distribution</h3>
            <p className="text-xs text-gray-400 mb-6">
                Current breakdown of order lifecycle states
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="h-[210px]">
                    {hasData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    innerRadius={44}
                                    outerRadius={70}
                                    dataKey="value"
                                    nameKey="name"
                                    paddingAngle={2}
                                >
                                    {data.map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full grid place-items-center text-sm text-gray-400">
                            No order status data available.
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    {[
                        { label: "Accepted", value: accepted, color: "#3b82f6" },
                        { label: "Picked Up", value: pickedUp, color: "#06b6d4" },
                        { label: "In Progress", value: inProgress, color: "#f59e0b" },
                        { label: "Delivering", value: delivering, color: "#8b5cf6" },
                        { label: "Completed", value: completed, color: "#22c55e" },
                        { label: "Cancelled", value: cancelled, color: "#ef4444" },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between text-sm"
                        >
                            <div className="flex items-center gap-2 text-gray-600">
                                <span
                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                {item.label}
                            </div>
                            <span className="font-semibold text-gray-900">
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
