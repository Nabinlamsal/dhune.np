"use client"

import { X } from "lucide-react"
import { Card } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"

interface DetailsDrawerProps {
    open: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

export function DetailsDrawer({
    open,
    onClose,
    title,
    children,
}: DetailsDrawerProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
            <div className="w-[420px] h-full bg-white shadow-xl animate-slide-in">
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X />
                    </Button>
                </div>

                <div className="p-6 space-y-4">{children}</div>
            </div>
        </div>
    )
}
