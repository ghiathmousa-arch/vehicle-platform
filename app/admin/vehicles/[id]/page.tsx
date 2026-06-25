'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { ArrowRight, Car, Calendar, User, AlertTriangle, Wrench, FileText } from 'lucide-react';

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
  insuranceExpiry: string;
  registrationExpiry: string;
  createdAt: string;
  ownerships: {
    owner: {
      name: string;
      phone: string;
      idNumber: string;
    };
  }[];
  violations: any[];
  maintenances: any[];
  theftReports: any[];
}

export default function VehicleDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchVehicle();
  }, [id]);

  async function fetchVehicle() {
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`);
      const data = await res.json();
      if (data.vehicle) {
        setVehicle(data.vehicle);
      } else {
        alert('المركبة غير موجودة');
        router.push('/admin/vehicles');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#ecfeff', color: '#0891b2' }}>ساري</span>;
      case 'STOLEN':
        return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>مسروقة</span>;
      case 'EXPIRED':
        return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>منتهية</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
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

  if (!vehicle) return null;

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8" style={{ backgroundColor: '#f8fafc' }}>
          <div className="max-w-4xl mx-auto">
            {/* رجوع + عنوان */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <ArrowRight className="w-5 h-5" style={{ color: '#64748b' }} />
              </button>
              <h2 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
                تفاصيل المركبة
              </h2>
            </div>

            {/* بطاقة المعلومات الرئيسية */}
            <div className="rounded-2xl border shadow-sm p-6 mb-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#ecfeff' }}>
                    <Car className="w-8 h-8" style={{ color: '#06b6d4' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: '#0f172a' }}>
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: '#64748b' }}>
                      {vehicle.plateNumber} • {vehicle.year}
                    </p>
                  </div>
                </div>
                {getStatusBadge(vehicle.status)}
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>اللون</p>
                  <p className="font-medium" style={{ color: '#0f172a' }}>{vehicle.color || '-'}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>نوع المحرك</p>
                  <p className="font-medium" style={{ color: '#0f172a' }}>{vehicle.engineType}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>رقم الشاسيه</p>
                  <p className="font-medium text-sm" style={{ color: '#0f172a' }}>{vehicle.vin || '-'}</p>
                </div>
              </div>
            </div>

            {/* معلومات المالك */}
            <div className="rounded-2xl border shadow-sm p-6 mb-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                <User className="w-5 h-5" style={{ color: '#06b6d4' }} />
                معلومات المالك
              </h4>
              {vehicle.ownerships[0] ? (
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>الاسم</p>
                    <p className="font-medium" style={{ color: '#0f172a' }}>{vehicle.ownerships[0].owner.name}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>رقم الهاتف</p>
                    <p className="font-medium" style={{ color: '#0f172a' }}>{vehicle.ownerships[0].owner.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>رقم الهوية</p>
                    <p className="font-medium" style={{ color: '#0f172a' }}>{vehicle.ownerships[0].owner.idNumber}</p>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#94a3b8' }}>لا يوجد مالك مسجل</p>
              )}
            </div>

            {/* إحصائيات */}
            <div className="grid grid-cols-3 gap-6">
              <div className="rounded-2xl border shadow-sm p-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef2f2' }}>
                    <FileText className="w-5 h-5" style={{ color: '#ef4444' }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#64748b' }}>المخالفات</p>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#0f172a' }}>{vehicle.violations.length}</p>
              </div>
              <div className="rounded-2xl border shadow-sm p-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                    <Wrench className="w-5 h-5" style={{ color: '#22c55e' }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#64748b' }}>التصليحات</p>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#0f172a' }}>{vehicle.maintenances.length}</p>
              </div>
              <div className="rounded-2xl border shadow-sm p-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
                    <AlertTriangle className="w-5 h-5" style={{ color: '#d97706' }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#64748b' }}>بلاغات السرقة</p>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#0f172a' }}>{vehicle.theftReports.length}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}