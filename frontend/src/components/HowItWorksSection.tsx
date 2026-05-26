import {
  BadgeCheck,
  ClipboardList,
  CreditCard,
  PackageCheck,
  Shirt,
  Store,
  Wrench,
} from "lucide-react";

const flowSteps = [
  {
    title: "User creates request",
    description:
      "Users submit laundry details, pickup timing, location, and care instructions from the mobile app.",
    Icon: ClipboardList,
  },
  {
    title: "Vendors send offers",
    description:
      "Laundry vendors review the request and respond with pricing, turnaround time, and service notes.",
    Icon: Store,
  },
  {
    title: "User accepts offer",
    description:
      "The user compares price, time, and vendor fit before accepting the best offer.",
    Icon: BadgeCheck,
  },
  {
    title: "Order is created",
    description:
      "Once selected, the request becomes an active order shared between the user and vendor.",
    Icon: PackageCheck,
  },
  {
    title: "Laundry is processed",
    description:
      "The vendor handles pickup, cleaning, and delivery while keeping the order moving.",
    Icon: Shirt,
  },
  {
    title: "Status and payment",
    description:
      "Users track order status and payment while commissions are recorded in the background.",
    Icon: CreditCard,
  },
  {
    title: "Completion and support",
    description:
      "Orders complete with ratings, and admins handle support or disputes when needed.",
    Icon: Wrench,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="working-process" className="section-reveal mx-4 my-10 overflow-hidden rounded-[2rem] border border-[#040947]/10 bg-gradient-to-br from-[#fffdf7] via-white to-[#f3f0e4] px-6 py-10 shadow-sm dark:border-white/10 dark:from-[#20201d] dark:via-[#1a1a18] dark:to-[#242014] sm:mx-5 sm:px-8 lg:px-10">
      <div>
        <div>
          <p className="text-sm font-bold tracking-wide text-[#040947] dark:text-[#ebbc01]">
            / Working Process
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            A complete marketplace flow from request to delivery
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-[#F7F5EE]/70 sm:text-base">
            Dhune.np keeps laundry work structured: users create requests, vendors bid, users accept, orders are tracked, and payment plus commission records stay organized in the background.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {flowSteps.map((step, index) => {
              const Icon = step.Icon;

              return (
                <article
                  key={step.title}
                  className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_10px_35px_rgba(4,9,71,0.05)] transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#242420]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#040947] text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#ebbc01]/20 px-2 text-xs font-extrabold text-[#8a6d00]">
                        0{index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-[#F7F5EE]/65">
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
