import { useState } from "react";
import { Plus, Calendar, Tag, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency, CURRENCIES } from "@/hooks/useCurrency";

interface TransactionFormData {
  type: "income" | "expense";
  amount: string;
  currency: string;
  description: string;
  category: string;
  date: string;
  notes?: string;
}

export const AddTransactionDialog = () => {
  const { currentCurrency, formatAmount, getConvertedAmount } = useCurrency();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "expense",
    amount: "",
    currency: currentCurrency.code,
    description: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  const categories = {
    expense: ["Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills", "Healthcare", "Travel", "Other"],
    income: ["Salary", "Freelance", "Investment", "Gift", "Bonus", "Side Income", "Other"]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save to your backend/state
    
    // Show converted amount for validation
    const convertedAmount = getConvertedAmount(parseFloat(formData.amount), formData.currency);
    
    setOpen(false);
    // Reset form
    setFormData({
      type: "expense",
      amount: "",
      currency: currentCurrency.code,
      description: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
      notes: ""
    });
  };

  const getPreviewAmount = () => {
    const amount = parseFloat(formData.amount);
    if (!amount || isNaN(amount)) return null;
    
    if (formData.currency === currentCurrency.code) {
      return formatAmount(amount);
    }
    
    const converted = getConvertedAmount(amount, formData.currency);
    return `${formatAmount(converted)} (from ${amount} ${formData.currency})`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={formData.type === "expense" ? "default" : "outline"}
              onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
              className="w-full"
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={formData.type === "income" ? "default" : "outline"}
              onClick={() => setFormData({ ...formData, type: "income", category: "" })}
              className="w-full"
            >
              Income
            </Button>
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.symbol}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview converted amount */}
          {getPreviewAmount() && (
            <div className="p-2 rounded-lg bg-muted/50 text-sm">
              <span className="text-muted-foreground">Will appear as: </span>
              <span className="font-medium">{getPreviewAmount()}</span>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this transaction for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories[formData.type].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
