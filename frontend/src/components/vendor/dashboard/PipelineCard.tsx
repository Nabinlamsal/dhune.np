"use client";

import { cn } from "@/lib/utils";
import { SectionCard } from "./SectionCard";

type PipelineItem = {
    label: string;
    count: number;
    tone: "success" | "warning" | "danger" | "neutral";
};

type PipelineCardProps = {
    title: string;
    subtitle: string;
    total: number;
    primaryLabel: string;
    primaryCount: number;
    items: PipelineItem[];
    insight: string;
};

const BAR_STYLES: Record<PipelineItem["tone"], string> = {
    success: "bg-emerald-600",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    neutral: "bg-slate-700",
};

export function PipelineCard({
    title,
    subtitle,
    total,
    primaryLabel,
    primaryCount,
    items,
    insight,
}: PipelineCardProps) {
    const safeTotal = Math.max(total, 1);
    const primaryRate = Math.round((primaryCount / safeTotal) * 100);

    return (
        <SectionCard
            title={title}
            subtitle={subtitle}
            rightSlot={<p className="rounded-md border border-[#040947]/20 bg-[#040947]/8 px-2 py-1 text-xs font-semibold text-[#040947]">{primaryCount} / {total}</p>}
        >
            <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">{primaryLabel}</p>
                <p className="rounded-md bg-amber-100 px-2 py-1 text-sm font-semibold text-[#040947]">{primaryRate}%</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-slate-800 transition-all duration-300"
                    style={{ width: `${Math.min(primaryRate, 100)}%` }}
                />
            </div>

            <div className="mt-4 space-y-3">
                {items.map((item) => {
                    const rate = Math.round((item.count / safeTotal) * 100);
                    return (
                        <div key={item.label}>
                            <div className="mb-1 flex items-center justify-between text-xs">
                                <p className="font-medium text-slate-600">{item.label}</p>
                                <p className="font-semibold text-slate-900">{item.count}</p>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className={cn("h-full rounded-full transition-all duration-300", BAR_STYLES[item.tone])}
                                    style={{ width: `${Math.min(rate, 100)}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-slate-700">{insight}</p>
        </SectionCard>
    );
}
