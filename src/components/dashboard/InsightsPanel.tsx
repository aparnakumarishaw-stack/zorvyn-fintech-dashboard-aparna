import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Lightbulb, PiggyBank } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceStore } from '@/store/useFinanceStore';

export function InsightsPanel() {
  const transactions = useFinanceStore((s) => s.transactions);

  const insights = useMemo(() => {
    const expensesByCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    const highestCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];

    // Monthly comparison
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1);
    const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    const currentExpenses = transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((s, t) => s + t.amount, 0);
    const prevExpenses = transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(prevMonth))
      .reduce((s, t) => s + t.amount, 0);

    const change = prevExpenses > 0 ? ((currentExpenses - prevExpenses) / prevExpenses) * 100 : 0;

    const tips: Record<string, string> = {
      Food: 'Try meal prepping on weekends to cut food expenses by up to 40%.',
      Rent: 'Consider negotiating your lease or exploring co-living options.',
      Entertainment: 'Look for free community events or set a monthly entertainment budget.',
      Tech: 'Check for student/open-source discounts before purchasing tech subscriptions.',
      Transport: 'Use public transit or carpooling to reduce transport costs.',
      Utilities: 'Switch to energy-efficient appliances to lower utility bills.',
    };

    return {
      highestCategory: highestCategory?.[0] || 'N/A',
      highestAmount: highestCategory?.[1] || 0,
      monthlyChange: Math.round(change * 10) / 10,
      tip: highestCategory ? tips[highestCategory[0]] || 'Track spending to identify savings opportunities.' : 'Add transactions to see insights.',
    };
  }, [transactions]);

  const cards = [
    {
      title: 'Highest Spending',
      value: `${insights.highestCategory} — $${insights.highestAmount.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-warning',
    },
    {
      title: 'Monthly Change',
      value: `${insights.monthlyChange >= 0 ? '+' : ''}${insights.monthlyChange}%`,
      icon: insights.monthlyChange >= 0 ? TrendingUp : TrendingDown,
      color: insights.monthlyChange >= 0 ? 'text-destructive' : 'text-success',
    },
    {
      title: 'Saving Tip',
      value: insights.tip,
      icon: PiggyBank,
      color: 'text-primary',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <c.icon className={`h-5 w-5 ${c.color}`} />
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm font-semibold ${c.title === 'Saving Tip' ? '' : 'text-lg'}`}>{c.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
