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

const data = [
  { month: 'يناير', value: 65 },
  { month: 'فبراير', value: 55 },
  { month: 'مارس', value: 80 },
  { month: 'أبريل', value: 82 },
  { month: 'مايو', value: 55 },
  { month: 'يونيو', value: 58 },
  { month: 'يوليو', value: 40 },
  { month: 'أغسطس', value: 72 },
  { month: 'سبتمبر', value: 68 },
  { month: 'أكتوبر', value: 85 },
  { month: 'نوفمبر', value: 90 },
  { month: 'ديسمبر', value: 78 },
];

export default function MonthlyChart() {
  return (
    <div
      className="rounded-2xl p-6 border shadow-sm"
      style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}
    >
      <h3
        className="text-xl font-bold mb-6 text-right"
        style={{ color: '#0f172a' }}
      >
        إحصائيات المخالفات الشهرية
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <Tooltip
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
    </div>
  );
}