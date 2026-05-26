"use client";

import { useEffect, useState } from "react";

interface Group {
    name: string;
    desc: string;
}

const group: Group[] = [
    {
        name: "Users & Businesses",
        desc: "Normal users and business users share the same request, offer, order tracking, payment, profile, and support features. Business users only complete a more detailed registration process.",
    },
    {
        name: "Normal Users",
        desc: "Whether it is everyday wear, student uniforms, or household linens, Dhune.np makes laundry simple: create requests, compare providers, and track orders.",
    },
    {
        name: "Laundry Vendors",
        desc: "Laundry operators can receive requests, send offers, manage accepted orders, and grow their customer reach through a structured digital workflow.",
    },
];

export default function AudienceSection() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % group.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-12 flex flex-col items-start gap-4">
            <div className="w-full rounded-2xl bg-gradient-to-r from-[#fdf6e3] to-[#fff9f0] p-6 shadow-lg transition-all duration-700 dark:from-[#252318] dark:to-[#1d1d1a] sm:max-w-xl">
                <p className="mb-2 text-lg font-semibold text-[#9c7d01] sm:text-2xl">
                    Dhune.np is for{" "}
                    <span className="text-2xl font-bold text-[#040947] dark:text-[#ebbc01] sm:text-3xl">
                        {group[index].name}
                    </span>
                </p>
                <p className="text-sm italic leading-relaxed text-neutral-700 dark:text-[#F7F5EE]/70 sm:text-base">
                    {group[index].desc}
                </p>
            </div>

            <div className="mt-2 flex gap-2">
                {group.map((_, i) => (
                    <span
                        key={i}
                        className={`h-4 w-4 self-center rounded-full transition-all duration-500 ${i === index ? "bg-[#040947] dark:bg-[#ebbc01]" : "bg-gray-300 dark:bg-white/20"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
