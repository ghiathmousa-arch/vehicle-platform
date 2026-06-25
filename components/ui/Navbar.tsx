"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Menu, X } from "lucide-react"
import NavLink from "./NavLink"
import ThemeToggle from "./ThemeToggle"

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/report-theft", label: "الإبلاغ" },
  { href: "/admin/login", label: "تسجيل الدخول" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 max-w-[70%] sm:max-w-none">
          <img src="/logo.png" alt="Logo" className="w-14 h-14 sm:w-16 sm:h-16 object-contain flex-shrink-0" />
          <span className="text-sm sm:text-xl font-bold text-foreground truncate">
            منصة إدارة بيانات المركبات
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
          <div className="mr-4 border-r border-border pr-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground p-1 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-4 space-y-2 flex flex-col items-stretch animate-fadeIn">
          {links.map((link) => (
            <div key={link.href} onClick={() => setIsOpen(false)} className="w-full">
              <NavLink href={link.href} label={link.label} />
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}