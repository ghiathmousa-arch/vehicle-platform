import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب كل البلاغات
export async function GET() {
  try {
    const reports = await prisma.theftReport.findMany({
      include: {
        vehicle: {
          select: {
            plateNumber: true,
            brand: true,
            model: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching theft reports:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب البلاغات' },
      { status: 500 }
    );
  }
}

// POST - إنشاء بلاغ جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      plateNumber,
      reporterName,
      reporterPhone,
      // ❌ شلنا reporterIdNumber
      stealDate,
      location,
      details,
    } = body;

    if (!plateNumber || !reporterName || !reporterPhone || !stealDate) {
      return NextResponse.json(
        { error: 'يرجى إدخال جميع البيانات المطلوبة' },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { plateNumber },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: 'المركبة غير موجودة في النظام' },
        { status: 404 }
      );
    }

    const report = await prisma.theftReport.create({
      data: {
        vehicleId: vehicle.id,
        reporterName,
        reporterPhone,
        // ❌ شلنا reporterIdNumber
        stealDate: new Date(stealDate),
        location: location || null,
        details: details || null,
        status: 'PENDING',
      },
      include: {
        vehicle: {
          select: {
            plateNumber: true,
            brand: true,
            model: true,
          },
        },
      },
    });

    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { status: 'STOLEN' },
    });

    return NextResponse.json(
      { message: 'تم إرسال البلاغ بنجاح', report },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating theft report:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء البلاغ' },
      { status: 500 }
    );
  }
}