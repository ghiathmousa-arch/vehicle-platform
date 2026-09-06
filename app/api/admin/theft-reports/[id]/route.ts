import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

// GET - جلب بلاغ واحد
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { response: authError } = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;

    const report = await prisma.theftReport.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            ownerships: {
              include: {
                owner: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: 'البلاغ غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error fetching theft report:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب البلاغ' },
      { status: 500 }
    );
  }
}

// PUT - تحديث حالة البلاغ
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { response: authError } = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // التحقق من الحالة الصحيحة
    const validStatuses = ['PENDING', 'CONFIRMED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'حالة غير صالحة. الحالات المسموحة: PENDING, CONFIRMED, REJECTED' },
        { status: 400 }
      );
    }

    const existing = await prisma.theftReport.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'البلاغ غير موجود' },
        { status: 404 }
      );
    }

    // تحديث البلاغ
    const report = await prisma.theftReport.update({
      where: { id },
      data: { status },
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

    // تحديث حالة المركبة حسب حالة البلاغ
    if (existing.vehicle) {
      if (status === 'CONFIRMED') {
        // تأكيد السرقة → المركبة مسروقة
        await prisma.vehicle.update({
          where: { id: existing.vehicle.id },
          data: { status: 'STOLEN' },
        });
      } else if (status === 'REJECTED') {
        // رفض البلاغ → رجع المركبة لـ ACTIVE
        await prisma.vehicle.update({
          where: { id: existing.vehicle.id },
          data: { status: 'ACTIVE' },
        });
      }
    }

    return NextResponse.json(
      { message: 'تم تحديث البلاغ بنجاح', report }
    );
  } catch (error) {
    console.error('Error updating theft report:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث البلاغ' },
      { status: 500 }
    );
  }
}

// DELETE - حذف بلاغ
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { response: authError } = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;

    const existing = await prisma.theftReport.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'البلاغ غير موجود' },
        { status: 404 }
      );
    }

    // رجع حالة المركبة لـ ACTIVE قبل الحذف
    if (existing.vehicle) {
      await prisma.vehicle.update({
        where: { id: existing.vehicle.id },
        data: { status: 'ACTIVE' },
      });
    }

    await prisma.theftReport.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'تم حذف البلاغ بنجاح' }
    );
  } catch (error) {
    console.error('Error deleting theft report:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف البلاغ' },
      { status: 500 }
    );
  }
}