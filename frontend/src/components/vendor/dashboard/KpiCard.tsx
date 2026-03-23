"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TrendTone = "good" | "bad" | "neutral";

type KpiCardProps = {
    label: string;
    value: string;
    icon: ReactNode;
    trendText: string;
    trendDirection: "up" | "down";
    trendTone: TrendTone;
    helperText?: string;
};

const TREND_STYLES: Record<TrendTone, string> = {
    good: "text-emerald-600 bg-emerald-50",
    bad: "text-red-600 bg-red-50",
    neutral: "text-[#040947] bg-amber-100",
};

export function KpiCard({
    label,
    value,
    icon,
    trendText,
    trendTone,
    helperText,
}: KpiCardProps) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#040947]/30 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
                <div className="rounded-lg bg-[#040947]/8 p-2 text-[#040947]">{icon}</div>
            </div>

            <p className="text-3xl font-bold leading-none text-slate-900">{value}</p>

            <div className="mt-3 flex items-center justify-between">
                <span
                    className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold",
                        TREND_STYLES[trendTone]
                    )}
                >
                    {trendText}
                </span>
                {helperText && <span className="text-xs text-slate-500">{helperText}</span>}
            </div>
        </article>
    );
}
