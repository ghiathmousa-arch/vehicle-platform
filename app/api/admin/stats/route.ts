import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const { response: authError } = await requireAdmin();
    if (authError) return authError;

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