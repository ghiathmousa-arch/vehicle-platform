'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import {
  ArrowRight,
  Users,
  User,
  Mail,
  Calendar,
  Shield,
  Edit,
  Trash2,
  Clock
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  async function fetchUser() {
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        alert('المستخدم غير موجود');
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/admin/users');
      } else {
        alert('حدث خطأ أثناء الحذف');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ');
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#22c55e', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen" dir="rtl">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-8 flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
            <p style={{ color: '#94a3b8' }}>جاري التحميل...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const avatarColor = getAvatarColor(user.name);
  const initials = getInitials(user.name);

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8" style={{ backgroundColor: '#f8fafc' }}>
          <div className="max-w-2xl mx-auto">
            {/* رجوع + إجراءات */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <ArrowRight className="w-5 h-5" style={{ color: '#64748b' }} />
                </button>
                <h2 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                  تفاصيل المستخدم
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#8b5cf6' }}
                >
                  <Edit className="w-4 h-4" />
                  تعديل
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  <Trash2 className="w-4 h-4" />
                  حذف
                </button>
              </div>
            </div>

            {/* بطاقة المستخدم */}
            <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              {/* Avatar كبير */}
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg"
                style={{ backgroundColor: avatarColor }}
              >
                {initials}
              </div>

              <h3 className="text-2xl font-bold mb-2" style={{ color: '#0f172a' }}>
                {user.name}
              </h3>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
                <Shield className="w-4 h-4" />
                مسؤول
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Mail className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    <p className="text-xs" style={{ color: '#94a3b8' }}>البريد الإلكتروني</p>
                  </div>
                  <p className="font-medium" style={{ color: '#0f172a' }}>{user.email}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    <p className="text-xs" style={{ color: '#94a3b8' }}>تاريخ الإنشاء</p>
                  </div>
                  <p className="font-medium" style={{ color: '#0f172a' }}>
                    {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}