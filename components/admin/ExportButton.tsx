// app/components/admin/ExportButton.tsx
'use client';

import { useState } from 'react';

type Row = Record<string, string | number | null | undefined>;

// تهريب قيم CSV: الاقتباس المزدوج والفواصل والأسطر الجديدة
function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: Row[]): string {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const head = cols.join(',');
  const body = rows.map((r) => cols.map((c) => csvCell(r[c])).join(',')).join('\r\n');
  // BOM ليفتح Excel العربية بالترميز الصحيح
  return '\uFEFF' + head + '\r\n' + body;
}

const fmtDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString('en-CA') : '';

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/vehicles');
      if (!res.ok) throw new Error('تعذّر جلب البيانات');

      const { vehicles } = await res.json();

      const rows: Row[] = vehicles.map((v: any) => ({
        'رقم اللوحة': v.plateNumber,
        'الماركة': v.brand,
        'الموديل': v.model,
        'سنة الصنع': v.year,
        'اللون': v.color,
        'نوع المحرك': v.engineType,
        'رقم الهيكل': v.vin,
        'الحالة': v.status,
        'انتهاء التأمين': fmtDate(v.insuranceExpiry),
        'انتهاء التسجيل': fmtDate(v.registrationExpiry),
        'المالك الحالي':
          v.ownerships?.find((o: any) => o.isCurrent)?.owner?.name ??
          v.ownerships?.[0]?.owner?.name ??
          '',
        'عدد المخالفات': v.violations?.length ?? 0,
        'عدد الصيانات': v.maintenances?.length ?? 0,
        'عدد البلاغات': v.theftReports?.length ?? 0,
      }));

      const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `تقرير-المركبات-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('تعذّر تصدير التقرير. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition"
      style={{
        border: '1px solid #06b6d4',
        color: loading ? '#94a3b8' : '#0891b2',
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = '#ecfeff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {loading ? 'جاري التصدير...' : 'تصدير التقرير'}
    </button>
  );
}
