import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

// القيم الافتراضية — تُستخدم لأي مفتاح غير محفوظ بعد
const DEFAULTS = {
  siteName: 'نظام إدارة المركبات',
  siteDescription: 'نظام متكامل لإدارة المركبات والمخالفات والبلاغات',
  itemsPerPage: 10,
  currency: 'ل.س',
  dateFormat: 'ar-SA',
  enableNotifications: true,
  darkMode: false,
  language: 'ar',
};

type Settings = typeof DEFAULTS;

// القيم تُخزَّن كنصوص، فنعيدها لأنواعها حسب الافتراضي
function parseValue(key: keyof Settings, raw: string): Settings[keyof Settings] {
  const fallback = DEFAULTS[key];
  if (typeof fallback === 'number') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  }
  if (typeof fallback === 'boolean') return raw === 'true';
  return raw;
}

export async function GET() {
  try {
    const rows = await prisma.setting.findMany();
    const settings: Record<string, unknown> = { ...DEFAULTS };

    for (const row of rows) {
      if (row.key in DEFAULTS) {
        settings[row.key] = parseValue(row.key as keyof Settings, row.value);
      }
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    // لا نُسقط الصفحة إن تعذّر الوصول — نُعيد الافتراضي
    return NextResponse.json({ settings: DEFAULTS });
  }
}

export async function PUT(request: Request) {
  try {
    const { response: authError } = await requireAdmin();
    if (authError) return authError;

    const body = await request.json();

    // نقبل المفاتيح المعروفة فقط
    const entries = Object.keys(DEFAULTS)
      .filter((key) => key in body)
      .map((key) => ({ key, value: String(body[key]) }));

    if (!entries.length) {
      return NextResponse.json(
        { error: 'لم تُرسل أي إعدادات صالحة' },
        { status: 400 }
      );
    }

    await prisma.$transaction(
      entries.map(({ key, value }) =>
        prisma.setting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        })
      )
    );

    const rows = await prisma.setting.findMany();
    const settings: Record<string, unknown> = { ...DEFAULTS };
    for (const row of rows) {
      if (row.key in DEFAULTS) {
        settings[row.key] = parseValue(row.key as keyof Settings, row.value);
      }
    }

    return NextResponse.json({ message: 'تم حفظ الإعدادات بنجاح', settings });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حفظ الإعدادات' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { response: authError } = await requireAdmin();
    if (authError) return authError;

    await prisma.setting.deleteMany();
    return NextResponse.json({ message: 'تمت إعادة التعيين', settings: DEFAULTS });
  } catch (error) {
    console.error('Error resetting settings:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إعادة التعيين' },
      { status: 500 }
    );
  }
}
