"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Languages } from "lucide-react";
import Image from "next/image";

const highlights = [
  "Nepali & English interface",
  "Easier for local customers",
  "Built for Nepal-based laundry workflow",
  "Supports local payments and pickup/delivery flow",
];

function LanguagePhone({ index, label, className = "" }: { index: 1 | 2; label: string; className?: string }) {
  return (
    <div className={`relative mx-auto aspect-[9/16] w-full max-w-[220px] rounded-[1.9rem] border border-slate-300 bg-slate-950 p-2 shadow-2xl shadow-[#040947]/14 dark:border-slate-400/15 dark:shadow-black/25 ${className}`}>
      <div className="absolute left-1/2 top-3 z-20 h-1.5 w-14 -translate-x-1/2 rounded-full bg-slate-900/75 dark:bg-black/70" />
      <div className="relative h-full overflow-hidden rounded-[1.45rem] bg-slate-100 dark:bg-[#111827]">
        <Image
          src={`/nepali-light-${index}.png`}
          alt={`${label} light screenshot`}
          fill
          sizes="(max-width: 640px) 44vw, 220px"
          className="object-contain dark:hidden"
        />
        <Image
          src={`/nepali-dark-${index}.png`}
          alt={`${label} dark screenshot`}
          fill
          sizes="(max-width: 640px) 44vw, 220px"
          className="hidden object-contain dark:block"
        />
      </div>
    </div>
  );
}

export default function NepalReadySection() {
  return (
    <motion.section
      id="nepal-ready"
      className="mt-10 scroll-mt-24 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-400/15 dark:bg-[#111827]/70 dark:shadow-black/10 sm:p-8 lg:p-10"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="grid items-center gap-9 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative mx-auto grid w-full max-w-xl grid-cols-2 items-center gap-3 sm:gap-5">
          <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ebbc01]/16 blur-3xl dark:bg-slate-500/10" />
          <motion.div className="relative z-10" whileHover={{ y: -6, rotate: -1 }}>
            <LanguagePhone index={1} label="Nepali interface" />
          </motion.div>
          <motion.div className="relative z-10" whileHover={{ y: -6, rotate: 1 }}>
            <LanguagePhone index={2} label="English interface" />
          </motion.div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-400/15 dark:bg-[#1F2937]/60 lg:text-left">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#040947] text-white dark:bg-sky-300 dark:text-[#0B1220] lg:mx-0">
            <Languages className="h-5 w-5" />
          </div>
          <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.2em] text-[#040947] dark:text-slate-300">
            Nepal Ready
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Made for Nepal
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Nepali and English support makes the app easier for local users, vendors, and business customers. Dhune.np is designed around local laundry pickup, vendor offers, payments, and order tracking.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {highlights.map((label, index) => (
              <motion.div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 dark:border-slate-400/15 dark:bg-[#111827]/70 dark:text-slate-200"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.32, delay: index * 0.04, ease: "easeOut" }}
                whileHover={{ y: -3, scale: 1.01 }}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#040947] dark:text-sky-300" />
                <span>{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
