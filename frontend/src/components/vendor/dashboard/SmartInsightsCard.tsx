"use client";

import { Lightbulb, Sparkles } from "lucide-react";
import { SectionCard } from "./SectionCard";

type SmartInsightsCardProps = {
    insights: string[];
};

export function SmartInsightsCard({ insights }: SmartInsightsCardProps) {
    return (
        <SectionCard
            title="Smart Insights"
            subtitle="Automatically generated recommendations"
            rightSlot={<Sparkles className="size-4 text-sky-500" />}
        >
            <div className="space-y-2">
                {insights.map((item) => (
                    <div key={item} className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                        <Lightbulb className="mt-0.5 size-4 text-amber-500" />
                        <p className="text-sm text-slate-700">{item}</p>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}
