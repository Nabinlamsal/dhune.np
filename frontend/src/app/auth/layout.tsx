import LandingFooter from "@/src/components/LandingFooter";
import Navbar from "@/src/components/Navbar";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F7F5EE] text-foreground dark:bg-[#151514]">
            <Navbar />
            <main className="flex min-h-screen items-center justify-center px-4 pb-10 pt-20">
                {children}
            </main>
            <LandingFooter />
        </div>
    );
}
