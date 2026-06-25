"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Car, User, Phone, Calendar, MapPin, FileText, Send } from "lucide-react"

export default function TheftReportForm() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    plateNumber: "",
    ownerName: "",
    phone: "",
    theftDate: "",
    theftLocation: "",
    details: "",
    confirmed: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showRegisterOption, setShowRegisterOption] = useState(false) // ← جديد

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, confirmed: e.target.checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setShowRegisterOption(false)

    try {
      const response = await fetch("/api/report-theft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plateNumber: formData.plateNumber,
          reporterName: formData.ownerName,
          reporterPhone: formData.phone,
          stealDate: formData.theftDate,
          location: formData.theftLocation,
          details: formData.details,
        }),
      })

      const data = await response.json()

      if (response.status === 404 && data.action === "REGISTER_VEHICLE") {
        // ← سيارة غير مسجلة
        setError(data.message)
        setShowRegisterOption(true)
        setIsSubmitting(false)
        return
      }

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ")
      }

      // ← نجاح! ينتقل لصفحة التأكيد
      router.push(`/report-theft/success?id=${data.reportId}`)

    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء الإرسال")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
      {/* العنوان */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-foreground">تقديم بلاغ سرقة</h1>
          <AlertTriangle className="w-8 h-8 text-pink-400" />
        </div>
        <p className="text-muted-foreground">
          يرجى تعبئة البيانات التالية بدقة. سيتم التحقق من البلاغ خلال 24 ساعة.
        </p>
      </div>

      {/* رسالة الخطأ + اقتراح التسجيل */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-500 text-sm font-medium text-right mb-2">
            ⚠️ {error}
          </p>

          {/* ← زر التسجيل إذا السيارة غير موجودة */}
          {showRegisterOption && (
            <button
              onClick={() => router.push("/vehicle/register")}
              className="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition text-sm"
            >
              🚗 تسجيل مركبة جديدة
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* رقم اللوحة */}
        <div>
          <label className="block text-right text-foreground font-medium mb-2">
            رقم اللوحة <span className="text-pink-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleChange}
              placeholder="مثال: 123-أ-45"
              required
              className="w-full px-4 py-3 pr-12 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition text-right"
            />
            <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* اسم المالك */}
        <div>
          <label className="block text-right text-foreground font-medium mb-2">
            اسم المالك الكامل <span className="text-pink-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="الاسم الثلاثي كما في الهوية"
              required
              className="w-full px-4 py-3 pr-12 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition text-right"
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* رقم الهاتف */}
        <div>
          <label className="block text-right text-foreground font-medium mb-2">
            رقم الهاتف <span className="text-pink-400">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="05XXXXXXXX"
              required
              className="w-full px-4 py-3 pr-12 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition text-right"
            />
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* تاريخ و مكان السرقة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-right text-foreground font-medium mb-2">
              تاريخ وقوع السرقة <span className="text-pink-400">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="theftDate"
                value={formData.theftDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:border-primary transition text-right"
              />
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-right text-foreground font-medium mb-2">
              مكان السرقة <span className="text-pink-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="theftLocation"
                value={formData.theftLocation}
                onChange={handleChange}
                placeholder="المدينة / الحي / الشارع"
                required
                className="w-full px-4 py-3 pr-12 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition text-right"
              />
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* تفاصيل إضافية */}
        <div>
          <label className="block text-right text-foreground font-medium mb-2">
            تفاصيل إضافية
          </label>
          <div className="relative">
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="أي تفاصيل إضافية قد تساعد في التحقق..."
              rows={4}
              className="w-full px-4 py-3 pr-12 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition text-right resize-none"
            />
            <FileText className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="confirmed"
            checked={formData.confirmed}
            onChange={handleCheckbox}
            required
            className="w-5 h-5 rounded border-border bg-muted text-primary focus:ring-primary"
          />
          <label htmlFor="confirmed" className="text-foreground text-sm">
            أؤكد أن البيانات المدخلة صحيحة وأنني المالك الشرعي للمركبة <span className="text-pink-400">*</span>
          </label>
        </div>

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.confirmed}
          className="w-full py-4 bg-pink-500 hover:bg-pink-400 disabled:bg-muted disabled:text-muted-foreground text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            "جاري الإرسال..."
          ) : (
            <>
              إرسال البلاغ
              <Send className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}