import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinanceStore, categories, type Category, type TransactionType } from '@/store/useFinanceStore';

const schema = z.object({
  date: z.string().min(1, 'Date is required'),
  description: z.string().trim().min(1, 'Description required').max(100),
  amount: z.coerce.number().positive('Must be positive'),
  category: z.string().min(1, 'Category required'),
  type: z.enum(['income', 'expense']),
});

type FormData = z.infer<typeof schema>;

export function AddTransactionModal({
  open,
  onOpenChange,
  editingId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
}) {
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const editTransaction = useFinanceStore((s) => s.editTransaction);
  const transactions = useFinanceStore((s) => s.transactions);

  const existing = editingId ? transactions.find((t) => t.id === editingId) : null;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: 0,
      category: 'Food',
      type: 'expense',
    },
  });

  useEffect(() => {
    if (existing) {
      setValue('date', existing.date);
      setValue('description', existing.description);
      setValue('amount', existing.amount);
      setValue('category', existing.category);
      setValue('type', existing.type);
    } else {
      reset();
    }
  }, [existing, open]);

  const onSubmit = (data: FormData) => {
    if (editingId) {
      editTransaction(editingId, data as any);
    } else {
      addTransaction(data as any);
    }
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingId ? 'Edit' : 'Add'} Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Date</Label>
            <Input type="date" {...register('date')} />
            {errors.date && <p className="text-xs text-destructive mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <Label>Description</Label>
            <Input {...register('description')} placeholder="e.g. Grocery shopping" />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <Label>Amount</Label>
            <Input type="number" step="0.01" {...register('amount')} />
            {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>}
          </div>
          <div>
            <Label>Category</Label>
            <Select value={watch('category')} onValueChange={(v) => setValue('category', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Type</Label>
            <Select value={watch('type')} onValueChange={(v) => setValue('type', v as TransactionType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">{editingId ? 'Save Changes' : 'Add Transaction'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
