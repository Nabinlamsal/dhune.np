"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, BadgeCheck, ClipboardList, PackageCheck, Shirt, Store } from "lucide-react";

const flowSteps = [
  {
    title: "Create Request",
    description: "Add laundry details, pickup location, timing, and notes.",
    Icon: ClipboardList,
  },
  {
    title: "Receive Offers",
    description: "Vendors respond with price, time, and service notes.",
    Icon: Store,
  },
  {
    title: "Choose Vendor",
    description: "Compare offers and accept the best fit.",
    Icon: BadgeCheck,
  },
  {
    title: "Pickup & Processing",
    description: "Vendor collects laundry and updates cleaning progress.",
    Icon: Shirt,
  },
  {
    title: "Delivery & Completion",
    description: "Customer receives delivery, completes payment, and rates service.",
    Icon: PackageCheck,
  },
];

export default function HowItWorksSection() {
  return (
    <motion.section
      id="how-it-works"
      className="px-4 py-16 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#040947] dark:text-slate-300">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            A simple connected laundry flow
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            Customers and vendors move through one clear request, offer, and order path.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-5 lg:items-stretch">
          {flowSteps.map((step, index) => {
            const Icon = step.Icon;
            const isLast = index === flowSteps.length - 1;

            return (
              <div key={step.title} className="relative">
                <motion.article
                  className="relative z-10 h-full rounded-[1.35rem] border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:border-[#040947]/25 hover:shadow-xl hover:shadow-[#040947]/8 dark:border-slate-400/15 dark:bg-[#111827]/70 dark:shadow-black/10 dark:hover:border-slate-300/25 dark:hover:shadow-black/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
                  whileHover={{ y: -6, scale: 1.015 }}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#040947] text-white shadow-lg shadow-[#040947]/15 dark:bg-sky-300 dark:text-[#0B1220] dark:shadow-none">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="mt-4 inline-flex rounded-full bg-[#ebbc01]/20 px-3 py-1 text-[11px] font-black text-[#765d00] dark:bg-slate-700/70 dark:text-slate-200">
                    STEP 0{index + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-extrabold text-slate-950 dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.description}</p>
                </motion.article>

                {!isLast ? (
                  <>
                    <div className="absolute left-1/2 top-full z-0 flex h-4 -translate-x-1/2 items-center justify-center lg:left-auto lg:right-[-22px] lg:top-1/2 lg:h-auto lg:translate-x-0 lg:-translate-y-1/2">
                      <ArrowDown className="h-5 w-5 text-[#040947]/35 dark:text-slate-400/55 lg:hidden" />
                      <ArrowRight className="hidden h-6 w-6 text-[#040947]/35 dark:text-slate-400/55 lg:block" />
                    </div>
                    <div className="mx-auto h-5 w-px bg-[#040947]/15 dark:bg-slate-400/18 lg:absolute lg:right-[-24px] lg:top-1/2 lg:mx-0 lg:h-px lg:w-12" />
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
