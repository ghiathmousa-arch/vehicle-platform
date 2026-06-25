"use client"

import { createContext, useContext, useState, useEffect } from "react"

type Theme = "dark" | "light" | "system"

const ThemeContext = createContext({
  theme: "system" as Theme,
  dark: true,
  toggle: () => { },
  setTheme: (theme: Theme) => { },
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState < Theme > ("system")
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("theme") as Theme | null
    if (saved) setThemeState(saved)
  }, [])

  // تطبيق الـ theme
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    root.classList.remove("dark")

    let isDark = false

    if (theme === "dark") {
      isDark = true
    } else if (theme === "light") {
      isDark = false
    } else {
      // system
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    }

    if (isDark) {
      root.classList.add("dark")
    }
    setDark(isDark)
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  // تتبع تغيير system preference لما يكون theme = system
  useEffect(() => {
    if (!mounted || theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => {
      const root = document.documentElement
      if (e.matches) {
        root.classList.add("dark")
        setDark(true)
      } else {
        root.classList.remove("dark")
        setDark(false)
      }
    }
    media.addEventListener("change", handler)
    return () => media.removeEventListener("change", handler)
  }, [theme, mounted])

  const toggle = () => {
    setThemeState(prev => {
      if (prev === "dark") return "light"
      if (prev === "light") return "dark"
      // لو system، نتحقق من النظام الحالي ونقلب عكسه
      const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      return systemIsDark ? "light" : "dark"
    })
  }

  const setTheme = (t: Theme) => setThemeState(t)

  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ theme, dark, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)