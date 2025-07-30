import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, Bell, Plus, Clock } from "lucide-react";
import { format, addDays, subDays } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface BillReminder {
  id?: string;
  name: string;
  amount: number;
  dueDate: Date;
  frequency: "Daily" | "Weekly" | "Monthly";
  nextDueDate?: Date;
  notificationScheduled?: boolean;
  createdAt?: string;
}

interface BillFormData {
  name: string;
  amount: number;
  dueDate: Date;
  frequency: "Daily" | "Weekly" | "Monthly";
}

// Mock API function
const createBillReminder = async (billData: BillFormData): Promise<BillReminder> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Calculate next due date based on frequency
  const getNextDueDate = (date: Date, frequency: string) => {
    switch (frequency) {
      case "Daily":
        return addDays(date, 1);
      case "Weekly":
        return addDays(date, 7);
      case "Monthly":
        return new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
      default:
        return date;
    }
  };

  // Mock successful response
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...billData,
    nextDueDate: getNextDueDate(billData.dueDate, billData.frequency),
    notificationScheduled: true,
    createdAt: new Date().toISOString(),
  };
};

// Local notification system (mock implementation)
const scheduleNotification = (billName: string, dueDate: Date, amount: number) => {
  const notificationDate = subDays(dueDate, 3);
  const now = new Date();
  
  if (notificationDate > now) {
    const timeUntilNotification = notificationDate.getTime() - now.getTime();
    
    // In a real app, you'd use service workers or a more sophisticated notification system
    setTimeout(() => {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`Bill Reminder: ${billName}`, {
          body: `Your bill of $${amount} is due in 3 days (${format(dueDate, "PPP")})`,
          icon: "/aikon.png",
          badge: "/aikon.png",
          tag: `bill-reminder-${billName}`,
        });
      }
    }, Math.min(timeUntilNotification, 24 * 60 * 60 * 1000)); // Cap at 24 hours for demo
  }
};

// Request notification permission
const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const BillReminderForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BillFormData>({
    defaultValues: {
      name: "",
      amount: 0,
      dueDate: new Date(),
      frequency: "Monthly",
    },
  });

  const createBillMutation = useMutation({
    mutationFn: createBillReminder,
    onSuccess: async (newBill) => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      
      // Request notification permission and schedule notification
      const hasPermission = await requestNotificationPermission();
      
      if (hasPermission) {
        scheduleNotification(newBill.name, newBill.dueDate, newBill.amount);
        toast({
          title: "Bill Reminder Created!",
          description: `"${newBill.name}" has been added. You'll be notified 3 days before the due date.`,
        });
      } else {
        toast({
          title: "Bill Reminder Created!",
          description: `"${newBill.name}" has been added. Enable notifications for reminders.`,
        });
      }
      
      form.reset();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error Creating Bill Reminder",
        description: "Failed to create your bill reminder. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BillFormData) => {
    // Validate due date is not in the past for non-recurring bills
    if (data.dueDate < new Date() && data.frequency === "Monthly") {
      form.setError("dueDate", {
        type: "manual",
        message: "Due date should be in the future for new bills",
      });
      return;
    }

    // Validate amount is positive
    if (data.amount <= 0) {
      form.setError("amount", {
        type: "manual",
        message: "Amount must be greater than 0",
      });
      return;
    }

    createBillMutation.mutate(data);
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case "Daily":
        return "📅";
      case "Weekly":
        return "📆";
      case "Monthly":
        return "🗓️";
      default:
        return "⏰";
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "Daily":
        return "text-red-600 dark:text-red-400";
      case "Weekly":
        return "text-orange-600 dark:text-orange-400";
      case "Monthly":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  if (!isOpen) {
    return (
      <div className="flex justify-center">
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
        >
          <Plus className="h-4 w-4" />
          Add Bill Reminder
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Add Bill Reminder
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Never miss a payment again. We'll remind you 3 days before each due date.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Bill Name */}
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: "Bill name is required",
                minLength: {
                  value: 2,
                  message: "Bill name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Bill name must be less than 50 characters",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bill Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Electricity, Rent, Internet, Phone"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              rules={{
                required: "Amount is required",
                min: {
                  value: 0.01,
                  message: "Amount must be at least $0.01",
                },
                max: {
                  value: 100000,
                  message: "Amount must be less than $100,000",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Frequency */}
            <FormField
              control={form.control}
              name="frequency"
              rules={{ required: "Frequency is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Daily", "Weekly", "Monthly"].map((frequency) => (
                        <SelectItem key={frequency} value={frequency}>
                          <div className="flex items-center gap-2">
                            <span>{getFrequencyIcon(frequency)}</span>
                            <span className={getFrequencyColor(frequency)}>{frequency}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              rules={{ required: "Due date is required" }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Next Due Date</FormLabel>
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notification Preview */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Notification Preview</span>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950">
                  <Bell className="h-3 w-3 mr-1" />
                  3 days before due date
                </Badge>
                <div className="text-xs text-muted-foreground bg-background p-2 rounded border">
                  <strong>Bill Reminder: {form.watch("name") || "Your Bill"}</strong>
                  <br />
                  Your bill of ${form.watch("amount") || 0} is due in 3 days
                  {form.watch("dueDate") && ` (${format(form.watch("dueDate"), "PPP")})`}
                </div>
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
                disabled={createBillMutation.isPending}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                {createBillMutation.isPending ? "Creating..." : "Add Reminder"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
