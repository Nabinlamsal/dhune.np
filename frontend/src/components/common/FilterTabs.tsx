"use client"

import { cn } from "@/lib/utils"

interface Tab {
    label: string
    value: string
}

interface FilterTabsProps {
    tabs: Tab[]
    active: string
    onChange: (value: string) => void
}

export function FilterTabs({
    tabs,
    active,
    onChange,
}: FilterTabsProps) {
    return (
        <div className="flex gap-2 mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium",
                        active === tab.value
                            ? "bg-orange-500 text-black"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}
