import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const footerGroups = [
  {
    title: "Quick links",
    links: [
      { label: "Home", href: "#home" },
      { label: "About", href: "#about" },
      { label: "Working Process", href: "#working-process" },
      { label: "App", href: "#mobile-app" },
      { label: "Help and FAQ", href: "#help-faq" },
    ],
  },
  {
    title: "User links",
    links: [
      { label: "Login", href: "/auth/login" },
      { label: "User signup", href: "/auth/signup/user" },
      { label: "Forgot password", href: "/auth/forgot-password" },
      { label: "Help center", href: "#help-faq" },
    ],
  },
  {
    title: "Vendor links",
    links: [
      { label: "Vendor registration", href: "/auth/signup/vendor" },
      { label: "Business registration", href: "/auth/signup/business" },
      { label: "Vendor login", href: "/auth/login" },
      { label: "Working Process", href: "#working-process" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "mailto:support@dhune.np" },
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Admin login", href: "/auth/login" },
      { label: "Status", href: "#" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", Icon: Facebook },
  { label: "Instagram", Icon: Instagram },
  { label: "LinkedIn", Icon: Linkedin },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-border bg-[#040947] text-white dark:bg-[#101114]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Dhune home">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                <Image src="/logo.png" alt="Dhune logo" width={30} height={30} className="h-8 w-8 object-contain" />
              </span>
              <span className="text-xl font-extrabold">Dhune.np</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
              A modern laundry marketplace for Nepal, connecting mobile app users with verified vendors, business laundry needs, payments, tracking, and support.
            </p>
            <div className="mt-6 space-y-3 text-sm text-white/75">
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#ebbc01]" />
                support@dhune.np
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#ebbc01]" />
                +977 9800000000
              </p>
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#ebbc01]" />
                Kathmandu, Nepal
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#ebbc01]">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-sm font-semibold text-white/70 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} Dhune.np. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.Icon;

              return (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:-translate-y-0.5 hover:border-[#ebbc01] hover:text-[#ebbc01]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
