import Link from "next/link"
import { CheckCircle, ArrowRight, FileCheck, Clock, Shield, Home, Send } from "lucide-react"
import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/ui/Footer"

export default function SuccessPage({ searchParams }: { searchParams: { id?: string } }) {
  const reportId = searchParams.id

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <Navbar />

      {/* المحتوى الرئيسي */}
      <main className="flex-1 flex items-center justify-center relative overflow-hidden px-4 py-12">

        {/* خلفية زخرفية */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.06),transparent_50%)]" />

        {/* نقاط خلفية */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-primary/25 rounded-full animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 max-w-lg w-full">

          {/* بطاقة النجاح */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-10 shadow-2xl shadow-primary/5 text-center">

            {/* أيقونة متحركة */}
            <div className="relative mx-auto mb-6">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/20 animate-in zoom-in duration-500">
                <CheckCircle className="w-12 h-12 text-emerald-500" />
              </div>
              {/* تأثير نبضة */}
              <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-emerald-500/20 animate-ping opacity-20" />
            </div>

            {/* العنوان */}
            <h1 className="text-3xl font-bold text-foreground mb-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
              تم إرسال البلاغ بنجاح!
            </h1>

            {/* الوصف */}
            <p className="text-muted-foreground mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
              سيتم مراجعة البلاغ من قبل فريقنا والتحقق من صحته خلال
              <span className="text-foreground font-semibold mx-1">24 ساعة</span>
              القادمة.
            </p>

            {/* خطوات العملية */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <StepItem
                icon={<FileCheck className="w-5 h-5" />}
                label="تم الإرسال"
                active
              />
              <StepItem
                icon={<Clock className="w-5 h-5" />}
                label="قيد المراجعة"
              />
              <StepItem
                icon={<Shield className="w-5 h-5" />}
                label="تم التحقق"
              />
            </div>

            {/* رقم البلاغ */}
            {reportId && (
              <div className="bg-muted/50 border border-border rounded-xl p-4 mb-8 animate-in fade-in duration-700 delay-200">
                <p className="text-sm text-muted-foreground mb-1">رقم البلاغ المرجعي</p>
                <p className="font-mono text-lg text-foreground font-semibold tracking-wider">
                  {reportId}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  احتفظ بهذا الرقم للمتابعة
                </p>
              </div>
            )}

            {/* الأزرار */}
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link
                href="/"
                className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <Home className="w-5 h-5" />
                العودة للرئيسية
              </Link>

              <Link
                href="/report-theft"
                className="w-full py-3.5 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border border-border"
              >
                <Send className="w-5 h-5" />
                تقديم بلاغ آخر
              </Link>
            </div>

          </div>

          {/* ملاحظة أسفل */}
          <p className="text-center text-muted-foreground/60 text-sm mt-6">
            في حال وجود أي استفسار، يرجى التواصل مع الدعم الفني
          </p>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

/* كومبوننت مساعد لخطوات العملية */
function StepItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-xl transition ${active ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-muted/30 border border-border/50"}`}>
      <span className={active ? "text-emerald-500" : "text-muted-foreground"}>
        {icon}
      </span>
      <span className={`text-xs font-medium ${active ? "text-emerald-500" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  )
}