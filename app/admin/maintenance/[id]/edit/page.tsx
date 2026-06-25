'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { Wrench, Save, ArrowRight, Car, Calendar, DollarSign, MapPin, FileText } from 'lucide-react';

interface Maintenance {
  id: string;
  type: string;
  description: string | null;
  date: string;
  cost: number;
  workshop: string;
  vehicle: {
    plateNumber: string;
  };
}

export default function EditMaintenancePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Maintenance | null>(null);

  useEffect(() => {
    if (id) fetchMaintenance();
  }, [id]);

  async function fetchMaintenance() {
    try {
      const res = await fetch(`/api/admin/maintenance/${id}`);
      const data = await res.json();
      if (data.maintenance) {
        setForm(data.maintenance);
      } else {
        alert('التصليح غير موجود');
        router.push('/admin/maintenance');
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
      const res = await fetch(`/api/admin/maintenance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          description: form.description,
          date: form.date,
          cost: form.cost,
          workshop: form.workshop,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/maintenance');
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
          <main className="flex-1 p-8 flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
            <p style={{ color: '#94a3b8' }}>جاري التحميل...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!form) return null;

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition";
  const labelClass = "block text-sm font-medium mb-2 flex items-center gap-2";

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8" style={{ backgroundColor: '#f0fdf4' }}>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <ArrowRight className="w-5 h-5" style={{ color: '#64748b' }} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#22c55e' }}>
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                  تعديل التصليح
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border shadow-sm p-6" style={{ backgroundColor: '#fff', borderColor: '#bbf7d0' }}>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <Car className="w-4 h-4" style={{ color: '#22c55e' }} />
                    رقم اللوحة
                  </label>
                  <input
                    type="text"
                    disabled
                    value={form.vehicle.plateNumber}
                    className={inputClass + ' bg-gray-50'}
                    style={{ borderColor: '#bbf7d0' }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <Wrench className="w-4 h-4" style={{ color: '#22c55e' }} />
                    نوع التصليح *
                  </label>
                  <select
                    required
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#bbf7d0' }}
                  >
                    <option value="صيانة دورية">صيانة دورية</option>
                    <option value="تغيير زيت">تغيير زيت</option>
                    <option value="تصليح محرك">تصليح محرك</option>
                    <option value="تصليح فرامل">تصليح فرامل</option>
                    <option value="تصليح كهرباء">تصليح كهرباء</option>
                    <option value="تغيير إطارات">تغيير إطارات</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <Calendar className="w-4 h-4" style={{ color: '#22c55e' }} />
                    التاريخ *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date ? new Date(form.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#bbf7d0' }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <DollarSign className="w-4 h-4" style={{ color: '#22c55e' }} />
                    التكلفة (ل.س) *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) })}
                    className={inputClass}
                    style={{ borderColor: '#bbf7d0' }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <MapPin className="w-4 h-4" style={{ color: '#22c55e' }} />
                    الورشة *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.workshop}
                    onChange={(e) => setForm({ ...form, workshop: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#bbf7d0' }}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass} style={{ color: '#374151' }}>
                    <FileText className="w-4 h-4" style={{ color: '#22c55e' }} />
                    التفاصيل
                  </label>
                  <textarea
                    rows={4}
                    value={form.description || ''}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#bbf7d0' }}
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
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 shadow-lg"
                  style={{ backgroundColor: '#22c55e' }}
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