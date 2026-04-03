import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, PiggyBank, Brain, AlertTriangle } from 'lucide-react';
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
    const currentIncome = transactions
      .filter((t) => t.type === 'income' && t.date.startsWith(currentMonth))
      .reduce((s, t) => s + t.amount, 0);

    const change = prevExpenses > 0 ? ((currentExpenses - prevExpenses) / prevExpenses) * 100 : 0;

    // AI Forecast: average daily spend → projected month-end expense
    const currentMonthExpenses = transactions.filter(
      (t) => t.type === 'expense' && t.date.startsWith(currentMonth)
    );
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const avgDailySpend = dayOfMonth > 0 ? currentExpenses / dayOfMonth : 0;
    const projectedExpense = avgDailySpend * daysInMonth;
    const expenseToIncomeRatio = currentIncome > 0 ? (projectedExpense / currentIncome) * 100 : 0;
    const overBudget = expenseToIncomeRatio > 80;

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
      avgDailySpend,
      projectedExpense,
      expenseToIncomeRatio: Math.round(expenseToIncomeRatio),
      overBudget,
      daysRemaining: daysInMonth - dayOfMonth,
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
    {
      title: 'AI Forecast',
      value: `Avg $${insights.avgDailySpend.toFixed(0)}/day · Projected $${insights.projectedExpense.toFixed(0)} this month`,
      subtitle: insights.overBudget
        ? `⚠️ Projected expenses are ${insights.expenseToIncomeRatio}% of income — exceeds 80% threshold`
        : `On track — ${insights.expenseToIncomeRatio}% of income (${insights.daysRemaining} days left)`,
      icon: insights.overBudget ? AlertTriangle : Brain,
      color: insights.overBudget ? 'text-destructive' : 'text-primary',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className={c.title === 'AI Forecast' ? 'border-primary/30 bg-primary/5' : ''}>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <c.icon className={`h-5 w-5 ${c.color}`} />
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm font-semibold ${c.title === 'Saving Tip' || c.title === 'AI Forecast' ? '' : 'text-lg'}`}>
                {c.value}
              </p>
              {'subtitle' in c && c.subtitle && (
                <p className={`text-xs mt-1.5 ${insights.overBudget && c.title === 'AI Forecast' ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {c.subtitle}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
