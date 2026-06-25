import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب كل المخالفات
export async function GET() {
  try {
    const violations = await prisma.violation.findMany({
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

    return NextResponse.json({ violations });
  } catch (error) {
    console.error('Error fetching violations:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المخالفات' },
      { status: 500 }
    );
  }
}

// POST - إنشاء مخالفة جديدة
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      plateNumber,
      type,
      amount,
      date,
      location,
      isPaid,
    } = body;

    if (!plateNumber || !type || !amount || !date || !location) {
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

    const violation = await prisma.violation.create({
      data: {
        vehicleId: vehicle.id,
        type,
        amount: parseFloat(amount),
        date: new Date(date),
        location,
        isPaid: isPaid || false,
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

    return NextResponse.json(
      { message: 'تم إنشاء المخالفة بنجاح', violation },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating violation:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المخالفة' },
      { status: 500 }
    );
  }
}