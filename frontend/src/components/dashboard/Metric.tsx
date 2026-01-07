"use client"

interface MetricProps {
    label: string
    value: string | number
    description?: string
}

export function Metric({ label, value, description }: MetricProps) {
    return (
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <h3 className="text-3xl font-bold mt-1">{value}</h3>
            {description && (
                <p className="text-xs text-gray-400 mt-1">{description}</p>
            )}
        </div>
    )
}
