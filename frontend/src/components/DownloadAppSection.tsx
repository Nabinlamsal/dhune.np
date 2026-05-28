import { BellRing, CheckCircle2, Languages, Settings } from "lucide-react";

const screenshots: string[] = [];

const appHighlights = [
  { label: "Nepali & English", Icon: Languages },
  { label: "Order Tracking", Icon: CheckCircle2 },
  { label: "Notifications", Icon: BellRing },
  { label: "Profile & Preferences", Icon: Settings },
];

export default function DownloadAppSection() {
  return (
    <section id="user-app" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.07] sm:p-8 lg:p-10">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="mx-auto w-full max-w-sm">
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[270px] rounded-[2rem] border border-slate-300 bg-slate-950 p-3 shadow-2xl shadow-[#040947]/15 dark:border-white/15 dark:shadow-cyan-300/10">
              <div className="h-full overflow-hidden rounded-[1.45rem] bg-gradient-to-b from-slate-100 to-white dark:from-[#07111f] dark:to-[#0d1b2e]">
                {screenshots.length > 0 ? null : (
                  <div className="flex h-full flex-col justify-between p-5">
                    <div>
                      <div className="h-3 w-24 rounded-full bg-slate-300 dark:bg-white/20" />
                      <div className="mt-6 h-9 w-36 rounded-xl bg-[#040947] dark:bg-cyan-300" />
                      <div className="mt-5 grid gap-3">
                        {[0, 1, 2].map((item) => (
                          <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/10">
                            <div className="h-3 w-3/4 rounded-full bg-slate-200 dark:bg-white/20" />
                            <div className="mt-3 h-3 w-1/2 rounded-full bg-slate-100 dark:bg-white/10" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((item) => (
                        <div key={item} className="h-10 rounded-xl bg-slate-200 dark:bg-white/15" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#040947] dark:text-cyan-200">
              User App
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              A mobile-first laundry experience
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 lg:mx-0">
              Ready for light and dark app screenshots, with a clean placeholder until the final screens are added.
            </p>

            <div className="mx-auto mt-7 grid max-w-xl gap-3 sm:grid-cols-2 lg:mx-0">
              {appHighlights.map((feature) => {
                const Icon = feature.Icon;

                return (
                  <div
                    key={feature.label}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.08] dark:text-slate-200"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-[#040947] dark:text-cyan-200" />
                    <span>{feature.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
