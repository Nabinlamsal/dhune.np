"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionCardProps = {
    title?: string;
    subtitle?: string;
    rightSlot?: ReactNode;
    className?: string;
    children: ReactNode;
};

export function SectionCard({ title, subtitle, rightSlot, className, children }: SectionCardProps) {
    return (
        <section
            className={cn(
                "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md",
                className
            )}
        >
            {(title || subtitle || rightSlot) && (
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        {title && <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</h3>}
                        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
                    </div>
                    {rightSlot}
                </div>
            )}
            {children}
        </section>
    );
}
