'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import {
  ArrowRight,
  Wrench,
  Car,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  Edit,
  Trash2,
  Clock,
  Settings,
  CheckCircle
} from 'lucide-react';

interface Maintenance {
  id: string;
  type: string;
  description: string | null;
  date: string;
  cost: number;
  workshop: string;
  createdAt: string;
  vehicle: {
    plateNumber: string;
    brand: string;
    model: string;
    year: number;
    color: string | null;
    ownerships: {
      owner: {
        name: string;
        phone: string;
      };
    }[];
  };
}

export default function MaintenanceDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchMaintenance();
  }, [id]);

  async function fetchMaintenance() {
    try {
      const res = await fetch(`/api/admin/maintenance/${id}`);
      const data = await res.json();
      if (data.maintenance) {
        setMaintenance(data.maintenance);
      } else {
        alert('التصليح غير موجود');
        router.push('/admin/maintenance');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('هل أنت متأكد من حذف هذا التصليح؟')) return;

    try {
      const res = await fetch(`/api/admin/maintenance/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/admin/maintenance');
      } else {
        alert('حدث خطأ أثناء الحذف');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ');
    }
  }

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

  if (!maintenance) return null;

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8" style={{ backgroundColor: '#f0fdf4' }}>
          <div className="max-w-4xl mx-auto">
            {/* رجوع + عنوان + إجراءات */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <ArrowRight className="w-5 h-5" style={{ color: '#64748b' }} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#22c55e' }}>
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                      تفاصيل التصليح
                    </h2>
                    <p className="text-sm" style={{ color: '#64748b' }}>
                      {maintenance.type}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/admin/maintenance/${maintenance.id}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#22c55e' }}
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

            {/* Timeline */}
            <div className="relative">
              {/* الخط الرأسي */}
              <div className="absolute right-6 top-0 bottom-0 w-0.5" style={{ backgroundColor: '#bbf7d0' }} />

              {/* خطوات التايم لاين */}
              <div className="space-y-6">
                {/* خطوة 1: المركبة */}
                <div className="relative flex items-start gap-4">
                  <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4" style={{ backgroundColor: '#fff', borderColor: '#bbf7d0' }}>
                    <Car className="w-5 h-5" style={{ color: '#22c55e' }} />
                  </div>
                  <div className="flex-1 rounded-2xl border p-5" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
                    <h3 className="text-lg font-bold mb-3" style={{ color: '#0f172a' }}>معلومات المركبة</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                        <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>رقم اللوحة</p>
                        <p className="font-medium" style={{ color: '#0f172a' }}>{maintenance.vehicle.plateNumber}</p>
                      </div>
                      <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                        <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>النوع</p>
                        <p className="font-medium" style={{ color: '#0f172a' }}>{maintenance.vehicle.brand} {maintenance.vehicle.model}</p>
                      </div>
                      <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                        <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>السنة</p>
                        <p className="font-medium" style={{ color: '#0f172a' }}>{maintenance.vehicle.year}</p>
                      </div>
                    </div>
                    {maintenance.vehicle.ownerships[0] && (
                      <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                        <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>المالك</p>
                        <p className="font-medium" style={{ color: '#0f172a' }}>
                          {maintenance.vehicle.ownerships[0].owner.name} — {maintenance.vehicle.ownerships[0].owner.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* خطوة 2: التصليح */}
                <div className="relative flex items-start gap-4">
                  <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4" style={{ backgroundColor: '#22c55e', borderColor: '#bbf7d0' }}>
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 rounded-2xl border p-5" style={{ backgroundColor: '#fff', borderColor: '#bbf7d0' }}>
                    <h3 className="text-lg font-bold mb-3" style={{ color: '#0f172a' }}>تفاصيل التصليح</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                        <Wrench className="w-5 h-5" style={{ color: '#22c55e' }} />
                        <div>
                          <p className="text-xs" style={{ color: '#94a3b8' }}>نوع التصليح</p>
                          <p className="font-medium" style={{ color: '#0f172a' }}>{maintenance.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                        <DollarSign className="w-5 h-5" style={{ color: '#22c55e' }} />
                        <div>
                          <p className="text-xs" style={{ color: '#94a3b8' }}>التكلفة</p>
                          <p className="font-bold" style={{ color: '#22c55e' }}>{maintenance.cost.toLocaleString()} ل.س</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                        <Calendar className="w-5 h-5" style={{ color: '#22c55e' }} />
                        <div>
                          <p className="text-xs" style={{ color: '#94a3b8' }}>التاريخ</p>
                          <p className="font-medium" style={{ color: '#0f172a' }}>
                            {new Date(maintenance.date).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                        <MapPin className="w-5 h-5" style={{ color: '#22c55e' }} />
                        <div>
                          <p className="text-xs" style={{ color: '#94a3b8' }}>الورشة</p>
                          <p className="font-medium" style={{ color: '#0f172a' }}>{maintenance.workshop}</p>
                        </div>
                      </div>
                    </div>
                    {maintenance.description && (
                      <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                        <p className="text-xs mb-2 flex items-center gap-2" style={{ color: '#94a3b8' }}>
                          <FileText className="w-4 h-4" />
                          الوصف
                        </p>
                        <p className="text-sm" style={{ color: '#0f172a' }}>{maintenance.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* خطوة 3: الإنشاء */}
                <div className="relative flex items-start gap-4">
                  <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4" style={{ backgroundColor: '#fff', borderColor: '#bbf7d0' }}>
                    <Clock className="w-5 h-5" style={{ color: '#22c55e' }} />
                  </div>
                  <div className="flex-1 rounded-2xl border p-5" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#0f172a' }}>
                          تم تسجيل التصليح في النظام
                        </p>
                        <p className="text-xs" style={{ color: '#94a3b8' }}>
                          {new Date(maintenance.createdAt).toLocaleDateString('ar-SA')} — {new Date(maintenance.createdAt).toLocaleTimeString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}