import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // حذف كل البيانات القديمة
  await prisma.vehicleOwnership.deleteMany()
  await prisma.violation.deleteMany()
  await prisma.maintenance.deleteMany()
  await prisma.theftReport.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.owner.deleteMany()

  // ✅ تشفير كلمة السر
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123'
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@vehicles.gov.sa'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  // الأدمن
  const admin = await prisma.admin.create({
    data: {
      name: 'مدير النظام',
      email: adminEmail,
      password: hashedPassword,
    },
  })

  // ───────────────────────────────────────────────
  // 🇸🇾 بيانات سورية - المالكين
  // ───────────────────────────────────────────────
  const owner1 = await prisma.owner.create({
    data: {
      name: 'أحمد الحسن',
      phone: '0933123456',
      nationalId: '12345678901',
      address: 'دمشق، المزة',
    },
  })

  const owner2 = await prisma.owner.create({
    data: {
      name: 'محمد خالد',
      phone: '0955123456',
      nationalId: '98765432109',
      address: 'حلب، الأعظمية',
    },
  })

  const owner3 = await prisma.owner.create({
    data: {
      name: 'خالد العمر',
      phone: '0999123456',
      nationalId: '45678912304',
      address: 'حمص، بابا عمرو',
    },
  })

  const owner4 = await prisma.owner.create({
    data: {
      name: 'عمر السيد',
      phone: '0966123456',
      nationalId: '78912345607',
      address: 'اللاذقية، الصليبة',
    },
  })

  // ───────────────────────────────────────────────
  // 🇸🇾 المركبات - لوحات سورية
  // ───────────────────────────────────────────────
  // تنسيق اللوحة السورية: حرفين + 5 أرقام (مثال: د س 12345)

  const vehicle1 = await prisma.vehicle.create({
    data: {
      plateNumber: 'د س 12345', // دمشق
      brand: 'تويوتا',
      model: 'كامري',
      year: 2023,
      color: 'أبيض',
      engineType: 'بنزين',
      vin: 'JTDBU4EE3B9123456',
      insuranceExpiry: new Date('2025-12-31'),
      registrationExpiry: new Date('2025-06-15'),
      status: 'ACTIVE',
    },
  })

  const vehicle2 = await prisma.vehicle.create({
    data: {
      plateNumber: 'ح ل 56789', // حلب
      brand: 'هيونداي',
      model: 'سوناتا',
      year: 2022,
      color: 'أسود',
      engineType: 'بنزين',
      vin: 'KMHEC41DDBA123456',
      insuranceExpiry: new Date('2025-08-20'),
      registrationExpiry: new Date('2025-03-10'),
      status: 'ACTIVE',
    },
  })

  const vehicle3 = await prisma.vehicle.create({
    data: {
      plateNumber: 'ح م 45678', // حمص
      brand: 'كيا',
      model: 'سبورتاج',
      year: 2021,
      color: 'رمادي',
      engineType: 'بنزين',
      vin: 'KNDJPB3H3F7123456',
      insuranceExpiry: new Date('2025-10-15'),
      registrationExpiry: new Date('2025-04-20'),
      status: 'ACTIVE',
    },
  })

  const vehicle4 = await prisma.vehicle.create({
    data: {
      plateNumber: 'ل ا 98765', // اللاذقية
      brand: 'نيسان',
      model: 'سنترا',
      year: 2020,
      color: 'أحمر',
      engineType: 'بنزين',
      vin: '3N1AB7AP7KY123456',
      insuranceExpiry: new Date('2025-07-30'),
      registrationExpiry: new Date('2025-02-28'),
      status: 'STOLEN', // ← مسروقة!
    },
  })

  const vehicle5 = await prisma.vehicle.create({
    data: {
      plateNumber: 'ر د 11111', // ريف دمشق
      brand: 'شيفروليه',
      model: 'ماليبو',
      year: 2019,
      color: 'أزرق',
      engineType: 'بنزين',
      vin: '1G1ZE5ST9GF123456',
      insuranceExpiry: new Date('2024-12-01'), // ← منتهي!
      registrationExpiry: new Date('2024-11-15'), // ← منتهي!
      status: 'EXPIRED',
    },
  })

  const vehicle6 = await prisma.vehicle.create({
    data: {
      plateNumber: 'د س 54321', // دمشق تانية
      brand: 'مرسيدس',
      model: 'E200',
      year: 2024,
      color: 'فضي',
      engineType: 'بنزين',
      vin: 'WDDZF4JB8JA123456',
      insuranceExpiry: new Date('2026-01-15'),
      registrationExpiry: new Date('2025-08-30'),
      status: 'ACTIVE',
    },
  })

  // ───────────────────────────────────────────────
  // علاقات الملكية
  // ───────────────────────────────────────────────
  await prisma.vehicleOwnership.create({
    data: {
      vehicleId: vehicle1.id,
      ownerId: owner1.id,
      startDate: new Date('2023-01-01'),
      isCurrent: true,
    },
  })

  await prisma.vehicleOwnership.create({
    data: {
      vehicleId: vehicle2.id,
      ownerId: owner2.id,
      startDate: new Date('2022-06-01'),
      isCurrent: true,
    },
  })

  await prisma.vehicleOwnership.create({
    data: {
      vehicleId: vehicle3.id,
      ownerId: owner3.id,
      startDate: new Date('2021-03-15'),
      isCurrent: true,
    },
  })

  await prisma.vehicleOwnership.create({
    data: {
      vehicleId: vehicle4.id,
      ownerId: owner4.id,
      startDate: new Date('2020-09-01'),
      isCurrent: true,
    },
  })

  await prisma.vehicleOwnership.create({
    data: {
      vehicleId: vehicle5.id,
      ownerId: owner1.id,
      startDate: new Date('2019-05-20'),
      isCurrent: true,
    },
  })

  await prisma.vehicleOwnership.create({
    data: {
      vehicleId: vehicle6.id,
      ownerId: owner2.id,
      startDate: new Date('2024-02-01'),
      isCurrent: true,
    },
  })

  // ───────────────────────────────────────────────
  // المخالفات
  // ───────────────────────────────────────────────
  await prisma.violation.create({
    data: {
      vehicleId: vehicle1.id,
      type: 'سرعة زائدة',
      amount: 5000,
      date: new Date('2024-05-15'),
      location: 'طريق المطار، دمشق',
      isPaid: true,
    },
  })

  await prisma.violation.create({
    data: {
      vehicleId: vehicle2.id,
      type: 'موقف ممنوع',
      amount: 2000,
      date: new Date('2024-08-22'),
      location: 'ساحة سعدالله الجابري، حلب',
      isPaid: false,
    },
  })

  await prisma.violation.create({
    data: {
      vehicleId: vehicle3.id,
      type: 'عبور إشارة حمراء',
      amount: 10000,
      date: new Date('2024-03-10'),
      location: 'دوار الكرامة، حمص',
      isPaid: false,
    },
  })

  await prisma.violation.create({
    data: {
      vehicleId: vehicle6.id,
      type: 'عدم ارتداء حزام الأمان',
      amount: 1500,
      date: new Date('2024-11-05'),
      location: 'طريق حمص - دمشق',
      isPaid: true,
    },
  })

  // ───────────────────────────────────────────────
  // الصيانات
  // ───────────────────────────────────────────────
  await prisma.maintenance.create({
    data: {
      vehicleId: vehicle1.id,
      type: 'تغيير زيت',
      description: 'تغيير زيت المحرك وفلتر الهواء',
      date: new Date('2024-01-15'),
      cost: 25000,
      workshop: 'ورشة تويوتا - دمشق',
    },
  })

  await prisma.maintenance.create({
    data: {
      vehicleId: vehicle2.id,
      type: 'صيانة دورية',
      description: 'فحص شامل + تغيير فلاتر',
      date: new Date('2024-03-20'),
      cost: 45000,
      workshop: 'ورشة هيونداي - حلب',
    },
  })

  await prisma.maintenance.create({
    data: {
      vehicleId: vehicle3.id,
      type: 'تغيير إطارات',
      description: 'تغيير 4 إطارات جديدة',
      date: new Date('2024-09-10'),
      cost: 120000,
      workshop: 'ورشة الإطارات المتحدة - حمص',
    },
  })

  await prisma.maintenance.create({
    data: {
      vehicleId: vehicle6.id,
      type: 'تصليح فرامل',
      description: 'تغيير ديسكات ولبادات فرامل',
      date: new Date('2024-10-25'),
      cost: 85000,
      workshop: 'ورشة مرسيدس - دمشق',
    },
  })

  // ───────────────────────────────────────────────
  // بلاغات السرقة
  // ───────────────────────────────────────────────
  await prisma.theftReport.create({
    data: {
      vehicleId: vehicle4.id,
      reporterName: 'عمر السيد',
      reporterPhone: '0966123456',
      stealDate: new Date('2024-11-01'),
      location: 'الصليبة، اللاذقية',
      details: 'المركبة سرقت من أمام المنزل ليلاً',
      status: 'PENDING',
    },
  })

  await prisma.theftReport.create({
    data: {
      vehicleId: vehicle2.id,
      reporterName: 'محمد خالد',
      reporterPhone: '0955123456',
      stealDate: new Date('2024-12-10'),
      location: 'الأعظمية، حلب',
      details: 'سرقة من الشارع العام',
      status: 'CONFIRMED',
    },
  })

  console.log('✅ Seed done! بيانات سورية جاهزة')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })