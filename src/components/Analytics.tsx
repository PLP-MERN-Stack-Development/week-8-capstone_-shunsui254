import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const monthlyData = [
  { month: "Jan", income: 5200, expenses: 3400, savings: 1800 },
  { month: "Feb", income: 5420, expenses: 3100, savings: 2320 },
  { month: "Mar", income: 5200, expenses: 3600, savings: 1600 },
  { month: "Apr", income: 5800, expenses: 3200, savings: 2600 },
  { month: "May", income: 5420, expenses: 3800, savings: 1620 },
  { month: "Jun", income: 5650, expenses: 3300, savings: 2350 },
];

const categorySpending = [
  { category: "Food & Dining", amount: 1149, budget: 1200 },
  { category: "Transportation", amount: 493, budget: 600 },
  { category: "Entertainment", amount: 394, budget: 500 },
  { category: "Shopping", amount: 821, budget: 800 },
  { category: "Bills", amount: 750, budget: 800 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-lg p-3 shadow-lg">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.dataKey}: ${entry.value?.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState("6months");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your financial trends</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="income" 
                      stroke="hsl(145 65% 45%)" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(145 65% 45%)", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="hsl(0 85% 60%)" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(0 85% 60%)", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Savings Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="hsl(165 60% 50%)" 
                      fill="hsl(165 60% 50%)"
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categorySpending}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="amount" 
                      fill="hsl(210 100% 45%)" 
                      radius={[4, 4, 0, 0]}
                      name="Spent"
                    />
                    <Bar 
                      dataKey="budget" 
                      fill="hsl(210 100% 45% / 0.3)" 
                      radius={[4, 4, 0, 0]}
                      name="Budget"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};