/**
 * QuickTransactionDialog - Configurable Transaction Entry Dialog
 * 
 * This component provides a flexible transaction dialog that can be pre-configured
 * with specific transaction types and controlled externally for Quick Actions.
 * 
 * Features:
 * - Pre-configurable transaction type (income/expense)
 * - External state control for opening/closing
 * - Form reset and validation
 * - Currency conversion support
 * - Streamlined UI for quick entry
 * 
 * @author Cecil Bezalel
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { Plus, Calendar, Tag, DollarSign, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency, CURRENCIES } from "@/hooks/useCurrency";
import { useToast } from "@/hooks/use-toast";

interface TransactionFormData {
  type: "income" | "expense";
  amount: string;
  currency: string;
  description: string;
  category: string;
  date: string;
  notes?: string;
}

interface QuickTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: "income" | "expense";
  title?: string;
}

export const QuickTransactionDialog = ({
  isOpen,
  onClose,
  defaultType = "expense",
  title
}: QuickTransactionDialogProps) => {
  const { currentCurrency, formatAmount, getConvertedAmount } = useCurrency();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<TransactionFormData>({
    type: defaultType,
    amount: "",
    currency: currentCurrency.code,
    description: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  // Update form type when defaultType changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      type: defaultType,
      category: "" // Reset category when type changes
    }));
  }, [defaultType]);

  const categories = {
    expense: ["Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills", "Healthcare", "Travel", "Other"],
    income: ["Salary", "Freelance", "Investment", "Gift", "Bonus", "Side Income", "Other"]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.amount || !formData.description || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically save to your backend/state
    const convertedAmount = getConvertedAmount(parseFloat(formData.amount), formData.currency);
    
    // Show success message
    toast({
      title: `${formData.type === 'income' ? '💰' : '💳'} Transaction Added`,
      description: `${formData.type === 'income' ? 'Income' : 'Expense'} of ${formatAmount(convertedAmount)} recorded successfully.`,
    });

    // Close dialog and reset form
    onClose();
    setFormData({
      type: defaultType,
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {formData.type === "income" ? (
              <>💰 {title || "Add Income"}</>
            ) : (
              <>💳 {title || "Add Expense"}</>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection (if not locked) */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={formData.type === "expense" ? "default" : "outline"}
              onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
              className="w-full"
            >
              💳 Expense
            </Button>
            <Button
              type="button"
              variant={formData.type === "income" ? "default" : "outline"}
              onClick={() => setFormData({ ...formData, type: "income", category: "" })}
              className="w-full"
            >
              💰 Income
            </Button>
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
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
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              placeholder={`What was this ${formData.type} for?`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
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
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gap-2">
              <Save className="h-4 w-4" />
              Save {formData.type === 'income' ? 'Income' : 'Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
