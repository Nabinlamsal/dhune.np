"use client";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Working Process", href: "#working-process" },
  { label: "Mobile App", href: "#mobile-app" },
  { label: "Help / FAQ", href: "#help-faq" },
];

export default function Navbar() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("dhune-theme");
    const shouldUseDark = storedTheme
      ? storedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    const frame = window.requestAnimationFrame(() => setIsDark(shouldUseDark));

    document.documentElement.classList.toggle("dark", shouldUseDark);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    document.documentElement.classList.toggle("dark", nextTheme);
    window.localStorage.setItem("dhune-theme", nextTheme ? "dark" : "light");
    setIsDark(nextTheme);
  };

  return (
    <nav className="fixed left-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b border-[#040947]/10 bg-[#F7F5EE]/95 px-4 font-nunito font-semibold text-[#1A1A2E] shadow-sm backdrop-blur dark:border-[#ebbc01]/12 dark:bg-[#18212b]/82 dark:text-[#F7F5EE] dark:shadow-[0_10px_35px_rgba(3,7,18,0.16)] sm:px-8">
      <div className="flex items-center space-x-2 sm:px-4 lg:px-10">
        <Image src="/image.png" alt="Dhune logo" width={40} height={40} className="h-10 w-10 rounded-full object-contain mix-blend-multiply dark:mix-blend-normal" />
        <span>Dhune.np</span>
      </div>

      <div className="hidden md:flex justify-center">
        <div className="flex items-center space-x-6 text-sm lg:space-x-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-[#1A1A2E] transition-colors before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-[#ebbc01] before:transition-all hover:text-[#040947] hover:before:w-full dark:text-[#f4f0df]/82 dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#040947]/15 bg-white/70 text-[#040947] transition hover:-translate-y-0.5 hover:bg-white dark:border-[#ebbc01]/18 dark:bg-[#eef5ff]/10 dark:text-[#ebbc01] dark:hover:bg-[#eef5ff]/16"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button onClick={() => router.push("/auth/login")} className="h-8 rounded-lg bg-[#040947] px-4 text-xs text-[#F7F5EE] transition hover:-translate-y-0.5 hover:bg-[#25147bea] dark:bg-[#ebbc01] dark:text-[#111827] dark:hover:bg-[#ffd84d]">
          Book Service
        </button>
      </div>
    </nav >
  );
}
