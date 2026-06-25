import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب كل المركبات
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        ownerships: {
          include: {
            owner: true,
          },
        },
        violations: true,
        maintenances: true,  // ✅ maintenances مش maintenance
        theftReports: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المركبات' },
      { status: 500 }
    );
  }
}

// POST - إنشاء مركبة جديدة
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      plateNumber,
      brand,
      model,
      year,
      color,
      engineType,
      vin,
      insuranceExpiry,
      registrationExpiry,
      status,
      ownerId,
    } = body;

    // التحقق من البيانات
    if (!plateNumber || !brand || !model || !year) {
      return NextResponse.json(
        { error: 'يرجى إدخال جميع البيانات المطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من عدم تكرار رقم اللوحة
    const existing = await prisma.vehicle.findUnique({
      where: { plateNumber },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'رقم اللوحة مستخدم مسبقاً' },
        { status: 409 }
      );
    }

    // إنشاء المركبة
    const vehicle = await prisma.vehicle.create({
      data: {
        plateNumber,
        brand,
        model,
        year: parseInt(year),
        color: color || null,
        engineType: engineType || 'بنزين',
        vin: vin || null,
        status: status || 'ACTIVE',
        insuranceExpiry: insuranceExpiry
          ? new Date(insuranceExpiry)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        registrationExpiry: registrationExpiry
          ? new Date(registrationExpiry)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        // لو في ownerId، نربطه
        ...(ownerId && {
          ownerships: {
            create: {
              ownerId,
              startDate: new Date(),
              isCurrent: true,
            },
          },
        }),
      },
      include: {
        ownerships: {
          include: {
            owner: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'تم إنشاء المركبة بنجاح', vehicle },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المركبة' },
      { status: 500 }
    );
  }
}