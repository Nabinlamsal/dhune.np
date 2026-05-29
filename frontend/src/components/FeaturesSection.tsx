"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Bot,
  CreditCard,
  LayoutDashboard,
  GitCompare,
  MapPin,
  MessageSquareWarning,
  Star,
} from "lucide-react";
import NepalReadySection from "./NepalReadySection";

const features = [
  { title: "Pickup location", description: "Map-based request location for cleaner pickup coordination.", Icon: MapPin },
  { title: "Payment support", description: "Khalti, eSewa, and cash flows are represented in the platform.", Icon: CreditCard },
  { title: "Support chatbot", description: "Help center support stays close to users when questions appear.", Icon: Bot },
  { title: "Report issues", description: "Order reports and dispute support keep problem cases trackable.", Icon: MessageSquareWarning },
  { title: "Ratings", description: "Customers can rate vendors after completed laundry orders.", Icon: Star },
  { title: "Offer comparison", description: "Users compare vendor price, timing, and notes before accepting.", Icon: GitCompare },
  { title: "Live Notifications", description: "Important account, request, offer, and order updates stay visible.", Icon: Bell },
  { title: "Multi-role dashboards", description: "Admin and vendor portals keep operations clear and organized.", Icon: LayoutDashboard },
];

export default function FeaturesSection() {
  return (
    <motion.section
      id="features"
      className="px-4 py-16 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#040947] dark:text-slate-300">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Everything needed for a laundry marketplace
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            Compact customer, vendor, payment, support, and operations features in one product.
          </p>
        </div>

        <div className="mx-auto mt-9 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.Icon;

            return (
              <motion.article
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#040947]/25 hover:shadow-lg dark:border-slate-400/15 dark:bg-[#111827]/70 dark:shadow-black/10 dark:hover:border-slate-300/25"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.36, delay: index * 0.035, ease: "easeOut" }}
                whileHover={{ y: -5, scale: 1.012 }}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#040947]/10 text-[#040947] dark:bg-slate-700/70 dark:text-sky-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-950 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
        <NepalReadySection />
      </div>
    </motion.section>
  );
}
