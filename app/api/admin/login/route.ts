import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSession } from "@/lib/session"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // 1. التحقق من وجود البيانات
    if (!email || !password) {
      return NextResponse.json(
        { error: "يرجى إدخال البريد الإلكتروني وكلمة المرور" },
        { status: 400 }
      )
    }

    // 2. البحث عن الأدمن
    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      )
    }

    // 3. مقارنة كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, admin.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      )
    }

    // 4. إنشاء جلسة موقّعة ومخزّنة بكوكي httpOnly
    await createSession({
      adminId: admin.id,
      name: admin.name,
      email: admin.email,
    })

    return NextResponse.json(
      {
        message: "تم تسجيل الدخول بنجاح",
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    )
  }
}
