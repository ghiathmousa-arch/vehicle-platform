import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

// نسبة التغيّر بين فترتين — null يعني لا توجد بيانات كافية للمقارنة
function trend(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export async function GET() {
  try {
    const { response: authError } = await requireAdmin();
    if (authError) return authError;

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfNextYear = new Date(now.getFullYear() + 1, 0, 1);

    const [
      vehiclesCount,
      usersCount,
      pendingReports,
      totalViolations,
      violationsThisYear,
      vehiclesThisMonth,
      vehiclesLastMonth,
      violationsThisMonth,
      violationsLastMonth,
      ownersThisMonth,
      ownersLastMonth,
      reportsThisMonth,
      reportsLastMonth,
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.owner.count(),
      prisma.theftReport.count({ where: { status: 'PENDING' } }),
      prisma.violation.count(),
      prisma.violation.findMany({
        where: { date: { gte: startOfYear, lt: startOfNextYear } },
        select: { date: true },
      }),
      prisma.vehicle.count({ where: { createdAt: { gte: startOfThisMonth } } }),
      prisma.vehicle.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } }),
      prisma.violation.count({ where: { date: { gte: startOfThisMonth } } }),
      prisma.violation.count({ where: { date: { gte: startOfLastMonth, lt: startOfThisMonth } } }),
      prisma.owner.count({ where: { createdAt: { gte: startOfThisMonth } } }),
      prisma.owner.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } }),
      prisma.theftReport.count({ where: { createdAt: { gte: startOfThisMonth } } }),
      prisma.theftReport.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } }),
    ]);

    // توزيع المخالفات على أشهر السنة الحالية
    const monthlyCounts = new Array(12).fill(0);
    for (const v of violationsThisYear) {
      monthlyCounts[new Date(v.date).getMonth()]++;
    }
    const monthly = MONTHS.map((month, i) => ({ month, value: monthlyCounts[i] }));

    return NextResponse.json({
      vehicles: vehiclesCount,
      users: usersCount,
      pendingReports,
      violations: totalViolations,
      year: now.getFullYear(),
      monthly,
      trends: {
        vehicles: trend(vehiclesThisMonth, vehiclesLastMonth),
        users: trend(ownersThisMonth, ownersLastMonth),
        violations: trend(violationsThisMonth, violationsLastMonth),
        pendingReports: trend(reportsThisMonth, reportsLastMonth),
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    );
  }
}
