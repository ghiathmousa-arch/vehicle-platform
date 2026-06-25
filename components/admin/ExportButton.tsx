// app/components/admin/ExportButton.tsx
'use client';

export default function ExportButton() {
  return (
    <button
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition"
      style={{
        border: '1px solid #06b6d4',
        color: '#0891b2',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#ecfeff';
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
      تصدير التقرير
    </button>
  );
}