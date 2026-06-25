import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب الإعدادات (من ملف .env أو قاعدة البيانات)
export async function GET() {
  try {
    // نرجع إعدادات من الـ .env أو قيم افتراضية
    const settings = {
      siteName: process.env.SITE_NAME || 'نظام إدارة المركبات',
      siteDescription: process.env.SITE_DESCRIPTION || 'نظام متكامل لإدارة المركبات والمخالفات والبلاغات',
      maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
      itemsPerPage: parseInt(process.env.ITEMS_PER_PAGE || '10'),
      currency: process.env.CURRENCY || 'ل.س',
      dateFormat: process.env.DATE_FORMAT || 'ar-SA',
      enableNotifications: process.env.ENABLE_NOTIFICATIONS !== 'false',
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإعدادات' },
      { status: 500 }
    );
  }
}

// PUT - حفظ الإعدادات (نحفظها بـ localStorage من Frontend)
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // هون ممكن نحفظ بقاعدة بيانات إذا بدك
    // حالياً نرجع نجاح فقط والـ Frontend يحفظ بـ localStorage

    return NextResponse.json(
      { message: 'تم حفظ الإعدادات بنجاح', settings: body }
    );
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حفظ الإعدادات' },
      { status: 500 }
    );
  }
}