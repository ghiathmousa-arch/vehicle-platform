import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب كل التصليحات
export async function GET() {
  try {
    const maintenances = await prisma.maintenance.findMany({
      include: {
        vehicle: {
          select: {
            plateNumber: true,
            brand: true,
            model: true,
            color: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({ maintenances });
  } catch (error) {
    console.error('Error fetching maintenances:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب التصليحات' },
      { status: 500 }
    );
  }
}

// POST - إنشاء تصليح جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      plateNumber,
      type,
      description,
      date,
      cost,
      workshop,
    } = body;

    if (!plateNumber || !type || !date || !cost || !workshop) {
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

    const maintenance = await prisma.maintenance.create({
      data: {
        vehicleId: vehicle.id,
        type,
        description: description || null,
        date: new Date(date),
        cost: parseFloat(cost),
        workshop,
      },
      include: {
        vehicle: {
          select: {
            plateNumber: true,
            brand: true,
            model: true,
            color: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'تم إنشاء التصليح بنجاح', maintenance },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating maintenance:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء التصليح' },
      { status: 500 }
    );
  }
}