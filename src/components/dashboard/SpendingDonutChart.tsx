import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceStore } from '@/store/useFinanceStore';

const COLORS = ['hsl(38, 92%, 50%)', 'hsl(217, 91%, 60%)', 'hsl(340, 82%, 52%)', 'hsl(262, 83%, 58%)', 'hsl(200, 70%, 50%)', 'hsl(30, 60%, 45%)'];

export function SpendingDonutChart() {
  const transactions = useFinanceStore((s) => s.transactions);

  const data = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
