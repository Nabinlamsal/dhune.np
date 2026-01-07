"use client"

import { Card } from "@/src/components/ui/card"
import { Metric } from "./Metric"
import { Trend } from "./Trend"

interface StatCardProps {
    title: string
    value: string | number
    trend: string
    description: string
    negative?: boolean
}

export function StatCard({
    title,
    value,
    trend,
    description,
    negative,
}: StatCardProps) {
    return (
        <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
                <Metric label={title} value={value} description={description} />
                <Trend value={trend} negative={negative} />
            </div>
        </Card>
    )
}
