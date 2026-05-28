import LandingFooter from "@/src/components/LandingFooter";
import Navbar from "@/src/components/Navbar";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen overflow-x-hidden bg-[#f7f8fb] text-slate-950 dark:bg-[#050b16] dark:text-white">
            <Navbar />
            <main className="relative flex min-h-screen items-center justify-center px-4 pb-12 pt-24 sm:px-6 lg:px-8">
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#ffffff_0%,#eef5ff_52%,#f7f8fb_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),linear-gradient(180deg,#07111f_0%,#08111f_52%,#050b16_100%)]" />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(4,9,71,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(4,9,71,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70 dark:bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] dark:opacity-45" />
                {children}
            </main>
            <LandingFooter />
        </div>
    );
}
