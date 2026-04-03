import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'Admin' | 'Viewer';
export type TransactionType = 'income' | 'expense';
export type Category = 'Food' | 'Rent' | 'Entertainment' | 'Tech' | 'Salary' | 'Freelance' | 'Transport' | 'Utilities';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
}

interface Filters {
  search: string;
  category: Category | 'all';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

interface FinanceState {
  currentUserRole: UserRole;
  transactions: Transaction[];
  filters: Filters;
  darkMode: boolean;
  setRole: (role: UserRole) => void;
  toggleDarkMode: () => void;
  setFilter: (filter: Partial<Filters>) => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (id: string, t: Partial<Transaction>) => void;
}

const categories: Category[] = ['Food', 'Rent', 'Entertainment', 'Tech', 'Salary', 'Freelance', 'Transport', 'Utilities'];
const expenseCategories: Category[] = ['Food', 'Rent', 'Entertainment', 'Tech', 'Transport', 'Utilities'];
const incomeCategories: Category[] = ['Salary', 'Freelance'];

function generateMockTransactions(): Transaction[] {
  const descriptions: Record<Category, string[]> = {
    Food: ['Grocery shopping', 'Restaurant dinner', 'Coffee shop', 'Lunch takeout'],
    Rent: ['Monthly rent', 'Parking space'],
    Entertainment: ['Netflix subscription', 'Concert tickets', 'Movie night'],
    Tech: ['New headphones', 'Software license', 'Cloud hosting'],
    Salary: ['Monthly salary', 'Quarterly bonus'],
    Freelance: ['Web design project', 'Consulting fee', 'Logo design'],
    Transport: ['Gas refill', 'Uber ride', 'Train ticket'],
    Utilities: ['Electric bill', 'Internet bill', 'Water bill'],
  };

  const txns: Transaction[] = [];
  for (let i = 0; i < 20; i++) {
    const isIncome = i < 5;
    const catPool = isIncome ? incomeCategories : expenseCategories;
    const cat = catPool[i % catPool.length];
    const descs = descriptions[cat];
    const month = 6 - Math.floor(i / 4);
    const day = (i % 28) + 1;
    txns.push({
      id: `txn-${i + 1}`,
      date: `2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      description: descs[i % descs.length],
      amount: isIncome
        ? Math.round((3000 + Math.random() * 4000) * 100) / 100
        : Math.round((20 + Math.random() * 800) * 100) / 100,
      category: cat,
      type: isIncome ? 'income' : 'expense',
    });
  }
  return txns;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      currentUserRole: 'Admin',
      transactions: generateMockTransactions(),
      filters: { search: '', category: 'all', sortBy: 'date', sortOrder: 'desc' },
      darkMode: false,
      setRole: (role) => set({ currentUserRole: role }),
      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode;
          document.documentElement.classList.toggle('dark', next);
          return { darkMode: next };
        }),
      setFilter: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
      addTransaction: (t) =>
        set((s) => ({
          transactions: [{ ...t, id: `txn-${Date.now()}` }, ...s.transactions],
        })),
      deleteTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),
      editTransaction: (id, updates) =>
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
    }),
    {
      name: 'finance-dashboard',
      onRehydrate: () => (state) => {
        if (state?.darkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);

export { categories, expenseCategories, incomeCategories };
