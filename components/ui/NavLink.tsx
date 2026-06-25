// components/ui/NavLink.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface Props {
  href: string
  label: string
}

export default function NavLink({ href, label }: Props) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg transition ${active
          ? "text-cyan-400 font-semibold"
          : "text-gray-300 hover:text-white"
        }`}
    >
      {label}
    </Link>
  )
}