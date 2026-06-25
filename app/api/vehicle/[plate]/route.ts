import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ plate: string }> } // تحديث النوع ليصبح Promise
) {
  try {
    // 1. فك وعمل await للـ params لأنها Promise في النسخ الحديثة
    const { plate } = await params

    if (!plate) {
      return NextResponse.json(
        { error: "لم يتم توفير رقم لوحة للبحث" },
        { status: 400 }
      )
    }

    // 2. فك تشفير النص بالكامل والتخلص من المسافات الزائدة
    const decodedPlate = decodeURIComponent(plate).trim()

    // 3. تنظيف المدخلات: استخراج الأرقام فقط واستخراج الحروف فقط
    const numbersOnly = decodedPlate.replace(/[^0-9]/g, "")
    const lettersOnly = decodedPlate.replace(/[0-9]/g, "").replace(/\s+/g, "").trim()

    // 4. الاستعلام الذكي من قاعدة البيانات بمرونة تامة
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [
          {
            // حالة المطابقة التامة
            plateNumber: decodedPlate
          },
          {
            // حالة المطابقة المرنة (أرقام وحروف بأي ترتيب)
            AND: [
              { plateNumber: { contains: numbersOnly } },
              { plateNumber: { contains: lettersOnly } }
            ]
          }
        ]
      },
      include: {
        ownerships: {
          include: { owner: true },
          orderBy: { startDate: "desc" },
        },
        maintenances: { orderBy: { date: "desc" } },
        violations: { orderBy: { date: "desc" } },
        theftReports: { orderBy: { createdAt: "desc" } },
      },
    })

    // 5. إذا لم يتم العثور على أي نتيجة مطابقة بعد الفحص المرن
    if (!vehicle) {
      return NextResponse.json(
        { error: "المركبة غير موجودة" },
        { status: 404 }
      )
    }

    // 6. إرجاع بيانات المركبة بنجاح
    return NextResponse.json(vehicle)

  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json(
      { error: "حدث خطأ داخلي أثناء معالجة الطلب" },
      { status: 500 }
    )
  }
}