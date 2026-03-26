"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Label,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    PieChart,
    Pie,
} from "recharts";
import { SectionCard } from "./SectionCard";

type FlowDatum = { name: string; value: number };

type AnalyticsSectionProps = {
    offerFlowData: FlowDatum[];
    workloadData: FlowDatum[];
};

type OrderFlowCardProps = {
    orderFlowData: FlowDatum[];
    className?: string;
};

type OfferConversionCardProps = {
    offerFlowData: { name: string; value: number }[];
    className?: string;
};

type WorkloadDistributionCardProps = {
    workloadData: FlowDatum[];
    className?: string;
};

const COLORS = {
    primary: "#040947",
    success: "#16a34a",
    warning: "#f59e0b",
    danger: "#ef4444",
    neutral: "#1d4ed8",
};

const DONUT_COLORS = [COLORS.primary, COLORS.warning, COLORS.success, COLORS.neutral];

export function OfferConversionCard({ offerFlowData, className }: OfferConversionCardProps) {
    const maxOffer = Math.max(...offerFlowData.map((item) => item.value), 0);

    return (
        <SectionCard
            title="Offer Conversion"
            subtitle="Distribution of submitted offers by outcome"
            className={className}
        >
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={offerFlowData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={28}>
                            {offerFlowData.map((entry) => (
                                <Cell key={entry.name} fill={entry.value === maxOffer ? COLORS.success : COLORS.neutral} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </SectionCard>
    );
}

export function WorkloadDistributionCard({ workloadData, className }: WorkloadDistributionCardProps) {
    const totalOffers = workloadData.reduce((sum, item) => sum + item.value, 0);

    return (
        <SectionCard title="Workload Distribution" subtitle="Current mix of offer and order workload" className={className}>
            <div className="relative h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={workloadData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={40}
                            outerRadius={90}
                            paddingAngle={3}
                        >
                            {workloadData.map((entry, index) => (
                                <Cell key={entry.name} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                            ))}
                            <Label
                                position="center"
                                content={({ viewBox }) => {
                                    const cx = viewBox && "cx" in viewBox ? viewBox.cx : 0;
                                    const cy = viewBox && "cy" in viewBox ? viewBox.cy : 0;
                                    return (
                                        <text x={cx} y={cy} textAnchor="middle">
                                            <tspan x={cx} dy="-0.2em" className="fill-slate-500 text-[12px]">Total Items</tspan>
                                            <tspan x={cx} dy="1.6em" className="fill-slate-900 text-[22px] font-semibold">
                                                {totalOffers}
                                            </tspan>
                                        </text>
                                    );
                                }}
                            />
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                {workloadData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                        <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }} />
                            <span className="text-slate-600">{item.name}</span>
                        </div>
                        <span className="font-semibold text-slate-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}

export function OrderFlowCard({ orderFlowData, className }: OrderFlowCardProps) {
    let largestDrop = 0;
    let dropLabel = "";
    for (let i = 1; i < orderFlowData.length; i++) {
        const drop = orderFlowData[i - 1].value - orderFlowData[i].value;
        if (drop > largestDrop) {
            largestDrop = drop;
            dropLabel = `${orderFlowData[i - 1].name} -> ${orderFlowData[i].name}`;
        }
    }

    return (
        <SectionCard title="Order Flow" subtitle="Progression across active order stages" className={className}>
            <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orderFlowData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="value" barSize={30} radius={[8, 8, 0, 0]} fill={COLORS.neutral} />
                        <Line type="stepAfter" dataKey="value" stroke={COLORS.warning} strokeWidth={2} dot={{ r: 2 }} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
                {largestDrop > 0 ? `Potential bottleneck: ${dropLabel} (drop of ${largestDrop})` : "No major bottlenecks detected in flow."}
            </p>
        </SectionCard>
    );
}

export function AnalyticsSection({ offerFlowData, workloadData }: AnalyticsSectionProps) {
    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
            <OfferConversionCard offerFlowData={offerFlowData} className="xl:col-span-2" />
            <WorkloadDistributionCard workloadData={workloadData} className="xl:col-span-3" />
        </div>
    );
}
