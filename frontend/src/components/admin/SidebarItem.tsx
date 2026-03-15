"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface SidebarItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
  collapsed?: boolean
  compact?: boolean
}

export default function SidebarItem({
  href,
  icon,
  label,
  active,
  collapsed,
  compact,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg font-medium transition",
        collapsed && "justify-center",
        compact ? "px-3 py-2.5 text-xs" : "px-4 py-3 text-sm",
        active
          ? "bg-orange-500 text-black"
          : "text-gray-300 hover:bg-white/10 hover:text-white"
      )}
    >
      <span className={cn(compact ? "w-4 h-4" : "w-5 h-5")}>{icon}</span>
      {label}
    </Link>
  )
}
