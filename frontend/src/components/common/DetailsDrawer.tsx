"use client"

import { PanelRightOpen, X } from "lucide-react"

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
            <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_72px_rgba(15,23,42,0.28)]">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#040947] via-[#0b2a78] to-amber-400" />

                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 shrink-0">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="rounded-xl bg-[#040947]/10 p-2 text-[#040947]">
                            <PanelRightOpen className="size-4" />
                        </span>
                        <div className="min-w-0">
                            <h3 className="truncate text-base font-semibold text-slate-900">{title}</h3>
                            <p className="text-xs text-slate-500">Review complete details and context</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-500 hover:text-slate-900">
                        <X className="size-4" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#040947]/[0.04] to-white p-5 text-xs">
                    {children}
                </div>

            </div>
        </div>
    )
}

