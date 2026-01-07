"use client"

import { Card } from "@/src/components/ui/card"
import { ProgressBar } from "./ProgressBar"

interface FunnelItem {
    label: string
    value: number
    max: number
}

const data: FunnelItem[] = [
    { label: "Requests Posted", value: 2400, max: 2400 },
    { label: "Offers Received", value: 1840, max: 2400 },
    { label: "Orders Placed", value: 1200, max: 2400 },
    { label: "Completed Orders", value: 1080, max: 2400 },
]

export function ConversionFunnel() {
    return (
        <Card className="p-6 h-full">
            <h3 className="font-bold text-lg">Conversion Funnel</h3>
            <p className="text-xs text-gray-400 mb-6">
                Users through the marketplace pipeline
            </p>

            <div className="space-y-6">
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
