"use client"

import { X } from "lucide-react"

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b shrink-0">
                    <h3 className="font-semibold text-base">{title}</h3>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X />
                    </Button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-1 text-xs">
                    {children}
                </div>

            </div>
        </div>
    )
}