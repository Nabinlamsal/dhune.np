"use client";

import { motion } from "framer-motion";
import { BellRing, CheckCircle2, CreditCard, Headphones, Languages, MapPin, Settings } from "lucide-react";

const screenshots: string[] = [];

const appHighlights = [
  { title: "Geolocation", description: "Choose pickup points clearly.", Icon: MapPin },
  { title: "Khalti & eSewa", description: "Payment status stays visible.", Icon: CreditCard },
  { title: "Accessibility", description: "Nepali and English support.", Icon: Languages },
  { title: "Preferences", description: "Profile settings stay personal.", Icon: Settings },
  { title: "Help Center", description: "Support is close when needed.", Icon: Headphones },
  { title: "Order Tracking", description: "Follow every order stage.", Icon: CheckCircle2 },
  { title: "Notifications", description: "Important updates arrive fast.", Icon: BellRing },
  { title: "Fast Requests", description: "Create laundry requests quickly.", Icon: MapPin },
];

function PhonePreview({ active = false }: { active?: boolean }) {
  return (
    <div
      className={`relative mx-auto aspect-[9/16] w-full max-w-[230px] rounded-[1.9rem] border bg-slate-950 p-2.5 shadow-2xl transition ${
        active
          ? "border-[#040947]/25 shadow-[#040947]/18 dark:border-cyan-300/30 dark:shadow-cyan-300/12"
          : "border-slate-300 opacity-80 dark:border-white/15"
      }`}
    >
      <div className="h-full overflow-hidden rounded-[1.35rem] bg-gradient-to-b from-slate-100 to-white dark:from-[#07111f] dark:to-[#0d1b2e]">
        {screenshots.length > 0 ? null : (
          <div className="flex h-full flex-col justify-between p-4">
            <div>
              <div className="h-2.5 w-20 rounded-full bg-slate-300 dark:bg-white/20" />
              <div className="mt-5 h-8 w-32 rounded-xl bg-[#040947] dark:bg-cyan-300" />
              <div className="mt-4 grid gap-2.5">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/10">
                    <div className="h-2.5 w-3/4 rounded-full bg-slate-200 dark:bg-white/20" />
                    <div className="mt-2.5 h-2.5 w-1/2 rounded-full bg-slate-100 dark:bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-8 rounded-xl bg-slate-200 dark:bg-white/15" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DownloadAppSection() {
  return (
    <motion.section
      id="user-app"
      className="px-4 py-16 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.07] sm:p-8 lg:p-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#040947] dark:text-cyan-200">
            User App
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Mobile app preview, ready for real screenshots
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            A clean carousel-ready space for request creation, order tracking, notifications, and profile screens.
          </p>
        </div>

        <div className="mt-9 grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="relative mx-auto flex w-full max-w-2xl items-center justify-center gap-4">
            <motion.div className="hidden sm:block sm:w-[34%]" whileHover={{ y: -6, rotate: -1 }}>
              <PhonePreview />
            </motion.div>
            <motion.div className="w-full max-w-[260px] sm:w-[40%]" whileHover={{ y: -8, scale: 1.015 }}>
              <PhonePreview active />
            </motion.div>
            <motion.div className="hidden sm:block sm:w-[34%]" whileHover={{ y: -6, rotate: 1 }}>
              <PhonePreview />
            </motion.div>
          </div>

          <div className="text-center lg:text-left">
            <p className="mx-auto mb-4 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 lg:mx-0">
              Key mobile app features are designed for quick request creation, clear payment visibility, and easy order follow-up.
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {appHighlights.map((feature, index) => {
                const Icon = feature.Icon;

                return (
                  <motion.div
                    key={feature.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:-translate-y-0.5 hover:border-[#040947]/25 dark:border-white/10 dark:bg-white/[0.08] dark:hover:border-cyan-300/30"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.35, delay: index * 0.035, ease: "easeOut" }}
                    whileHover={{ y: -4, scale: 1.015 }}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-[#040947] dark:text-cyan-200" />
                      <span className="text-sm font-extrabold text-slate-800 dark:text-white">{feature.title}</span>
                    </div>
                    <p className="mt-1.5 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-7 text-center lg:text-left">
              <a
                href="#user-app"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#040947] px-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#0b146b] dark:bg-cyan-300 dark:text-[#07111f] dark:hover:bg-white"
              >
                Download Android App
              </a>
              <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                Android app download will be available soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
