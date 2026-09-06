// app/components/admin/MonthlyChart.tsx
'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type MonthPoint = { month: string; value: number };

export default function MonthlyChart({
  data,
  year,
  loading = false,
}: {
  data: MonthPoint[];
  year?: number;
  loading?: boolean;
}) {
  const hasData = data.some((d) => d.value > 0);

  return (
    <div
      className="rounded-2xl p-6 border shadow-sm"
      style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}
    >
      <h3
        className="text-xl font-bold mb-6 text-right"
        style={{ color: '#0f172a' }}
      >
        إحصائيات المخالفات الشهرية{year ? ` — ${year}` : ''}
      </h3>

      {loading ? (
        <div className="h-[300px] rounded-xl bg-gray-100 animate-pulse" />
      ) : !hasData ? (
        <div
          className="h-[300px] flex items-center justify-center text-sm rounded-xl"
          style={{ color: '#94a3b8', backgroundColor: '#f8fafc' }}
        >
          لا توجد مخالفات مسجّلة في هذه السنة
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip
              formatter={(value) => [`${Number(value)} مخالفة`, '']}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                textAlign: 'right',
              }}
              cursor={{ fill: 'rgba(34, 211, 238, 0.05)' }}
            />
            <Bar
              dataKey="value"
              fill="#22d3ee"
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
