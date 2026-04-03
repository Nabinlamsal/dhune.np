import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  LayoutDashboard,
  PackageCheck,
  Store,
} from "lucide-react";

const flowSteps = [
  {
    title: "Request placed",
    description:
      "Users submit laundry details, pickup timing, and any care instructions in one clean request.",
    Icon: ClipboardList,
  },
  {
    title: "Vendors send offers",
    description:
      "Verified laundry partners review the request and respond with pricing, turnaround date, and notes.",
    Icon: Store,
  },
  {
    title: "User compares choices",
    description:
      "The platform makes it easy to compare price, speed, and vendor fit before confirming the best option.",
    Icon: BadgeCheck,
  },
  {
    title: "Order is created",
    description:
      "Once selected, the request becomes an active order with status tracking through pickup, cleaning, and delivery.",
    Icon: PackageCheck,
  },
];

const saasPoints = [
  "Marketplace-style request collection for users, households, and businesses",
  "Centralized vendor responses with transparent price and date comparison",
  "Order lifecycle visibility from pickup scheduling to final delivery",
  "A scalable operating model for multi-vendor laundry coordination",
];

export default function HowItWorksSection() {
  return (
    <section className="mx-5 my-10 overflow-hidden rounded-[2rem] border border-[#040947]/10 bg-gradient-to-br from-[#fffdf7] via-white to-[#f3f0e4] px-6 py-10 shadow-sm sm:px-8 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm font-bold tracking-wide text-[#040947]">
            / Working Process
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold text-slate-900 sm:text-4xl">
            A marketplace flow built for fast vendor matching and clear order creation
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Dhune.np works like a focused laundry SaaS platform: a request goes out,
            vendors compete with offers, users compare what matters, and the chosen
            service turns into a trackable order.
          </p>

          <div className="mt-8 grid gap-4">
            {flowSteps.map((step, index) => {
              const Icon = step.Icon;

              return (
                <article
                  key={step.title}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_10px_35px_rgba(4,9,71,0.05)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#040947] text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#ebbc01]/20 px-2 text-xs font-extrabold text-[#8a6d00]">
                        0{index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-[1.75rem] bg-[#040947] p-6 text-white shadow-[0_25px_60px_rgba(4,9,71,0.24)]">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <LayoutDashboard className="h-6 w-6 text-[#ebbc01]" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                  Workflow Snapshot
                </p>
                <h3 className="text-2xl font-bold">Request to order, without friction</h3>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/6 p-5">
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-white">
                <span className="rounded-full bg-white/10 px-4 py-2">Request</span>
                <ArrowRight className="h-4 w-4 text-[#ebbc01]" />
                <span className="rounded-full bg-white/10 px-4 py-2">Vendor Offer</span>
                <ArrowRight className="h-4 w-4 text-[#ebbc01]" />
                <span className="rounded-full bg-white/10 px-4 py-2">
                  Best Price + Date
                </span>
                <ArrowRight className="h-4 w-4 text-[#ebbc01]" />
                <span className="rounded-full bg-[#ebbc01] px-4 py-2 text-[#111827]">
                  Order Created
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[#ebbc01]/30 bg-[#fff7d6] p-6">
            <p className="text-sm font-bold tracking-wide text-[#8a6d00]">
              / Why this works as SaaS
            </p>
            <div className="mt-4 grid gap-3">
              {saasPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-2xl bg-white/80 px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#ebbc01]" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
