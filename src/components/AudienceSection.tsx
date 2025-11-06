"use client";

import { useState, useEffect } from "react";

interface Group {
    name: string;
    desc: string;
}

const group: Group[] = [
    {
        name: "Businesses & Organization",
        desc: "Designed for hospitals, hotels, and growing businesses that handle large volumes of laundry daily. Dhune.np connects you with professional vendors offering bulk cleaning, and corporate invoicing.",
    },
    {
        name: "Normal Users",
        desc: "Whether it’s your everyday wear, student uniforms, or household linens, Dhune.np makes laundry simple — schedule pickups, compare providers, and enjoy next-day delivery.",
    },
    {
        name: "Laundry Vendors",
        desc: "A platform for laundry operators to expand their reach, manage customer orders, and grow their business digitally. Join Dhune.np and focus on cleaning while we handle the rest.",
    },
]

export default function AudienceSection() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % group.length)
        }, 4000);
        return () => clearInterval(interval)
    }, []);

    return (
        <div className="mt-12 flex flex-col items-start gap-4">
            <div className="bg-gradient-to-r from-[#fdf6e3] to-[#fff9f0] p-6 rounded-2xl shadow-lg w-full sm:max-w-xl transition-all duration-700">
                <p className="text-lg sm:text-2xl font-semibold text-[#9c7d01] mb-2">
                    Dhune.np is for{" "}
                    <span className="text-[#040947] text-2xl sm:text-3xl font-bold">
                        {group[index].name}
                    </span>
                </p>
                <p className="text-neutral-700 italic text-sm sm:text-base leading-relaxed">
                    {group[index].desc}
                </p>
            </div>

            <div className="flex gap-2 mt-2">
                {group.map((_, i) => (
                    <span
                        key={i}
                        className={`w-4 h-4 rounded-full transition-all duration-500 self-center ${i === index ? "bg-[#040947]" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

