'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { Users, Save, ArrowRight, User, Mail, Lock } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<UserData | null>(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  async function fetchUser() {
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      const data = await res.json();
      if (data.user) {
        setForm(data.user);
      } else {
        alert('المستخدم غير موجود');
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSaving(true);

    try {
      const body: any = {
        name: form.name,
        email: form.email,
      };

      if (password) {
        if (password.length < 6) {
          alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
          setSaving(false);
          return;
        }
        body.password = password;
      }

      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/users');
      } else {
        alert(data.error || 'حدث خطأ');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء التحديث');
    } finally {
      setSaving(false);
    }
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

  if (!form) return null;

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition";
  const labelClass = "block text-sm font-medium mb-2 flex items-center gap-2";

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8" style={{ backgroundColor: '#f8fafc' }}>
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <ArrowRight className="w-5 h-5" style={{ color: '#64748b' }} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#8b5cf6' }}>
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                  تعديل المستخدم
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border shadow-sm p-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <div className="space-y-5">
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <User className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>

                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <Mail className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>

                <div className="p-4 rounded-xl" style={{ backgroundColor: '#f5f3ff' }}>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <Lock className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    كلمة المرور الجديدة (اختياري)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                    placeholder="اتركه فارغاً إذا لا تريد التغيير"
                  />
                  <p className="text-xs mt-2" style={{ color: '#8b5cf6' }}>
                    اترك الحقل فارغاً إذا لا تريد تغيير كلمة المرور
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 rounded-xl text-sm font-medium transition hover:bg-gray-100"
                  style={{ color: '#64748b', border: '1px solid #e2e8f0' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 shadow-lg"
                  style={{ backgroundColor: '#8b5cf6' }}
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}