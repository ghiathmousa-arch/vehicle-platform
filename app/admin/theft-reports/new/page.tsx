'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { AlertTriangle, Save, ArrowRight } from 'lucide-react';

export default function NewTheftReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    plateNumber: '',
    reporterName: '',
    reporterPhone: '',
    stealDate: '',
    location: '',
    details: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/theft-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/theft-reports');
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

  const inputClass = "w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition";
  const labelClass = "block text-sm font-medium mb-2";

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8" style={{ backgroundColor: '#f8fafc' }}>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <ArrowRight className="w-5 h-5" style={{ color: '#64748b' }} />
              </button>
              <h2 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                بلاغ سرقة جديد
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border shadow-sm p-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>رقم اللوحة *</label>
                  <input
                    type="text"
                    required
                    value={form.plateNumber}
                    onChange={(e) => setForm({ ...form, plateNumber: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                    placeholder="مثال: 54321 د س"
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>تاريخ السرقة *</label>
                  <input
                    type="date"
                    required
                    value={form.stealDate}
                    onChange={(e) => setForm({ ...form, stealDate: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>اسم المُبلّغ *</label>
                  <input
                    type="text"
                    required
                    value={form.reporterName}
                    onChange={(e) => setForm({ ...form, reporterName: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                    placeholder="الاسم الكامل"
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={form.reporterPhone}
                    onChange={(e) => setForm({ ...form, reporterPhone: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                    placeholder="09xxxxxxxx"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass} style={{ color: '#374151' }}>موقع السرقة</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                    placeholder="مثال: دمشق، المزة"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass} style={{ color: '#374151' }}>تفاصيل إضافية</label>
                  <textarea
                    rows={4}
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                    placeholder="وصف تفصيلي للسرقة..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium transition hover:bg-gray-100"
                  style={{ color: '#64748b', border: '1px solid #e2e8f0' }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'جاري الإرسال...' : 'إرسال البلاغ'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}