"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const router = useRouter()
  const [plate, setPlate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dots, setDots] = useState<{ top: string; left: string; delay: string }[]>([])

  // تأثير النقاط الخلفية
  useEffect(() => {
    const newDots = Array.from({ length: 20 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
    }))
    setDots(newDots)
  }, [])

  // دالة البحث
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!plate.trim()) return

    setLoading(true)
    setError("")

    try {
      const encodedPlate = encodeURIComponent(plate.trim())
      const res = await fetch(`/api/vehicle/${encodedPlate}`)

      if (res.status === 404) {
        setError("المعذرة، هذه المركبة غير مسجلة بالنظام.")
        setLoading(false)
        return
      }

      if (!res.ok) {
        throw new Error("حدث خطأ ما")
      }

      // ✅ الانتقال لصفحة التفاصيل
      router.push(`/vehicle/${encodedPlate}`)
    } catch (err) {
      console.error(err)
      setError("حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة لاحقاً.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-background px-4 py-12 sm:py-16 md:py-0">
      {/* خلفية Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:48px_48px] md:bg-[size:64px_64px]" />

      {/* نقاط متحركة */}
      <div className="absolute inset-0">
        {dots.map((dot, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-primary/40 rounded-full animate-pulse"
            style={{ top: dot.top, left: dot.left, animationDelay: dot.delay }}
          />
        ))}
      </div>

      {/* المحتوى */}
      <div className="relative z-10 text-center w-full max-w-4xl mx-auto">
        {/* العنوان */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
          منصة إدارة بيانات المركبات
        </h1>

        {/* الوصف */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-lg sm:max-w-xl md:max-w-2xl mx-auto px-2 sm:px-4 leading-relaxed">
          ابحث برقم اللوحة واطلع على السجل الكامل للمركبة — تأمين، مخالفات، بلاغات، ومالكين
        </p>

        {/* نموذج البحث */}
        <form onSubmit={handleSearch} className="w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              disabled={loading}
              placeholder="أدخل رقم اللوحة (مثال: ج ح خ 5678)"
              className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary disabled:opacity-70 transition text-right text-sm sm:text-base"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  جاري البحث...
                </>
              ) : (
                <>
                  ابحث عن السيارة
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <p className="text-red-500 text-sm font-medium text-right px-2">
              ⚠️ {error}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}