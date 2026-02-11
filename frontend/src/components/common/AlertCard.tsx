"use client"

import { Card } from "@/src/components/ui/card"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Variant = "danger" | "warning" | "info"

const styles: Record<Variant, string> = {
    danger: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
}

interface AlertCardProps {
    title: string
    description: string
    variant?: Variant
}

export function AlertCard({
    title,
    description,
    variant = "info",
}: AlertCardProps) {
    return (
        <Card className={cn("p-4 flex gap-3", styles[variant])}>
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs mt-1">{description}</p>
            </div>
        </Card>
    )
}
