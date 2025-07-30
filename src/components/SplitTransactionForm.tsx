import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Minus, Calculator, Percent, DollarSign, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface SplitItem {
  id: string;
  category: string;
  subcategory?: string;
  amount: number;
  percentage: number;
  description: string;
}

interface SplitTransaction {
  totalAmount: number;
  description: string;
  date: string;
  paymentMethod: string;
  splitMethod: "amount" | "percentage";
  splits: SplitItem[];
}

const categories = [
  { value: "food", label: "Food & Dining", subcategories: ["Groceries", "Restaurants", "Takeout", "Coffee"] },
  { value: "transport", label: "Transportation", subcategories: ["Fuel", "Public Transport", "Taxi/Uber", "Parking"] },
  { value: "entertainment", label: "Entertainment", subcategories: ["Movies", "Games", "Books", "Subscriptions"] },
  { value: "shopping", label: "Shopping", subcategories: ["Clothing", "Electronics", "Home & Garden", "Personal Care"] },
  { value: "bills", label: "Bills & Utilities", subcategories: ["Electricity", "Water", "Internet", "Phone"] },
  { value: "healthcare", label: "Healthcare", subcategories: ["Doctor", "Pharmacy", "Insurance", "Fitness"] },
  { value: "education", label: "Education", subcategories: ["Courses", "Books", "Training", "Certification"] },
  { value: "business", label: "Business", subcategories: ["Office Supplies", "Software", "Marketing", "Equipment"] },
];

const paymentMethods = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Debit/Credit Card" },
  { value: "mpesa", label: "M-Pesa" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "other", label: "Other" },
];

