import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isNewUser } from "@/lib/userUtils";

const data = [
  { name: "Food & Dining", value: 35, amount: 1149.50 },
  { name: "Shopping", value: 25, amount: 821.75 },
  { name: "Transportation", value: 15, amount: 493.25 },
  { name: "Entertainment", value: 12, amount: 394.50 },
  { name: "Bills", value: 8, amount: 262.80 },
  { name: "Other", value: 5, amount: 164.25 },
];

const COLORS = [
  "hsl(210 100% 45%)",
  "hsl(145 65% 45%)",
  "hsl(35 90% 55%)",
  "hsl(265 60% 50%)",
  "hsl(0 85% 60%)",
  "hsl(195 60% 50%)",
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      amount: number;
      value: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          ${data.amount.toFixed(2)} ({data.value}%)
        </p>
      </div>
    );
  }
  return null;
};

export const SpendingChart = () => {
  const newUser = isNewUser();
  const dataToShow = newUser ? [] : data;
  
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Spending Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dataToShow.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No spending data yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Add some transactions to see your spending breakdown
            </p>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        ) : (
          <>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataToShow}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={800}
                  >
                    {dataToShow.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-2">
              {dataToShow.slice(0, 3).map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">${item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};