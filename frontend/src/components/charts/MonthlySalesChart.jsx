import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { formatCompactCurrency, formatCurrency } from '../../utils/format';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 shadow-lg text-xs">
      <p className="mb-0.5 font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-semibold text-brand-600">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function MonthlySalesChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#9ca3af' }}
          tickFormatter={(v) => formatCompactCurrency(v)}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(5,150,105,0.06)' }} />
        <Bar dataKey="total" radius={[8, 8, 0, 0]} maxBarSize={36}>
          {data.map((_, index) => (
            <Cell key={index} fill="#10b981" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
