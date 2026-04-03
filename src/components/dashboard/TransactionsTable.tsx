import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, ArrowUpDown, Trash2, Pencil, AlertCircle, FileX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFinanceStore, categories, type Category } from '@/store/useFinanceStore';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';
import { AddTransactionModal } from './AddTransactionModal';

const categoryColors: Record<string, string> = {
  Food: 'bg-warning/15 text-warning border-warning/30',
  Rent: 'bg-primary/15 text-primary border-primary/30',
  Entertainment: 'bg-destructive/15 text-destructive border-destructive/30',
  Tech: 'bg-accent text-accent-foreground border-accent',
  Salary: 'bg-success/15 text-success border-success/30',
  Freelance: 'bg-primary/10 text-primary border-primary/20',
  Transport: 'bg-primary/15 text-primary border-primary/30',
  Utilities: 'bg-warning/10 text-warning border-warning/20',
};

export function TransactionsTable() {
  const role = useFinanceStore((s) => s.currentUserRole);
  const filters = useFinanceStore((s) => s.filters);
  const setFilter = useFinanceStore((s) => s.setFilter);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
  const filtered = useFilteredTransactions();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleSort = (by: 'date' | 'amount') => {
    if (filters.sortBy === by) {
      setFilter({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilter({ sortBy: by, sortOrder: 'desc' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-base">Transactions</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilter({ search: e.target.value })}
                className="pl-9 h-9 w-44"
              />
            </div>
            <Select
              value={filters.category}
              onValueChange={(v) => setFilter({ category: v as Category | 'all' })}
            >
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {role === 'Admin' && (
              <Button size="sm" onClick={() => { setEditingId(null); setModalOpen(true); }} className="gap-1">
                <Plus className="h-4 w-4" /> Add
              </Button>
            )}
          </div>
        </div>
        {role === 'Viewer' && (
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground bg-muted rounded-md px-3 py-2">
            <AlertCircle className="h-4 w-4" /> Read-Only Mode
          </div>
        )}
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-muted-foreground"
          >
            <FileX className="h-12 w-12 mb-3" />
            <p className="text-lg font-medium">No transactions found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => toggleSort('date')} className="gap-1 -ml-3">
                      Date <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => toggleSort('amount')} className="gap-1 -ml-3">
                      Amount <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  {role === 'Admin' && <TableHead className="w-20">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filtered.map((t) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="text-sm">{new Date(t.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{t.description}</TableCell>
                      <TableCell className={t.type === 'income' ? 'text-success font-semibold' : 'text-destructive font-semibold'}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={categoryColors[t.category] || ''}>
                          {t.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={t.type === 'income' ? 'default' : 'secondary'}>
                          {t.type === 'income' ? 'Income' : 'Expense'}
                        </Badge>
                      </TableCell>
                      {role === 'Admin' && (
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => { setEditingId(t.id); setModalOpen(true); }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => deleteTransaction(t.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <AddTransactionModal open={modalOpen} onOpenChange={setModalOpen} editingId={editingId} />
    </Card>
  );
}
