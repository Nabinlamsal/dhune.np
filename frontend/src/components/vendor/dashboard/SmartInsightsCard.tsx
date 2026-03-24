"use client";

import { Lightbulb, NotebookPen } from "lucide-react";
import { SectionCard } from "./SectionCard";

type SmartInsightsCardProps = {
    insights: string[];
};

export function SmartInsightsCard({ insights }: SmartInsightsCardProps) {
    return (
        <SectionCard
            title="Operational Notes"
            subtitle="Highlights from current performance"
            rightSlot={<NotebookPen className="size-4 text-[#040947]" />}
        >
            <div className="space-y-2.5">
                {insights.map((item) => (
                    <div key={item} className="flex items-start gap-2 rounded-lg border border-[#040947]/10 bg-[#040947]/[0.03] px-3 py-2.5">
                        <Lightbulb className="mt-0.5 size-4 text-amber-600" />
                        <p className="text-sm leading-relaxed text-slate-700">{item}</p>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}
