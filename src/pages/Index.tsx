import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { BalanceTrendChart } from '@/components/dashboard/BalanceTrendChart';
import { SpendingDonutChart } from '@/components/dashboard/SpendingDonutChart';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';

const section = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <motion.div id="overview" {...section}>
          <SummaryCards />
        </motion.div>

        <motion.div {...section} transition={{ delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BalanceTrendChart />
          <SpendingDonutChart />
        </motion.div>

        <motion.div id="transactions" {...section} transition={{ delay: 0.2 }}>
          <TransactionsTable />
        </motion.div>

        <motion.div id="insights" {...section} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-semibold mb-3">Insights</h2>
          <InsightsPanel />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
