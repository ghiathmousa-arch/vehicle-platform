import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [vehiclesCount, usersCount, pendingReports, totalViolations] = await Promise.all([
      prisma.vehicle.count(),
      prisma.owner.count(),
      prisma.theftReport.count({ where: { status: 'PENDING' } }),
      prisma.violation.count(),
    ]);

    return NextResponse.json({
      vehicles: vehiclesCount,
      users: usersCount,
      pendingReports: pendingReports,
      violations: totalViolations,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    );
  }
}