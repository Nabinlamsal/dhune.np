const stackGroups = [
  {
    title: "Backend",
    items: ["Go", "Gin", "PostgreSQL", "sqlc", "JWT", "WebSocket", "Firebase", "SMTP", "Cloudinary", "Khalti", "eSewa"],
  },
  {
    title: "Web",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "React Query", "Axios", "Leaflet"],
  },
  {
    title: "Mobile",
    items: ["Expo", "React Native", "Expo Router", "Expo Notifications", "Expo Location", "React Query"],
  },
  {
    title: "Platform",
    items: ["Role-based access", "Request-offer-order workflow", "Vendor approval", "Finance/commission tracking", "Notifications", "Dispute and rating system"],
  },
];

export default function TechStackSection() {
  return (
    <section id="tech-stack" className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#040947] dark:text-cyan-200">
            Tech Stack
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">
            Built as a complete full-stack SaaS platform
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Dhune.np combines mobile, web, backend, notifications, payments, and operations workflows.
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stackGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.08]"
            >
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-950 dark:text-white">{group.title}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={`${group.title}-${item}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.08] dark:text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
