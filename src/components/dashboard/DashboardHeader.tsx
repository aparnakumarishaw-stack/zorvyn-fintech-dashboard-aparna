import { Moon, Sun, ShieldCheck, Eye } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/store/useFinanceStore';

export function DashboardHeader() {
  const role = useFinanceStore((s) => s.currentUserRole);
  const setRole = useFinanceStore((s) => s.setRole);
  const darkMode = useFinanceStore((s) => s.darkMode);
  const toggleDarkMode = useFinanceStore((s) => s.toggleDarkMode);

  return (
    <header className="h-14 flex items-center justify-between border-b px-4 bg-card">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold hidden sm:block">Finance Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRole(role === 'Admin' ? 'Viewer' : 'Admin')}
          className="gap-1.5"
        >
          {role === 'Admin' ? <ShieldCheck className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {role}
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
