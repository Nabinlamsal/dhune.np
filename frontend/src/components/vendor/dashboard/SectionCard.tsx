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
                "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5",
                className
            )}
        >
            {(title || subtitle || rightSlot) && (
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        {title && <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>}
                        {subtitle && <p className="mt-1 text-xs leading-relaxed text-slate-500">{subtitle}</p>}
                    </div>
                    {rightSlot}
                </div>
            )}
            {children}
        </section>
    );
}
