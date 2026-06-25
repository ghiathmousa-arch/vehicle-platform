import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET - جلب مستخدم واحد
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المستخدم' },
      { status: 500 }
    );
  }
}

// PUT - تعديل مستخدم
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, password } = body;

    const existing = await prisma.admin.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من البريد إذا تغير
    if (email && email !== existing.email) {
      const duplicate = await prisma.admin.findUnique({
        where: { email },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: 'البريد الإلكتروني مستخدم مسبقاً' },
          { status: 409 }
        );
      }
    }

    const updateData: any = {
      name: name || existing.name,
      email: email || existing.email,
    };

    // تشفير كلمة المرور الجديدة إذا موجودة
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: 'تم تحديث المستخدم بنجاح', user }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث المستخدم' },
      { status: 500 }
    );
  }
}

// DELETE - حذف مستخدم
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.admin.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    await prisma.admin.delete({ where: { id } });

    return NextResponse.json(
      { message: 'تم حذف المستخدم بنجاح' }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف المستخدم' },
      { status: 500 }
    );
  }
}