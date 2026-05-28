import { ArrowDown, ArrowRight, BadgeCheck, ClipboardList, PackageCheck, Route, Store } from "lucide-react";

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
    title: "Pickup & Delivery",
    description: "Vendor handles pickup, laundry, and return.",
    Icon: Route,
  },
  {
    title: "Track & Complete",
    description: "Follow progress, pay, rate, or get support.",
    Icon: PackageCheck,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#040947] dark:text-cyan-200">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            A simple connected laundry flow
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            Customers and vendors move through one clear request, offer, and order path.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-5 lg:items-stretch">
          {flowSteps.map((step, index) => {
            const Icon = step.Icon;
            const isLast = index === flowSteps.length - 1;

            return (
              <div key={step.title} className="relative">
                <article className="relative z-10 h-full rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#040947]/25 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.08] dark:hover:border-cyan-300/30">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#040947] text-white shadow-lg shadow-[#040947]/15 dark:bg-cyan-300 dark:text-[#07111f] dark:shadow-cyan-300/15">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="mt-4 inline-flex rounded-full bg-[#ebbc01]/20 px-3 py-1 text-[11px] font-black text-[#765d00] dark:bg-cyan-300/15 dark:text-cyan-100">
                    STEP 0{index + 1}
                  </span>
                  <h3 className="mt-3 text-base font-extrabold text-slate-950 dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.description}</p>
                </article>

                {!isLast ? (
                  <>
                    <div className="absolute left-1/2 top-full z-0 flex h-4 -translate-x-1/2 items-center justify-center lg:left-auto lg:right-[-22px] lg:top-1/2 lg:h-auto lg:translate-x-0 lg:-translate-y-1/2">
                      <ArrowDown className="h-5 w-5 text-[#040947]/35 dark:text-cyan-200/45 lg:hidden" />
                      <ArrowRight className="hidden h-5 w-5 text-[#040947]/35 dark:text-cyan-200/45 lg:block" />
                    </div>
                    <div className="mx-auto h-4 w-px bg-[#040947]/15 dark:bg-cyan-200/20 lg:absolute lg:right-[-18px] lg:top-1/2 lg:mx-0 lg:h-px lg:w-9" />
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
