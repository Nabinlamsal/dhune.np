"use client"

interface ProgressBarProps {
    value: number
    max: number
}

export function ProgressBar({ value, max }: ProgressBarProps) {
    const width = Math.min((value / max) * 100, 100)

    return (
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
                className="bg-orange-500 h-full rounded-full"
                style={{ width: `${width}%` }}
            />
        </div>
    )
}
