"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

interface TrendProps {
    value: string
    negative?: boolean
}

export function Trend({ value, negative }: TrendProps) {
    return (
        <div
            className={`flex items-center gap-1 text-xs font-bold ${negative ? "text-red-500" : "text-emerald-500"
                }`}
        >
            {negative ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            {value}
        </div>
    )
}
