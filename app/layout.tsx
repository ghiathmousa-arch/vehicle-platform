import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ui/ThemeProvider"

const cairo = Cairo({ subsets: ["arabic"] })

export const metadata: Metadata = {
  title: "منصة إدارة بيانات المركبات",
  description: "المنصة الحكومية لإدارة بيانات المركبات",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}