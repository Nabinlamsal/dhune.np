"use client"

import { Card } from "@/src/components/ui/card"
import { ProgressBar } from "./ProgressBar"

export interface FunnelItem {
    label: string
    value: number
    max: number
}

const defaultData: FunnelItem[] = [
    { label: "Requests Posted", value: 2400, max: 2400 },
    { label: "Offers Received", value: 1840, max: 2400 },
    { label: "Orders Placed", value: 1200, max: 2400 },
    { label: "Completed Orders", value: 1080, max: 2400 },
]

interface ConversionFunnelProps {
    data?: FunnelItem[]
    title?: string
    description?: string
}

export function ConversionFunnel({
    data = defaultData,
    title = "Conversion Funnel",
    description = "Users through the marketplace pipeline",
}: ConversionFunnelProps) {
    return (
        <Card className="p-5 h-full">
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-xs text-gray-400 mb-4">{description}</p>

            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.label}>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-700">
                                {item.label}
                            </span>
                            <span className="text-gray-400">{item.value}</span>
                        </div>
                        <ProgressBar value={item.value} max={item.max} />
                    </div>
                ))}
            </div>
        </Card>
    )
}
