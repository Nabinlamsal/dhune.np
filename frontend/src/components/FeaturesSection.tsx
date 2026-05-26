import {
    Bell,
    CreditCard,
    GitCompare,
    HandCoins,
    LifeBuoy,
    SearchCheck,
    ShieldCheck,
    Truck,
} from "lucide-react";

const features = [
    {
        title: "Multiple Vendors",
        description: "Browse verified laundry partners and choose based on service quality.",
        Icon: SearchCheck,
        accent: "bg-[#040947] text-white",
    },
    {
        title: "Transparent Pricing",
        description: "Compare offers clearly and confirm the option that matches your budget.",
        Icon: HandCoins,
        accent: "bg-[#ebbc01] text-[#111827]",
    },
    {
        title: "Offer Comparison",
        description: "Review price, delivery time, vendor notes, and choose the best offer.",
        Icon: GitCompare,
        accent: "bg-[#040947] text-white",
    },
    {
        title: "Pickup & Delivery",
        description: "Book convenient slots and get your laundry returned to your doorstep.",
        Icon: Truck,
        accent: "bg-[#ebbc01] text-[#111827]",
    },
    {
        title: "Live Status Tracking",
        description: "Follow each order stage with clear status updates from request to delivery.",
        Icon: ShieldCheck,
        accent: "bg-[#040947] text-white",
    },
    {
        title: "Payment Support",
        description: "Support for cash and online payments with clear order payment status.",
        Icon: CreditCard,
        accent: "bg-[#ebbc01] text-[#111827]",
    },
    {
        title: "Notifications",
        description: "Get updates when vendors respond, orders move, or support action is needed.",
        Icon: Bell,
        accent: "bg-[#040947] text-white",
    },
    {
        title: "Admin Support",
        description: "Dispute handling and marketplace operations are managed by platform admins.",
        Icon: LifeBuoy,
        accent: "bg-[#ebbc01] text-[#111827]",
    },
];

export default function FeaturesSection() {
    return (
        <section className="section-reveal mx-4 my-10 rounded-3xl border border-slate-200 bg-white/80 px-6 py-8 shadow-sm dark:border-white/10 dark:bg-[#1d1d1a]/85 sm:mx-5 sm:px-8">
            <p className="text-sm font-bold tracking-wide text-[#040947] dark:text-[#ebbc01]">/ Why Dhune</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                A cleaner way to manage laundry requests and delivery
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-[#F7F5EE]/70">
                Dhune keeps the marketplace simple: requests, vendor offers, order tracking, payments, notifications, and admin support stay connected in one platform.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => {
                    const Icon = feature.Icon;

                    return (
                        <article
                            key={feature.title}
                            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-[#040947]/25 hover:shadow-md dark:border-white/10 dark:bg-[#242420] dark:hover:border-[#ebbc01]/40"
                        >
                            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${feature.accent}`}>
                                <Icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-[#F7F5EE]/65">{feature.description}</p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
