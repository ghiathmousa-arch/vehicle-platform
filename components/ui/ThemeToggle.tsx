"use client"

import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/ui/ThemeProvider"

export default function ThemeToggle() {
  const { dark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full hover:bg-muted transition"
      aria-label="Toggle theme"
    >
      {dark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  )
}