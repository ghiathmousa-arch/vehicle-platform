import "server-only"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

/**
 * طبقة الوصول للبيانات (DAL).
 * كل route محمي لازم ينادي requireAdmin() قبل أي عملية على قاعدة البيانات.
 * الـ proxy بيعمل فحص مبدئي فقط — هالفحص هو الحقيقي.
 */
export async function requireAdmin() {
  const session = await getSession()

  if (!session?.adminId) {
    return {
      session: null,
      response: NextResponse.json(
        { error: "غير مصرّح لك بالوصول" },
        { status: 401 }
      ),
    }
  }

  return { session, response: null }
}
