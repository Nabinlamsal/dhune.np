"use client";

import AudienceSection from "../../components/AudienceSection";
import DownloadAppSection from "@/src/components/DownloadAppSection";
import FaqSection from "@/src/components/FaqSection";
import FeaturesSection from "@/src/components/FeaturesSection";
import HowItWorksSection from "@/src/components/HowItWorksSection";
import LandingFooter from "@/src/components/LandingFooter";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="overflow-x-hidden bg-[#F7F5EE] font-nunito text-[#1A1A2E] dark:bg-[#18212b] dark:text-[#F7F5EE]">
      <section id="home" className="relative min-h-screen bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat px-4 pt-14 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[#f7f5ee]/45 dark:bg-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-full bg-[linear-gradient(90deg,rgba(24,33,43,0.84)_0%,rgba(24,33,43,0.62)_36%,rgba(24,33,43,0.2)_62%,rgba(24,33,43,0)_100%)] dark:block lg:w-[70%]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-28 bg-gradient-to-b from-transparent via-[#18212b]/18 to-[#18212b] dark:block" />

        <div className="relative z-10 flex min-h-[calc(100vh-3.5rem)] items-center px-2 py-16 sm:px-8">
          <div className="w-full max-w-2xl rounded-3xl bg-[#F7F5EE]/45 p-5 backdrop-blur-[2px] dark:bg-[#18212b]/48 sm:p-0 sm:backdrop-blur-none sm:dark:bg-transparent">
            <p className="mb-5 max-w-md font-nunito text-base font-bold text-[#ebbc01] sm:text-lg lg:text-xl">
              / Connect. Compare. Clean.
            </p>
            <h1 className="font-nunito text-4xl font-bold text-[#111827] dark:text-white sm:text-5xl lg:text-6xl">
              Pickup to Delivery,{" "}
              <span className="relative inline-flex">
                <span className="absolute inset-x-0 bottom-0 border-b-[20px] border-[#ebbc01] sm:border-b-[25px]" />
                <span className="relative mt-4 text-3xl font-bold text-[#111827] dark:text-white sm:text-5xl lg:text-6xl">
                  Your Way!
                </span>
              </span>
            </h1>

            <p className="mt-8 text-base font-semibold leading-8 text-neutral-700 dark:text-[#F7F5EE]/80 sm:text-lg lg:text-xl">
              Dhune.np is a laundry marketplace where users create laundry requests from the mobile app, vendors send offers, and users accept the best option before tracking the order.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                onClick={() => router.push("/auth/login")}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-[#040947] px-8 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#121008ea] dark:bg-[#ebbc01] dark:text-[#111827] dark:hover:bg-[#ffd84d]"
                type="button"
              >
                Get Started
              </button>
              <button
                onClick={() => router.push("/auth/signup/vendor")}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-[#ebbc01] px-8 text-sm font-semibold text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#121008ea] hover:text-white dark:hover:bg-white dark:hover:text-[#111827]"
                type="button"
              >
                Vendor Registration
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="flex w-full flex-col gap-4 px-4 py-12 lg:flex-row lg:px-0 lg:py-0">
        <div className="flex items-center justify-center p-0 lg:w-2/5 lg:p-10">
          <Image
            src="/about.jpg"
            width={640}
            height={520}
            className="h-auto max-w-full rounded-2xl shadow-2xl shadow-[#ebbc01]/45"
            alt="Fresh laundry prepared for Dhune pickup and delivery"
          />
        </div>
        <div className="flex flex-col p-0 lg:w-3/5 lg:p-16 xl:p-20">
          <div className="max-w-3xl">
            <p className="mb-5 max-w-md font-nunito text-base font-bold text-[#040947] dark:text-[#ebbc01] sm:text-lg lg:text-xl">
              /About Us
            </p>
            <h2 className="relative text-3xl font-bold text-[#111827] dark:text-white sm:text-5xl">
              Let Your Clothes Shine, Every Time!
              <span className="absolute -bottom-4 left-0 w-1/4 border-b-[10px] border-[#ebbc01]" />
            </h2>

            <p className="mt-8 text-base leading-8 text-neutral-800 dark:text-[#F7F5EE]/75">
              Dhune.np connects users with laundry vendors through a clear request, offer, and order flow. Users create laundry requests, vendors send price and time offers, users compare and accept, and the order is tracked from pickup to completion.
            </p>
            <p className="mt-3 text-base leading-8 text-neutral-700 dark:text-[#F7F5EE]/70">
              Normal users and business users share the same core features; business signup only adds registration verification. Vendors manage laundry work, while admins manage platform operations, support, disputes, users, vendors, and marketplace settings.
            </p>
            <p className="mb-8 mt-3 text-md font-semibold italic text-neutral-600 dark:text-[#F7F5EE]/70 sm:text-md">
              &quot;<span className="font-bold text-[#040947] dark:text-[#ebbc01]">Our Mission </span>
              is to simplify how Nepal does laundry by creating a digital ecosystem where quality, trust, and convenience come together&quot;
            </p>

            <AudienceSection />
          </div>
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />
      <DownloadAppSection />
      <FaqSection />
      <LandingFooter />
    </div>
  );
}
