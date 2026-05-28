import {
  Bell,
  Bot,
  CreditCard,
  GitCompare,
  MapPin,
  MessageSquareWarning,
  Star,
} from "lucide-react";

const features = [
  { title: "Pickup location", description: "Map-based request location for cleaner pickup coordination.", Icon: MapPin },
  { title: "Payment support", description: "Khalti, eSewa, and cash flows are represented in the platform.", Icon: CreditCard },
  { title: "Support chatbot", description: "Help center support stays close to users when questions appear.", Icon: Bot },
  { title: "Report issues", description: "Order reports and dispute support keep problem cases trackable.", Icon: MessageSquareWarning },
  { title: "Ratings", description: "Customers can rate vendors after completed laundry orders.", Icon: Star },
  { title: "Offer comparison", description: "Users compare vendor price, timing, and notes before accepting.", Icon: GitCompare },
  { title: "Notifications", description: "Important account, request, offer, and order updates stay visible.", Icon: Bell },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#040947] dark:text-cyan-200">
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
          {features.map((feature) => {
            const Icon = feature.Icon;

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#040947]/25 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.08] dark:hover:border-cyan-300/30"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#040947]/10 text-[#040947] dark:bg-cyan-300/15 dark:text-cyan-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-950 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.description}</p>
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.08]">
          <a
            href="#user-app"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#040947] px-6 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#0b146b] dark:bg-cyan-300 dark:text-[#07111f] dark:hover:bg-white"
          >
            Download Android App
          </a>
          <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Android app download will be available soon.
          </p>
        </div>
      </div>
    </section>
  );
}
