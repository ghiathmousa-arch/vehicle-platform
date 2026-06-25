// components/ui/Footer.tsx
import Link from "next/link"
import { Shield } from "lucide-react"

// مصفوفة الروابط السريعة لتسهيل التعديل والصيانة
const footerLinks = [
  { href: "/", label: "الصفحة الرئيسية" },
  { href: "/search", label: "البحث عن مركبة" },
  { href: "/report", label: "الإبلاغ عن سرقة" },
  { href: "/admin/login", label: "تسجيل دخول المشرف" },
]

export default function Footer() {
  return (
    <footer className="w-full bg-card border-t border-border py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-right">

        {/* العمود 1: الشعار والوصف */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-foreground">
              منصة إدارة بيانات المركبات
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            المنصة الحكومية لإدارة بيانات المركبات والتحقق من السجلات
          </p>
        </div>

        {/* العمود 2: روابط سريعة (باستخدام الماب) */}
        <div>
          <h3 className="text-foreground font-semibold mb-4 text-base">
            روابط سريعة
          </h3>
          <ul className="space-y-2.5">
            {footerLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-150 text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* العمود 3: معلومات الحقوق */}
        <div className="border-t border-border pt-6 md:border-none md:pt-0">
          <h3 className="text-foreground font-semibold mb-4 text-base">
            معلومات
          </h3>
          <p className="text-muted-foreground text-sm">
            منصة إدارة بيانات المركبات © {new Date().getFullYear()}
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            جميع الحقوق محفوظة
          </p>
        </div>

      </div>
    </footer>
  )
}