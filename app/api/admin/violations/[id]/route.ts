import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب مخالفة واحدة
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const violation = await prisma.violation.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            ownerships: {
              include: { owner: true },
            },
          },
        },
      },
    });

    if (!violation) {
      return NextResponse.json(
        { error: 'المخالفة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({ violation });
  } catch (error) {
    console.error('Error fetching violation:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المخالفة' },
      { status: 500 }
    );
  }
}

// PUT - تعديل مخالفة
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, amount, date, location, isPaid } = body;

    const existing = await prisma.violation.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'المخالفة غير موجودة' },
        { status: 404 }
      );
    }

    const violation = await prisma.violation.update({
      where: { id },
      data: {
        type: type || existing.type,
        amount: amount ? parseFloat(amount) : existing.amount,
        date: date ? new Date(date) : existing.date,
        location: location || existing.location,
        isPaid: isPaid !== undefined ? isPaid : existing.isPaid,
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
      { message: 'تم تحديث المخالفة بنجاح', violation }
    );
  } catch (error) {
    console.error('Error updating violation:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث المخالفة' },
      { status: 500 }
    );
  }
}

// DELETE - حذف مخالفة
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.violation.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'المخالفة غير موجودة' },
        { status: 404 }
      );
    }

    await prisma.violation.delete({ where: { id } });

    return NextResponse.json(
      { message: 'تم حذف المخالفة بنجاح' }
    );
  } catch (error) {
    console.error('Error deleting violation:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف المخالفة' },
      { status: 500 }
    );
  }
}