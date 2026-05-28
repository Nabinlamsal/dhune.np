import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "User App", href: "#user-app" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-12 text-slate-700 dark:border-white/10 dark:bg-[#040916] dark:text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 text-center lg:grid-cols-[1.1fr_1.4fr_0.8fr] lg:items-start lg:text-left">
        <Link href="/" className="mx-auto flex items-center gap-3 lg:mx-0" aria-label="Dhune home">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10">
            <Image src="/image.png" alt="Dhune logo" width={32} height={32} className="h-8 w-8 object-contain" />
          </span>
          <span>
            <span className="block text-xl font-black text-slate-950 dark:text-white">Dhune.np</span>
            <span className="mt-1 block max-w-xs text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
              Smart laundry marketplace for Nepal
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm font-bold lg:justify-center">
          {quickLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-[#040947] dark:hover:text-cyan-200">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 text-sm lg:items-end">
          <a href="mailto:support@dhune.np" className="inline-flex items-center gap-2 font-bold transition hover:text-[#040947] dark:hover:text-cyan-200">
            <Mail className="h-4 w-4" />
            support@dhune.np
          </a>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Dhune.np. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
