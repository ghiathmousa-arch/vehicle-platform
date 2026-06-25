'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { ArrowRight, FileText, Car, Calendar, MapPin, DollarSign, CheckCircle, XCircle, Edit } from 'lucide-react';

interface Violation {
  id: string;
  type: string;
  amount: number;
  date: string;
  location: string;
  isPaid: boolean;
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

export default function ViolationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [violation, setViolation] = useState<Violation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchViolation();
  }, [id]);

  async function fetchViolation() {
    try {
      const res = await fetch(`/api/admin/violations/${id}`);
      const data = await res.json();
      if (data.violation) {
        setViolation(data.violation);
      } else {
        alert('المخالفة غير موجودة');
        router.push('/admin/violations');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (isPaid: boolean) => {
    if (isPaid) {
      return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#f0fdf4', color: '#22c55e' }}>مدفوعة</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>غير مدفوعة</span>;
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

  if (!violation) return null;

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8" style={{ backgroundColor: '#f8fafc' }}>
          <div className="max-w-4xl mx-auto">
            {/* رجوع + عنوان */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <ArrowRight className="w-5 h-5" style={{ color: '#64748b' }} />
                </button>
                <h2 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                  تفاصيل المخالفة
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(violation.isPaid)}
                <button
                  onClick={() => router.push(`/admin/violations/${violation.id}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#f59e0b' }}
                >
                  <Edit className="w-4 h-4" />
                  تعديل
                </button>
              </div>
            </div>

            {/* بطاقة المركبة */}
            <div className="rounded-2xl border shadow-sm p-6 mb-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                <Car className="w-5 h-5" style={{ color: '#f59e0b' }} />
                معلومات المركبة
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>رقم اللوحة</p>
                  <p className="font-medium" style={{ color: '#0f172a' }}>{violation.vehicle.plateNumber}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>النوع</p>
                  <p className="font-medium" style={{ color: '#0f172a' }}>{violation.vehicle.brand} {violation.vehicle.model}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>السنة</p>
                  <p className="font-medium" style={{ color: '#0f172a' }}>{violation.vehicle.year}</p>
                </div>
              </div>
              {violation.vehicle.ownerships[0] && (
                <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#fffbeb' }}>
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>المالك</p>
                  <p className="font-medium" style={{ color: '#0f172a' }}>
                    {violation.vehicle.ownerships[0].owner.name} — {violation.vehicle.ownerships[0].owner.phone}
                  </p>
                </div>
              )}
            </div>

            {/* تفاصيل المخالفة */}
            <div className="rounded-2xl border shadow-sm p-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                <FileText className="w-5 h-5" style={{ color: '#f59e0b' }} />
                تفاصيل المخالفة
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <FileText className="w-5 h-5" style={{ color: '#f59e0b' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>نوع المخالفة</p>
                    <p className="font-medium" style={{ color: '#0f172a' }}>{violation.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <DollarSign className="w-5 h-5" style={{ color: '#f59e0b' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>القيمة</p>
                    <p className="font-medium" style={{ color: '#0f172a' }}>{violation.amount.toLocaleString()} ل.س</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <Calendar className="w-5 h-5" style={{ color: '#f59e0b' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>التاريخ</p>
                    <p className="font-medium" style={{ color: '#0f172a' }}>
                      {new Date(violation.date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <MapPin className="w-5 h-5" style={{ color: '#f59e0b' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>الموقع</p>
                    <p className="font-medium" style={{ color: '#0f172a' }}>{violation.location}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: violation.isPaid ? '#f0fdf4' : '#fef2f2' }}>
                <div className="flex items-center gap-2">
                  {violation.isPaid ? (
                    <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                  ) : (
                    <XCircle className="w-5 h-5" style={{ color: '#dc2626' }} />
                  )}
                  <p className="font-medium" style={{ color: '#0f172a' }}>
                    {violation.isPaid ? 'تم دفع المخالفة' : 'المخالفة غير مدفوعة'}
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