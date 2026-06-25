'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { ArrowRight, AlertTriangle, Car, Calendar, User, Phone, MapPin, FileText, CheckCircle, XCircle } from 'lucide-react';

interface TheftReport {
  id: string;
  reporterName: string;
  reporterPhone: string;
  stealDate: string;
  location: string | null;
  details: string | null;
  status: string;
  createdAt: string;
  vehicle: {
    plateNumber: string;
    brand: string;
    model: string;
    year: number;
    color: string | null;
    status: string;
    ownerships: {
      owner: {
        name: string;
        phone: string;
      };
    }[];
  };
}

export default function TheftReportDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<TheftReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchReport();
  }, [id]);

  async function fetchReport() {
    try {
      const res = await fetch(`/api/admin/theft-reports/${id}`);
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
      } else {
        alert('البلاغ غير موجود');
        router.push('/admin/theft-reports');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!confirm(`هل أنت متأكد؟`)) return;

    try {
      const res = await fetch(`/api/admin/theft-reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchReport();
      } else {
        alert('حدث خطأ');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ');
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>قيد المراجعة</span>;
      case 'CONFIRMED':
        return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>مؤكد</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#f0fdf4', color: '#22c55e' }}>مرفوض</span>;
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

  if (!report) return null;

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
                  تفاصيل البلاغ
                </h2>
              </div>
              {getStatusBadge(report.status)}
            </div>

            {/* بطاقة المركبة */}
            <div className="rounded-2xl border shadow-sm p-6 mb-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                <Car className="w-5 h-5" style={{ color: '#ef4444' }} />
                معلومات المركبة
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>رقم اللوحة</p>
                  <p className="font-medium" style={{ color: '#0f172a' }}>{report.vehicle.plateNumber}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>النوع</p>
                  <p className="font-medium" style={{ color: '#0f172a' }}>{report.vehicle.brand} {report.vehicle.model}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>السنة</p>
                  <p className="font-medium" style={{ color: '#0f172a' }}>{report.vehicle.year}</p>
                </div>
              </div>
              {report.vehicle.ownerships[0] && (
                <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#fef2f2' }}>
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>المالك الأصلي</p>
                  <p className="font-medium" style={{ color: '#0f172a' }}>
                    {report.vehicle.ownerships[0].owner.name} — {report.vehicle.ownerships[0].owner.phone}
                  </p>
                </div>
              )}
            </div>

            {/* معلومات البلاغ */}
            <div className="rounded-2xl border shadow-sm p-6 mb-6" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}>
                <AlertTriangle className="w-5 h-5" style={{ color: '#ef4444' }} />
                معلومات البلاغ
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <User className="w-5 h-5" style={{ color: '#06b6d4' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>المُبلّغ</p>
                    <p className="font-medium" style={{ color: '#0f172a' }}>{report.reporterName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <Phone className="w-5 h-5" style={{ color: '#06b6d4' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>رقم الهاتف</p>
                    <p className="font-medium" style={{ color: '#0f172a' }}>{report.reporterPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <Calendar className="w-5 h-5" style={{ color: '#06b6d4' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>تاريخ السرقة</p>
                    <p className="font-medium" style={{ color: '#0f172a' }}>
                      {new Date(report.stealDate).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <MapPin className="w-5 h-5" style={{ color: '#06b6d4' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>الموقع</p>
                    <p className="font-medium" style={{ color: '#0f172a' }}>{report.location || 'غير محدد'}</p>
                  </div>
                </div>
              </div>
              {report.details && (
                <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <p className="text-xs mb-2 flex items-center gap-2" style={{ color: '#94a3b8' }}>
                    <FileText className="w-4 h-4" />
                    التفاصيل
                  </p>
                  <p className="text-sm" style={{ color: '#0f172a' }}>{report.details}</p>
                </div>
              )}
            </div>

            {/* إجراءات */}
            {report.status === 'PENDING' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusChange('CONFIRMED')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#dc2626' }}
                >
                  <CheckCircle className="w-4 h-4" />
                  تأكيد السرقة
                </button>
                <button
                  onClick={() => handleStatusChange('REJECTED')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#22c55e' }}
                >
                  <XCircle className="w-4 h-4" />
                  رفض البلاغ
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}