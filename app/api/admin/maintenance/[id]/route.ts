import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب تصليح واحد
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const maintenance = await prisma.maintenance.findUnique({
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

    if (!maintenance) {
      return NextResponse.json(
        { error: 'التصليح غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({ maintenance });
  } catch (error) {
    console.error('Error fetching maintenance:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب التصليح' },
      { status: 500 }
    );
  }
}

// PUT - تعديل تصليح
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, description, date, cost, workshop } = body;

    const existing = await prisma.maintenance.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'التصليح غير موجود' },
        { status: 404 }
      );
    }

    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: {
        type: type || existing.type,
        description: description !== undefined ? description : existing.description,
        date: date ? new Date(date) : existing.date,
        cost: cost ? parseFloat(cost) : existing.cost,
        workshop: workshop || existing.workshop,
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
      { message: 'تم تحديث التصليح بنجاح', maintenance }
    );
  } catch (error) {
    console.error('Error updating maintenance:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث التصليح' },
      { status: 500 }
    );
  }
}

// DELETE - حذف تصليح
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.maintenance.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'التصليح غير موجود' },
        { status: 404 }
      );
    }

    await prisma.maintenance.delete({ where: { id } });

    return NextResponse.json(
      { message: 'تم حذف التصليح بنجاح' }
    );
  } catch (error) {
    console.error('Error deleting maintenance:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف التصليح' },
      { status: 500 }
    );
  }
}