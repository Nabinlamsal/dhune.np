import { HandCoins, SearchCheck, Truck, ShieldCheck } from "lucide-react";

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
        title: "Pickup & Delivery",
        description: "Book convenient slots and get your laundry returned to your doorstep.",
        Icon: Truck,
        accent: "bg-[#040947] text-white",
    },
    {
        title: "Reliable Tracking",
        description: "Follow each order stage with clear status updates from request to delivery.",
        Icon: ShieldCheck,
        accent: "bg-[#ebbc01] text-[#111827]",
    },
];

export default function FeaturesSection() {
    return (
        <section className="mx-5 my-10 rounded-3xl border border-slate-200 bg-white/80 px-6 py-8 shadow-sm sm:px-8">
            <p className="text-sm font-bold tracking-wide text-[#040947]">/ Why Dhune</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-bold text-slate-900 sm:text-3xl">
                A cleaner way to manage laundry requests and delivery
            </h2>

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => {
                    const Icon = feature.Icon;

                    return (
                        <article
                            key={feature.title}
                            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#040947]/25 hover:shadow-md"
                        >
                            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${feature.accent}`}>
                                <Icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
