"use client";

import { motion } from "framer-motion";
import { Languages } from "lucide-react";

const screenshots: string[] = [];
const nepaliLanguageCopy =
  "\u0927\u0941\u0928\u0947.\u090f\u0928\u092a\u0940 \u0928\u0947\u092a\u093e\u0932\u0940 \u092a\u094d\u0930\u092f\u094b\u0917\u0915\u0930\u094d\u0924\u093e\u0932\u093e\u0908 \u0938\u0939\u091c \u0939\u0941\u0928\u0947 \u0917\u0930\u0940 \u092c\u0928\u093e\u0907\u090f\u0915\u094b \u091b, \u091c\u0938\u0932\u0947 \u090f\u092a\u092e\u093e \u0906\u092b\u094d\u0928\u0948 \u092d\u093e\u0937\u093e\u092e\u093e \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u092c\u0941\u091d\u094d\u0928 \u0930 \u0938\u0947\u0935\u093e \u092a\u094d\u0930\u092f\u094b\u0917 \u0917\u0930\u094d\u0928 \u092e\u0926\u094d\u0926\u0924 \u0917\u0930\u094d\u091b\u0964";

function LanguagePhone({ label }: { label: string }) {
  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[210px] rounded-[1.8rem] border border-slate-300 bg-slate-950 p-2.5 shadow-2xl shadow-[#040947]/12 dark:border-white/15 dark:shadow-cyan-300/10">
      <div className="h-full overflow-hidden rounded-[1.25rem] bg-gradient-to-b from-slate-100 to-white dark:from-[#07111f] dark:to-[#0d1b2e]">
        {screenshots.length > 0 ? null : (
          <div className="flex h-full flex-col justify-between p-4">
            <div>
              <div className="h-2.5 w-20 rounded-full bg-slate-300 dark:bg-white/20" />
              <div className="mt-5 h-8 w-28 rounded-xl bg-[#040947] dark:bg-cyan-300" />
              <div className="mt-4 grid gap-2.5">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/10">
                    <div className="h-2.5 w-3/4 rounded-full bg-slate-200 dark:bg-white/20" />
                    <div className="mt-2.5 h-2.5 w-1/2 rounded-full bg-slate-100 dark:bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-xs font-black text-slate-500 dark:text-slate-300">{label}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NepalReadySection() {
  return (
    <motion.div
      className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.07] sm:p-8 lg:p-10"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="grid items-center gap-9 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <motion.div whileHover={{ y: -6, rotate: -1 }}>
            <LanguagePhone label="Nepali language screenshot" />
          </motion.div>
          <motion.div whileHover={{ y: -6, rotate: 1 }}>
            <LanguagePhone label="English language screenshot" />
          </motion.div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-center dark:border-white/10 dark:bg-white/[0.08] lg:text-left">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#040947] text-white dark:bg-cyan-300 dark:text-[#07111f] lg:mx-0">
            <Languages className="h-5 w-5" />
          </div>
          <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.2em] text-[#040947] dark:text-cyan-200">
            Nepali Language
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Made for Nepal
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Nepali and English support makes Dhune.np easier for local users who prefer browsing, requesting service, and following app updates in a familiar language.
          </p>
          <p className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-7 text-slate-700 dark:border-white/10 dark:bg-white/[0.08] dark:text-slate-200" lang="ne">
            {nepaliLanguageCopy}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Nepali and English support",
              "Built for local language comfort",
            ].map((label) => (
              <motion.div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.08] dark:text-slate-200"
                whileHover={{ y: -3, scale: 1.01 }}
              >
                <Languages className="h-5 w-5 shrink-0 text-[#040947] dark:text-cyan-200" />
                <span>{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
