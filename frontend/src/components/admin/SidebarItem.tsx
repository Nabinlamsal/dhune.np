"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface SidebarItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
  compact?: boolean
  className?: string
}

export default function SidebarItem({
  href,
  icon,
  label,
  active,
  compact,
  className,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-transparent font-medium transition",
        compact ? "px-3 py-2.5 text-xs" : "px-4 py-3 text-sm",
        active
          ? "border-amber-300/70 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-[#040947] shadow-sm"
          : "text-slate-200 hover:border-amber-300/40 hover:bg-amber-400/15 hover:text-amber-100",
        className
      )}
    >
      <span className={cn("shrink-0", compact ? "w-4 h-4" : "w-5 h-5")}>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
