"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PUBLIC_THEME_KEY = "dhune-public-theme";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "User App", href: "/#user-app" },
  { label: "Features", href: "/#features" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(PUBLIC_THEME_KEY);
    const shouldUseDark = storedTheme ? storedTheme === "dark" : true;

    document.documentElement.classList.toggle("dark", shouldUseDark);
    document.documentElement.dataset.theme = shouldUseDark ? "dark" : "light";

    const frame = window.requestAnimationFrame(() => setIsDark(shouldUseDark));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    document.documentElement.classList.toggle("dark", nextTheme);
    document.documentElement.dataset.theme = nextTheme ? "dark" : "light";
    window.localStorage.setItem(PUBLIC_THEME_KEY, nextTheme ? "dark" : "light");
    setIsDark(nextTheme);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-slate-200/70 bg-[rgba(255,255,255,0.82)] font-nunito text-slate-950 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(7,17,31,0.82)] dark:text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/#home" onClick={closeMenu} className="flex items-center gap-3" aria-label="Dhune.np home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/95">
            <Image src="/image.png" alt="Dhune logo" width={28} height={28} className="h-7 w-7 object-contain" priority />
          </span>
          <span className="text-lg font-extrabold tracking-tight">Dhune.np</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-semibold lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-slate-600 transition hover:text-[#040947] dark:text-slate-300 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#040947] transition hover:-translate-y-0.5 hover:border-[#040947]/25 hover:shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-cyan-200 dark:hover:bg-white/15"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => {
              closeMenu();
              router.push("/auth/login");
            }}
            className="hidden h-10 items-center justify-center rounded-xl bg-[#040947] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0b146b] dark:bg-cyan-300 dark:text-[#07111f] dark:hover:bg-white sm:inline-flex"
            type="button"
          >
            Get Started
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 lg:hidden dark:border-white/10 dark:bg-white/10 dark:text-white"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden dark:border-white/10 dark:bg-[#07111f]">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                closeMenu();
                router.push("/auth/login");
              }}
              className="mt-2 h-11 rounded-xl bg-[#040947] px-4 text-sm font-bold text-white dark:bg-cyan-300 dark:text-[#07111f]"
              type="button"
            >
              Get Started
            </button>
            <button
              onClick={() => {
                closeMenu();
                router.push("/auth/signup/vendor");
              }}
              className="mt-2 h-11 rounded-xl border border-[#040947]/15 px-4 text-sm font-bold text-[#040947] dark:border-cyan-300/30 dark:text-cyan-200"
              type="button"
            >
              Become a Vendor
            </button>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
