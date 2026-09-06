import { NextResponse, type NextRequest } from "next/server"
import { decrypt } from "@/lib/session"

/**
 * فحص مبدئي (optimistic check) حسب توصية Next.js:
 * منقرأ الجلسة من الكوكي فقط بدون أي استعلام لقاعدة البيانات،
 * لأن الـ proxy بينشغل على كل طلب بما فيها الـ prefetch.
 * الفحص الحقيقي موجود بكل API route عبر requireAdmin().
 */
export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const session = await decrypt(req.cookies.get("session")?.value)
  const isLoggedIn = Boolean(session?.adminId)

  // صفحة اللوجن: لو مسجّل دخول أصلاً، وديه على لوحة التحكم
  if (path === "/admin/login") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl))
    }
    return NextResponse.next()
  }

  // باقي صفحات /admin محمية
  if (path.startsWith("/admin") && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", req.nextUrl)
    loginUrl.searchParams.set("from", path)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
