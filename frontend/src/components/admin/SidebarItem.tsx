"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface SidebarItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
}

export default function SidebarItem({
  href,
  icon,
  label,
  active,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition",
        active
          ? "bg-orange-500 text-black"
          : "text-gray-300 hover:bg-white/10 hover:text-white"
      )}
    >
      <span className="w-5 h-5">{icon}</span>
      {label}
    </Link>
  )
}
