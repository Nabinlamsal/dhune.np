"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const darkScreens = ["/dark-1.png", "/dark-2.png", "/dark-3.png", "/dark-4.png", "/dark-5.png", "/dark-6.png"];
const lightScreens = ["/light-1.png", "/light-2.png", "/light-3.png", "/light-4.png", "/light-5.png", "/light-6.png"];
const appFeatures = ["Create requests", "Compare offers", "Track orders", "Manage payments"];

function PhoneFrame({ index, focus = "active" }: { index: number; focus?: "active" | "side" }) {
  const isActive = focus === "active";

  return (
    <motion.div
      key={`${focus}-${index}`}
      className={`relative mx-auto aspect-[9/16] w-full rounded-[2rem] border bg-slate-950 p-2 transition-all duration-500 ease-out ${
        isActive
          ? "max-w-[250px] border-[#040947]/35 opacity-100 shadow-2xl shadow-[#040947]/20 dark:border-slate-300/25 dark:shadow-black/25 lg:max-w-[270px]"
          : "max-w-[190px] border-slate-300/80 opacity-70 shadow-xl shadow-[#040947]/8 dark:border-slate-400/15 dark:shadow-black/20 lg:max-w-[205px]"
      }`}
      initial={{ opacity: 0, y: 12, scale: isActive ? 0.96 : 0.82 }}
      animate={{ opacity: isActive ? 1 : 0.7, y: 0, scale: isActive ? 1 : 0.86 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="absolute left-1/2 top-3 z-20 h-1.5 w-16 -translate-x-1/2 rounded-full bg-slate-900/70 dark:bg-black/70" />
      <div className="relative h-full overflow-hidden rounded-[1.55rem] bg-slate-100 dark:bg-[#111827]">
        <Image
          src={lightScreens[index]}
          alt={`Dhune mobile app light screenshot ${index + 1}`}
          fill
          sizes={isActive ? "(max-width: 640px) 76vw, 270px" : "205px"}
          className="object-contain dark:hidden"
          priority={index === 0}
        />
        <Image
          src={darkScreens[index]}
          alt={`Dhune mobile app dark screenshot ${index + 1}`}
          fill
          sizes={isActive ? "(max-width: 640px) 76vw, 270px" : "205px"}
          className="hidden object-contain dark:block"
          priority={index === 0}
        />
      </div>
    </motion.div>
  );
}

export default function DownloadAppSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % darkScreens.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  const goToPrevious = () => setActive((current) => (current - 1 + darkScreens.length) % darkScreens.length);
  const goToNext = () => setActive((current) => (current + 1) % darkScreens.length);
  const previous = (active - 1 + darkScreens.length) % darkScreens.length;
  const next = (active + 1) % darkScreens.length;

  return (
    <motion.section
      id="user-app"
      className="px-4 py-16 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-400/15 dark:bg-[#111827]/70 dark:shadow-black/10 sm:p-8 lg:p-10">
        <div className="grid items-center gap-9 lg:grid-cols-[2fr_1fr]">
          <div className="relative mx-auto w-full max-w-4xl overflow-hidden px-8 sm:px-12">
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 z-30 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#040947] shadow-sm transition hover:-translate-y-[55%] hover:border-[#040947]/30 dark:border-slate-400/15 dark:bg-[#1F2937]/80 dark:text-slate-200 dark:hover:bg-slate-700"
              aria-label="Previous app screenshot"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex w-full items-center justify-center gap-0 sm:gap-2 lg:gap-4">
              <div className="hidden w-[28%] shrink-0 sm:block">
                <PhoneFrame index={previous} focus="side" />
              </div>
              <div className="relative z-20 w-full max-w-[270px] shrink-0 sm:w-[36%] lg:max-w-[300px]">
                <PhoneFrame index={active} focus="active" />
              </div>
              <div className="hidden w-[28%] shrink-0 sm:block">
                <PhoneFrame index={next} focus="side" />
              </div>
            </div>

            <button
              type="button"
              onClick={goToNext}
              className="absolute right-0 top-1/2 z-30 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[#040947] shadow-sm transition hover:-translate-y-[55%] hover:border-[#040947]/30 dark:border-slate-400/15 dark:bg-[#1F2937]/80 dark:text-slate-200 dark:hover:bg-slate-700"
              aria-label="Next app screenshot"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="mt-5 flex items-center justify-center gap-2">
              {darkScreens.map((screen, index) => (
                <button
                  key={screen}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    active === index ? "w-7 bg-[#040947] dark:bg-sky-300" : "w-2.5 bg-slate-300 dark:bg-slate-600"
                  }`}
                  aria-label={`Show app screenshot ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#040947] dark:text-slate-300">
              User App
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Laundry requests from your phone
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              Create pickup requests, review vendor offers, track orders, and manage payments in a mobile-first Dhune experience.
            </p>

            <div className="mx-auto mt-5 grid max-w-sm gap-2.5 lg:mx-0">
              {appFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm font-bold text-slate-700 dark:border-slate-400/15 dark:bg-[#1F2937]/70 dark:text-slate-200"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#040947] dark:text-sky-300" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <a
              href="#user-app"
              className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-[#040947] px-4 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#0b146b] dark:bg-sky-300 dark:text-[#0B1220] dark:hover:bg-sky-200"
            >
              Download Android App
            </a>
            <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Android app download will be available soon.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
