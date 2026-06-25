import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب مركبة واحدة
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // ← Promise
) {
  try {
    const { id } = await params;  // ← await هون

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        ownerships: {
          include: {
            owner: true,
          },
        },
        violations: true,
        maintenances: true,
        theftReports: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: 'المركبة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المركبة' },
      { status: 500 }
    );
  }
}

// PUT - تعديل مركبة
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // ← Promise
) {
  try {
    const { id } = await params;  // ← await هون
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
    } = body;

    const existing = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'المركبة غير موجودة' },
        { status: 404 }
      );
    }

    if (plateNumber && plateNumber !== existing.plateNumber) {
      const duplicate = await prisma.vehicle.findUnique({
        where: { plateNumber },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: 'رقم اللوحة موجود مسبقاً' },
          { status: 409 }
        );
      }
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        plateNumber,
        brand,
        model,
        year: year ? parseInt(year) : undefined,
        color,
        engineType,
        vin,
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : undefined,
        registrationExpiry: registrationExpiry ? new Date(registrationExpiry) : undefined,
        status,
      },
    });

    return NextResponse.json(
      { message: 'تم تعديل المركبة بنجاح', vehicle }
    );
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تعديل المركبة' },
      { status: 500 }
    );
  }
}
// DELETE - حذف مركبة
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'المركبة غير موجودة' },
        { status: 404 }
      );
    }

    // ✅ حذف العلاقات أولاً (بترتيب)

    // 1. حذف VehicleOwnership
    await prisma.vehicleOwnership.deleteMany({
      where: { vehicleId: id },
    });

    // 2. حذف Violations
    await prisma.violation.deleteMany({
      where: { vehicleId: id },
    });

    // 3. حذف Maintenance
    await prisma.maintenance.deleteMany({
      where: { vehicleId: id },
    });

    // 4. حذف TheftReports
    await prisma.theftReport.deleteMany({
      where: { vehicleId: id },
    });

    // ✅ هلأ نحذف المركبة
    await prisma.vehicle.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'تم حذف المركبة بنجاح' }
    );
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف المركبة' },
      { status: 500 }
    );
  }
}