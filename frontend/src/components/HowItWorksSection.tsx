import {
  BadgeCheck,
  ClipboardList,
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

export default function HowItWorksSection() {
  return (
    <section className="mx-5 my-10 overflow-hidden rounded-[2rem] border border-[#040947]/10 bg-gradient-to-br from-[#fffdf7] via-white to-[#f3f0e4] px-6 py-10 shadow-sm sm:px-8 lg:px-10">
      <div>
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

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {flowSteps.map((step, index) => {
              const Icon = step.Icon;

              return (
                <article
                  key={step.title}
                  className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_10px_35px_rgba(4,9,71,0.05)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#040947] text-white">
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
      </div>
    </section>
  );
}
