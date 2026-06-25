'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { Save, ArrowRight } from 'lucide-react';

interface Vehicle {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string | null;
  engineType: string;
  vin: string | null;
  status: string;
}

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (id) fetchVehicle();
  }, [id]);

  async function fetchVehicle() {
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`);
      const data = await res.json();
      if (data.vehicle) {
        setForm(data.vehicle);
      } else {
        alert('المركبة غير موجودة');
        router.push('/admin/vehicles');
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
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/vehicles');
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

  const inputClass = "w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition";
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
                تعديل المركبة
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border shadow-sm p-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>رقم اللوحة</label>
                  <input
                    type="text"
                    required
                    value={form.plateNumber}
                    onChange={(e) => setForm({ ...form, plateNumber: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>الحالة</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  >
                    <option value="ACTIVE">ساري</option>
                    <option value="STOLEN">مسروقة</option>
                    <option value="EXPIRED">منتهية</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>النوع</label>
                  <input
                    type="text"
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>الموديل</label>
                  <input
                    type="text"
                    required
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>السنة</label>
                  <input
                    type="number"
                    required
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>اللون</label>
                  <input
                    type="text"
                    value={form.color || ''}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>نوع المحرك</label>
                  <select
                    value={form.engineType}
                    onChange={(e) => setForm({ ...form, engineType: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
                  >
                    <option value="بنزين">بنزين</option>
                    <option value="ديزل">ديزل</option>
                    <option value="كهربائي">كهربائي</option>
                    <option value="هجين">هجين</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>رقم الشاسيه (VIN)</label>
                  <input
                    type="text"
                    value={form.vin || ''}
                    onChange={(e) => setForm({ ...form, vin: e.target.value })}
                    className={inputClass}
                    style={{ borderColor: '#e2e8f0' }}
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
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#06b6d4' }}
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