export const SplitTransactionForm = ({ onClose }: { onClose?: () => void }) => {
  const [splitMethod, setSplitMethod] = useState<"amount" | "percentage">("amount");
  const [autoCalculate, setAutoCalculate] = useState(true);
  const { toast } = useToast();

  const form = useForm<SplitTransaction>({
    defaultValues: {
      totalAmount: 0,
      description: "",
      date: new Date().toISOString().split('T')[0],
      paymentMethod: "",
      splitMethod: "amount",
      splits: [
        {
          id: "1",
          category: "",
          subcategory: "",
          amount: 0,
          percentage: 0,
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "splits",
  });

  const watchedValues = form.watch();

  // Calculate totals
  const totalSplitAmount = watchedValues.splits?.reduce((sum, split) => sum + (split.amount || 0), 0) || 0;
  const totalSplitPercentage = watchedValues.splits?.reduce((sum, split) => sum + (split.percentage || 0), 0) || 0;
  const remainingAmount = (watchedValues.totalAmount || 0) - totalSplitAmount;
  const remainingPercentage = 100 - totalSplitPercentage;

  // Auto-calculate amounts/percentages
  const handleAutoCalculate = () => {
    const splits = watchedValues.splits || [];
    const totalAmount = watchedValues.totalAmount || 0;
    
    if (splitMethod === "amount") {
      // Distribute amount equally
      const amountPerSplit = totalAmount / splits.length;
      splits.forEach((_, index) => {
        form.setValue(`splits.${index}.amount`, Math.round(amountPerSplit * 100) / 100);
        form.setValue(`splits.${index}.percentage`, Math.round((amountPerSplit / totalAmount) * 100 * 100) / 100);
      });
    } else {
      // Distribute percentage equally
      const percentagePerSplit = 100 / splits.length;
      splits.forEach((_, index) => {
        form.setValue(`splits.${index}.percentage`, Math.round(percentagePerSplit * 100) / 100);
        form.setValue(`splits.${index}.amount`, Math.round((totalAmount * percentagePerSplit / 100) * 100) / 100);
      });
    }
  };

  // Update corresponding values when amount/percentage changes
  const handleAmountChange = (index: number, value: number) => {
    form.setValue(`splits.${index}.amount`, value);
    if (watchedValues.totalAmount && watchedValues.totalAmount > 0) {
      const percentage = (value / watchedValues.totalAmount) * 100;
      form.setValue(`splits.${index}.percentage`, Math.round(percentage * 100) / 100);
    }
  };

  const handlePercentageChange = (index: number, value: number) => {
    form.setValue(`splits.${index}.percentage`, value);
    if (watchedValues.totalAmount && watchedValues.totalAmount > 0) {
      const amount = (watchedValues.totalAmount * value) / 100;
      form.setValue(`splits.${index}.amount`, Math.round(amount * 100) / 100);
    }
  };

  const addSplit = () => {
    append({
      id: Date.now().toString(),
      category: "",
      subcategory: "",
      amount: 0,
      percentage: 0,
      description: "",
    });
  };

  const removeSplit = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const getCategorySubcategories = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue)?.subcategories || [];
  };

  const onSubmit = (data: SplitTransaction) => {
    // Validation
    if (Math.abs(remainingAmount) > 0.01 && splitMethod === "amount") {
      toast({
        title: "Invalid Split",
        description: `Split amounts don't match total. Remaining: $${remainingAmount.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    if (Math.abs(remainingPercentage) > 0.01 && splitMethod === "percentage") {
      toast({
        title: "Invalid Split",
        description: `Split percentages don't add up to 100%. Remaining: ${remainingPercentage.toFixed(2)}%`,
        variant: "destructive",
      });
      return;
    }

    // Check if all splits have categories
    const invalidSplits = data.splits.filter(split => !split.category);
    if (invalidSplits.length > 0) {
      toast({
        title: "Missing Categories",
        description: "Please select a category for all splits.",
        variant: "destructive",
      });
      return;
    }

    // Save transaction (would typically call an API)
    console.log("Split Transaction Data:", data);
    
    toast({
      title: "Transaction Saved",
      description: `Split transaction of $${data.totalAmount} saved successfully across ${data.splits.length} categories.`,
    });

    // Close form if onClose is provided
    if (onClose) {
      onClose();
    }

    // Reset form
    form.reset();
  };

  const isValidSplit = () => {
    if (splitMethod === "amount") {
      return Math.abs(remainingAmount) <= 0.01;
    } else {
      return Math.abs(remainingPercentage) <= 0.01;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Split Transaction
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Split a single transaction across multiple categories with precise control
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Transaction Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...form.register("totalAmount", { 
                  valueAsNumber: true,
                  required: "Total amount is required",
                  min: { value: 0.01, message: "Amount must be greater than 0" }
                })}
              />
              {form.formState.errors.totalAmount && (
                <p className="text-sm text-red-500">{form.formState.errors.totalAmount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...form.register("date", { required: "Date is required" })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select onValueChange={(value) => form.setValue("paymentMethod", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Transaction description"
                {...form.register("description", { required: "Description is required" })}
              />
            </div>
          </div>

          <Separator />

          {/* Split Method Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Split Configuration</h3>
              <div className="flex items-center gap-2">
                <Label htmlFor="splitMethod">Split by:</Label>
                <Select 
                  value={splitMethod} 
                  onValueChange={(value: "amount" | "percentage") => setSplitMethod(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Auto Calculate Button */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoCalculate}
                className="flex items-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                Auto Calculate Equal Split
              </Button>

              {/* Summary Badge */}
              <div className="flex items-center gap-2">
                {splitMethod === "amount" ? (
                  <Badge variant={isValidSplit() ? "default" : "destructive"}>
                    <DollarSign className="h-3 w-3 mr-1" />
                    Remaining: ${remainingAmount.toFixed(2)}
                  </Badge>
                ) : (
                  <Badge variant={isValidSplit() ? "default" : "destructive"}>
                    <Percent className="h-3 w-3 mr-1" />
                    Remaining: {remainingPercentage.toFixed(2)}%
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Split Items */}
          <div className="space-y-4">
            <h4 className="font-medium">Split Items</h4>
            
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="grid gap-4 md:grid-cols-6">
                  {/* Category */}
                  <div className="md:col-span-2">
                    <Label htmlFor={`category-${index}`}>Category</Label>
                    <Select
                      onValueChange={(value) => {
                        form.setValue(`splits.${index}.category`, value);
                        form.setValue(`splits.${index}.subcategory`, ""); // Reset subcategory
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subcategory */}
                  <div>
                    <Label htmlFor={`subcategory-${index}`}>Subcategory</Label>
                    <Select
                      onValueChange={(value) => form.setValue(`splits.${index}.subcategory`, value)}
                      disabled={!watchedValues.splits?.[index]?.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Optional" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCategorySubcategories(watchedValues.splits?.[index]?.category || "").map((sub) => (
                          <SelectItem key={sub} value={sub.toLowerCase().replace(" ", "_")}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount */}
                  <div>
                    <Label htmlFor={`amount-${index}`}>Amount</Label>
                    <Input
                      id={`amount-${index}`}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={watchedValues.splits?.[index]?.amount || ""}
                      onChange={(e) => handleAmountChange(index, parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  {/* Percentage */}
                  <div>
                    <Label htmlFor={`percentage-${index}`}>Percentage</Label>
                    <Input
                      id={`percentage-${index}`}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={watchedValues.splits?.[index]?.percentage || ""}
                      onChange={(e) => handlePercentageChange(index, parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSplit(index)}
                      disabled={fields.length === 1}
                      className="w-full"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-3">
                  <Label htmlFor={`description-${index}`}>Notes (Optional)</Label>
                  <Input
                    id={`description-${index}`}
                    placeholder="Additional notes for this split"
                    {...form.register(`splits.${index}.description`)}
                  />
                </div>
              </Card>
            ))}

            {/* Add Split Button */}
            <Button
              type="button"
              variant="outline"
              onClick={addSplit}
              className="w-full flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Another Split
            </Button>
          </div>

          {/* Validation Alert */}
          {!isValidSplit() && (
            <Alert variant="destructive">
              <AlertDescription>
                {splitMethod === "amount" 
                  ? `Split amounts don't match the total amount. Adjust splits by $${Math.abs(remainingAmount).toFixed(2)}`
                  : `Split percentages don't add up to 100%. Adjust splits by ${Math.abs(remainingPercentage).toFixed(2)}%`
                }
              </AlertDescription>
            </Alert>
          )}

          {/* Summary */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-3">Transaction Summary</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium">${(watchedValues.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Split Across:</span>
                  <span className="font-medium">{fields.length} categories</span>
                </div>
                <div className="flex justify-between">
                  <span>Split Total:</span>
                  <span className="font-medium">
                    ${totalSplitAmount.toFixed(2)} ({totalSplitPercentage.toFixed(2)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={isValidSplit() ? "default" : "destructive"}>
                    {isValidSplit() ? "Ready to Save" : "Needs Adjustment"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={!isValidSplit()}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Split Transaction
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
