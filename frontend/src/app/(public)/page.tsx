"use client";

import DownloadAppSection from "@/src/components/DownloadAppSection";
import FaqSection from "@/src/components/FaqSection";
import FeaturesSection from "@/src/components/FeaturesSection";
import HelpChatbot from "@/src/components/HelpChatbot";
import HowItWorksSection from "@/src/components/HowItWorksSection";
import LandingFooter from "@/src/components/LandingFooter";
import { motion } from "framer-motion";
import { Building2, Store, UsersRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const audienceCards = [
  {
    title: "Customers",
    description: "Create laundry pickup requests, compare vendor offers, choose the best fit, and track every order in one place.",
    Icon: UsersRound,
  },
  {
    title: "Laundry Vendors",
    description: "Receive customer requests, send competitive offers, manage accepted work, and grow service reach across local areas.",
    Icon: Store,
  },
  {
    title: "Business Users / Organizations",
    description: "Coordinate uniforms, linens, and recurring laundry needs with a more organized request-offer-order workflow.",
    Icon: Building2,
  },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8fb] font-nunito text-slate-950 dark:bg-[#0B1220] dark:text-white">
      <section
        id="home"
        className="relative isolate flex min-h-[calc(100vh-1rem)] items-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#ffffff_0%,#eef5ff_48%,#f7f8fb_100%)] dark:bg-[linear-gradient(180deg,#0B1220_0%,#111827_48%,#0B1220_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(4,9,71,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(4,9,71,0.055)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70 dark:bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] dark:opacity-30" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left"
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#040947]/10 bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#040947] shadow-sm dark:border-slate-400/15 dark:bg-[#111827]/70 dark:text-slate-200 lg:mx-0">
              Smart laundry marketplace
            </div>
            <h1 className="mt-6 text-balance text-3xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
              Dhune.np connects customers with trusted laundry vendors.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-slate-600 sm:text-lg dark:text-slate-300 lg:mx-0">
              Create laundry pickup requests, compare offers, choose a vendor, and track the order from pickup to delivery.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <button
                onClick={() => {
                  document.getElementById("user-app")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#040947] px-7 text-sm font-extrabold text-white shadow-lg shadow-[#040947]/15 transition hover:-translate-y-0.5 hover:bg-[#0b146b] sm:w-auto dark:bg-sky-300 dark:text-[#0B1220] dark:shadow-none dark:hover:bg-sky-200"
                type="button"
              >
                Explore App
              </button>
              <button
                onClick={() => router.push("/auth/signup/vendor")}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-7 text-sm font-extrabold text-[#040947] shadow-sm transition hover:-translate-y-0.5 hover:border-[#040947]/25 sm:w-auto dark:border-slate-400/15 dark:bg-[#111827]/70 dark:text-slate-100 dark:hover:bg-[#1F2937]/80"
                type="button"
              >
                Become a Vendor
              </button>
            </div>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-xl pt-4 lg:max-w-none lg:pt-0"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
          >
            <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ebbc01]/20 blur-3xl dark:bg-slate-500/10" />
            <div className="absolute inset-x-8 bottom-2 h-20 rounded-full bg-[#040947]/10 blur-2xl dark:bg-black/20" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-3 shadow-2xl shadow-[#040947]/12 backdrop-blur dark:border-slate-400/15 dark:bg-[#111827]/55 dark:shadow-2xl dark:shadow-black/25 sm:p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-[#040947]/5 dark:from-slate-700/15 dark:via-transparent dark:to-[#0B1220]/35" />
              <Image
                src="/hero-light.png"
                alt="Dhune.np laundry marketplace app illustration"
                width={900}
                height={720}
                priority
                className="relative z-10 h-auto w-full object-contain drop-shadow-2xl dark:hidden"
              />
              <Image
                src="/hero-dark.png"
                alt="Dhune.np laundry marketplace app illustration in dark mode"
                width={900}
                height={720}
                priority
                className="relative z-10 hidden h-auto w-full object-contain drop-shadow-2xl dark:block dark:brightness-95 dark:contrast-105"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <main>
        <motion.section
          id="about"
          className="px-4 py-16 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={reveal}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#040947] dark:text-slate-300">
                About
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                Who Dhune.np is for
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                Dhune.np connects customers, vendors, and business users through a clear request, offer, and order workflow built for local laundry needs.
              </p>
            </div>

            <div className="mx-auto mt-9 grid max-w-5xl gap-4 md:grid-cols-3">
              {audienceCards.map((card, index) => {
                const Icon = card.Icon;

                return (
                  <motion.article
                    key={card.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#040947]/25 hover:shadow-lg dark:border-slate-400/15 dark:bg-[#111827]/70 dark:shadow-black/10 dark:hover:border-slate-300/25"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
                    whileHover={{ y: -5, scale: 1.01 }}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#040947] text-white dark:bg-sky-300 dark:text-[#0B1220]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-extrabold text-slate-950 dark:text-white">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{card.description}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.section>

        <HowItWorksSection />
        <DownloadAppSection />
        <FeaturesSection />
        <FaqSection />
      </main>

      <LandingFooter />
      <HelpChatbot />
    </div>
  );
}
