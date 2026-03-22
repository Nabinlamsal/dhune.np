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
    success: "bg-emerald-500",
    warning: "bg-orange-500",
    danger: "bg-red-500",
    neutral: "bg-sky-500",
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
            rightSlot={<p className="text-sm font-semibold text-slate-900">{primaryCount} / {total}</p>}
        >
            <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">{primaryLabel}</p>
                <p className="text-sm font-bold text-slate-900">{primaryRate}%</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
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

            <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">{insight}</p>
        </SectionCard>
    );
}
