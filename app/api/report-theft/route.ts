import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plateNumber, reporterName, reporterPhone, stealDate, location, details } = body;

    // 1. التحقق من وجود المركبة
    const vehicle = await prisma.vehicle.findUnique({
      where: { plateNumber },
    });

    // 2. إذا ما لقاها → يرجع خطأ + اقتراح التسجيل
    if (!vehicle) {
      return NextResponse.json(
        {
          error: "المركبة غير مسجلة في النظام",
          message: "يرجى تسجيل المركبة أولاً قبل تقديم البلاغ",
          action: "REGISTER_VEHICLE", // ← للـ Frontend يعرف شو يعرض
        },
        { status: 404 }
      );
    }

    // 3. إذا لقاها → ينشئ البلاغ
    const report = await prisma.theftReport.create({
      data: {
        vehicleId: vehicle.id,
        reporterName,
        reporterPhone,
        stealDate: new Date(stealDate),
        location,
        details: details || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        message: "تم إرسال البلاغ بنجاح",
        reportId: report.id,
        status: "PENDING",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إرسال البلاغ" },
      { status: 500 }
    );
  }
}