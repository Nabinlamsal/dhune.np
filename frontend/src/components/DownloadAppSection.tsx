import {
    BellRing,
    CheckCircle2,
    CreditCard,
    Languages,
    Moon,
    Settings,
} from "lucide-react";
import Image from "next/image";

const appFeatures = [
    { label: "Create laundry requests", Icon: CheckCircle2 },
    { label: "Compare and accept offers", Icon: CheckCircle2 },
    { label: "Track request and order lifecycle", Icon: CheckCircle2 },
    { label: "Khalti and cash payment support", Icon: CreditCard },
    { label: "eSewa coming soon", Icon: CreditCard },
    { label: "Real-time notifications", Icon: BellRing },
    { label: "Dark and light mode", Icon: Moon },
    { label: "English and Nepali accessibility", Icon: Languages },
    { label: "Profile, help, terms, and privacy", Icon: Settings },
];

export default function DownloadAppSection() {
    return (
        <section id="mobile-app" className="section-reveal relative overflow-hidden bg-[#040947] px-4 py-20 text-white dark:bg-[#171716] sm:px-6 lg:px-8 lg:py-24">
            <div className="absolute inset-0">
                <div className="absolute right-[-100px] top-[-100px] h-[500px] w-[500px] rounded-full bg-[#ebbc01] opacity-20 blur-[120px]" />
                <div className="absolute bottom-[-100px] left-[-100px] h-[400px] w-[400px] rounded-full bg-blue-500 opacity-20 blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.12)_1px,_transparent_1px)] bg-[size:30px_30px] opacity-20" />
            </div>

            <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-14 lg:flex-row">
                <div className="relative flex min-h-[390px] w-full items-center justify-center lg:w-1/2">
                    <Image
                        src="/request.png"
                        width={260}
                        height={560}
                        alt="Dhune mobile request screen"
                        className="absolute left-[2%] top-12 z-10 hidden w-[190px] rotate-[-10deg] rounded-2xl opacity-80 shadow-xl transition duration-500 hover:scale-105 sm:block lg:w-[245px]"
                    />
                    <Image
                        src="/home.png"
                        width={300}
                        height={620}
                        alt="Dhune mobile home screen"
                        className="z-30 w-[230px] rounded-2xl shadow-2xl transition duration-500 hover:scale-105 lg:w-[300px]"
                    />
                    <Image
                        src="/order.png"
                        width={260}
                        height={560}
                        alt="Dhune mobile order tracking screen"
                        className="absolute right-[2%] top-20 z-10 hidden w-[190px] rotate-[10deg] rounded-2xl opacity-80 shadow-xl transition duration-500 hover:scale-105 md:block lg:w-[245px]"
                    />
                    <div className="absolute bottom-[-30px] h-[50px] w-[250px] rounded-full bg-[#ebbc01] opacity-30 blur-2xl" />
                </div>

                <div className="w-full text-center lg:w-1/2 lg:text-left">
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ebbc01]">
                        / Mobile App
                    </p>
                    <h2 className="mt-3 text-4xl font-extrabold leading-tight text-[#ebbc01] md:text-5xl lg:text-6xl">
                        Complete booking experience in the app
                    </h2>

                    <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-gray-300 lg:mx-0">
                        The React Native mobile app is where users create laundry requests, compare vendor offers, accept orders, pay, receive notifications, and manage profile or help screens.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        {appFeatures.map((feature) => {
                            const Icon = feature.Icon;

                            return (
                                <div
                                    key={feature.label}
                                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-left text-sm font-semibold text-white/90 transition hover:-translate-y-0.5 hover:bg-white/15"
                                >
                                    <Icon className="h-5 w-5 shrink-0 text-[#ebbc01]" />
                                    <span>{feature.label}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
                        <button className="rounded-lg bg-[#ebbc01] px-8 py-3 font-semibold text-black transition hover:-translate-y-0.5 hover:bg-[#ffd84d]">
                            Google Play
                        </button>
                        <button className="rounded-lg bg-white px-8 py-3 font-semibold text-black transition hover:-translate-y-0.5 hover:bg-[#F7F5EE]">
                            App Store
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
