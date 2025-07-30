import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, Target, Plus } from "lucide-react";
import { format } from "date-fns";
import { ProgressBar, Cell } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FinancialGoal {
  id?: string;
  name: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: Date;
  category: "Savings" | "Travel" | "Tech" | "Other";
  createdAt?: string;
}

interface GoalFormData {
  name: string;
  targetAmount: number;
  deadline: Date;
  category: "Savings" | "Travel" | "Tech" | "Other";
}

// Mock API function
const createGoal = async (goalData: GoalFormData): Promise<FinancialGoal> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful response
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...goalData,
    currentAmount: 0,
    createdAt: new Date().toISOString(),
  };
};

export const GoalForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<GoalFormData>({
    defaultValues: {
      name: "",
      targetAmount: 0,
      deadline: new Date(),
      category: "Savings",
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: (newGoal) => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Goal Created Successfully!",
        description: `Your goal "${newGoal.name}" has been created. Start saving towards your $${newGoal.targetAmount} target!`,
      });
      form.reset();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error Creating Goal",
        description: "Failed to create your financial goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GoalFormData) => {
    // Validate deadline is in the future
    if (data.deadline <= new Date()) {
      form.setError("deadline", {
        type: "manual",
        message: "Deadline must be in the future",
      });
      return;
    }

    // Validate target amount is positive
    if (data.targetAmount <= 0) {
      form.setError("targetAmount", {
        type: "manual",
        message: "Target amount must be greater than 0",
      });
      return;
    }

    createGoalMutation.mutate(data);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Savings":
        return "💰";
      case "Travel":
        return "✈️";
      case "Tech":
        return "💻";
      case "Other":
        return "🎯";
      default:
        return "🎯";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Savings":
        return "text-green-600 dark:text-green-400";
      case "Travel":
        return "text-blue-600 dark:text-blue-400";
      case "Tech":
        return "text-purple-600 dark:text-purple-400";
      case "Other":
        return "text-orange-600 dark:text-orange-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  if (!isOpen) {
    return (
      <div className="flex justify-center">
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          <Plus className="h-4 w-4" />
          Create Financial Goal
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Create Financial Goal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Goal Name */}
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: "Goal name is required",
                minLength: {
                  value: 3,
                  message: "Goal name must be at least 3 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Goal name must be less than 50 characters",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Emergency Fund, MacBook Pro, Europe Trip"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Amount */}
            <FormField
              control={form.control}
              name="targetAmount"
              rules={{
                required: "Target amount is required",
                min: {
                  value: 1,
                  message: "Target amount must be at least $1",
                },
                max: {
                  value: 1000000,
                  message: "Target amount must be less than $1,000,000",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Savings", "Travel", "Tech", "Other"].map((category) => (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center gap-2">
                            <span>{getCategoryIcon(category)}</span>
                            <span className={getCategoryColor(category)}>{category}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deadline */}
            <FormField
              control={form.control}
              name="deadline"
              rules={{ required: "Deadline is required" }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Target Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Progress Preview */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress Preview</span>
                <span className="text-sm text-muted-foreground">0%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                  style={{ width: "0%" }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>$0</span>
                <span>${form.watch("targetAmount") || 0}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createGoalMutation.isPending}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
