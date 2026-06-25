'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { Users, Save, ArrowRight, User, Mail, Lock } from 'lucide-react';

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('كلمة المرور غير متطابقة');
      return;
    }

    if (form.password.length < 6) {
      alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/users');
      } else {
        alert(data.error || 'حدث خطأ');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء الإنشاء');
    } finally {
      setLoading(false);
    }
  };

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
                  مستخدم جديد
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
                    placeholder="مثال: أحمد محمد"
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
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <Lock className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    كلمة المرور *
                  </label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                    placeholder="6 أحرف على الأقل"
                  />
                </div>

                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <Lock className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    تأكيد كلمة المرور *
                  </label>
                  <input
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                    placeholder="أعد إدخال كلمة المرور"
                  />
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
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 shadow-lg"
                  style={{ backgroundColor: '#8b5cf6' }}
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'جاري الحفظ...' : 'إنشاء المستخدم'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}