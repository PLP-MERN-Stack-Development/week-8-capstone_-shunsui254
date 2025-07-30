import { useState } from "react";
import { Calculator, FileText, Download, Info, DollarSign } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaxCalculation {
  grossIncome: number;
  taxableIncome: number;
  payeTax: number;
  nssf: number;
  nhif: number;
  netIncome: number;
  effectiveRate: number;
  marginalRate: number;
}

interface DeductibleExpense {
  category: string;
  amount: number;
  description: string;
}

// KRA Tax Bands for 2024 (Monthly)
const TAX_BANDS = [
  { min: 0, max: 24000, rate: 0.10 },
  { min: 24001, max: 32333, rate: 0.25 },
  { min: 32334, max: 500000, rate: 0.30 },
  { min: 500001, max: 800000, rate: 0.325 },
  { min: 800001, max: Infinity, rate: 0.35 },
];

// NHIF Rates (Monthly)
const NHIF_RATES = [
  { min: 0, max: 5999, amount: 150 },
  { min: 6000, max: 7999, amount: 300 },
  { min: 8000, max: 11999, amount: 400 },
  { min: 12000, max: 14999, amount: 500 },
  { min: 15000, max: 19999, amount: 600 },
  { min: 20000, max: 24999, amount: 750 },
  { min: 25000, max: 29999, amount: 850 },
  { min: 30000, max: 34999, amount: 900 },
  { min: 35000, max: 39999, amount: 950 },
  { min: 40000, max: 44999, amount: 1000 },
  { min: 45000, max: 49999, amount: 1100 },
  { min: 50000, max: 59999, amount: 1200 },
  { min: 60000, max: 69999, amount: 1300 },
  { min: 70000, max: 79999, amount: 1400 },
  { min: 80000, max: 89999, amount: 1500 },
  { min: 90000, max: 99999, amount: 1600 },
  { min: 100000, max: Infinity, amount: 1700 },
];

const PERSONAL_RELIEF = 2400; // Monthly personal relief
const NSSF_RATE = 0.06; // 6% of pensionable pay
const MAX_NSSF = 2160; // Maximum NSSF contribution (6% of 36,000)

export const TaxCalculator = () => {
  const [incomeType, setIncomeType] = useState<"monthly" | "annual">("monthly");
  const [grossIncome, setGrossIncome] = useState<string>("");
  const [deductibleExpenses, setDeductibleExpenses] = useState<DeductibleExpense[]>([]);
  const [newExpense, setNewExpense] = useState({ category: "", amount: "", description: "" });
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);

  const calculateTax = () => {
    const income = parseFloat(grossIncome) || 0;
    const monthlyIncome = incomeType === "annual" ? income / 12 : income;
    
    if (monthlyIncome <= 0) return;

    // Calculate total deductible expenses
    const totalExpenses = deductibleExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const monthlyExpenses = incomeType === "annual" ? totalExpenses / 12 : totalExpenses;

    // Calculate NSSF contribution
    const nssf = Math.min(monthlyIncome * NSSF_RATE, MAX_NSSF);

    // Calculate NHIF contribution
    const nhif = NHIF_RATES.find(rate => 
      monthlyIncome >= rate.min && monthlyIncome <= rate.max
    )?.amount || 0;

    // Calculate taxable income
    const taxableIncome = Math.max(0, monthlyIncome - nssf - monthlyExpenses);

    // Calculate PAYE tax
    let payeTax = 0;
    let remainingIncome = taxableIncome;

    for (const band of TAX_BANDS) {
      if (remainingIncome <= 0) break;

      const bandIncome = Math.min(remainingIncome, band.max - band.min + (band.min === 0 ? 0 : 1));
      if (bandIncome > 0) {
        payeTax += bandIncome * band.rate;
        remainingIncome -= bandIncome;
      }
    }

    // Apply personal relief
    payeTax = Math.max(0, payeTax - PERSONAL_RELIEF);

    // Calculate net income
    const netIncome = monthlyIncome - payeTax - nssf - nhif;

    // Calculate rates
    const effectiveRate = monthlyIncome > 0 ? (payeTax / monthlyIncome) * 100 : 0;
    const marginalRate = getMarginalTaxRate(taxableIncome) * 100;

    setCalculation({
      grossIncome: monthlyIncome,
      taxableIncome,
      payeTax,
      nssf,
      nhif,
      netIncome,
      effectiveRate,
      marginalRate,
    });
  };

  const getMarginalTaxRate = (income: number): number => {
    for (const band of TAX_BANDS) {
      if (income >= band.min && income <= band.max) {
        return band.rate;
      }
    }
    return TAX_BANDS[TAX_BANDS.length - 1].rate;
  };

  const addExpense = () => {
    if (newExpense.category && newExpense.amount) {
      setDeductibleExpenses([
        ...deductibleExpenses,
        {
          category: newExpense.category,
          amount: parseFloat(newExpense.amount) || 0,
          description: newExpense.description,
        },
      ]);
      setNewExpense({ category: "", amount: "", description: "" });
    }
  };

  const removeExpense = (index: number) => {
    setDeductibleExpenses(deductibleExpenses.filter((_, i) => i !== index));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const generateTaxReport = () => {
    if (!calculation) return;

    const report = `
KENYAN TAX CALCULATION REPORT
============================

Income Information:
- Gross Income (Monthly): ${formatCurrency(calculation.grossIncome)}
- Gross Income (Annual): ${formatCurrency(calculation.grossIncome * 12)}

Deductions:
- NSSF Contribution: ${formatCurrency(calculation.nssf)}
- NHIF Contribution: ${formatCurrency(calculation.nhif)}
- Business Expenses: ${formatCurrency(deductibleExpenses.reduce((sum, exp) => sum + exp.amount, 0))}

Tax Calculation:
- Taxable Income: ${formatCurrency(calculation.taxableIncome)}
- PAYE Tax: ${formatCurrency(calculation.payeTax)}
- Personal Relief: ${formatCurrency(PERSONAL_RELIEF)}

Net Income:
- Monthly Net: ${formatCurrency(calculation.netIncome)}
- Annual Net: ${formatCurrency(calculation.netIncome * 12)}

Tax Rates:
- Effective Tax Rate: ${calculation.effectiveRate.toFixed(2)}%
- Marginal Tax Rate: ${calculation.marginalRate.toFixed(2)}%

Expense Breakdown:
${deductibleExpenses.map(exp => `- ${exp.category}: ${formatCurrency(exp.amount)} (${exp.description})`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
Source: MyBudgeteer Tax Calculator

Note: This calculation is for estimation purposes only. 
Please consult a tax professional for official tax advice.
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-calculation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Kenyan Tax Calculator for Freelancers
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Calculate your PAYE tax, NSSF, and NHIF contributions based on current KRA rates (2024)
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              This calculator uses the current Kenyan tax rates and is designed for freelancers and self-employed individuals. 
              Results are estimates and should not replace professional tax advice.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="calculator" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
              <TabsTrigger value="rates">Tax Rates & Info</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-6">
              {/* Income Input */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="income-type">Income Period</Label>
                  <Select value={incomeType} onValueChange={(value: "monthly" | "annual") => setIncomeType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gross-income">
                    Gross Income ({incomeType === "monthly" ? "Monthly" : "Annual"})
                  </Label>
                  <Input
                    id="gross-income"
                    type="number"
                    placeholder="Enter your gross income"
                    value={grossIncome}
                    onChange={(e) => setGrossIncome(e.target.value)}
                  />
                </div>
              </div>

              {/* Deductible Expenses */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Deductible Business Expenses</h3>
                
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <Label htmlFor="expense-category">Category</Label>
                    <Select 
                      value={newExpense.category} 
                      onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="office-rent">Office Rent</SelectItem>
                        <SelectItem value="equipment">Equipment & Software</SelectItem>
                        <SelectItem value="internet">Internet & Communication</SelectItem>
                        <SelectItem value="transport">Business Transport</SelectItem>
                        <SelectItem value="training">Professional Training</SelectItem>
                        <SelectItem value="marketing">Marketing & Advertising</SelectItem>
                        <SelectItem value="insurance">Professional Insurance</SelectItem>
                        <SelectItem value="other">Other Business Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="expense-amount">
                      Amount ({incomeType === "monthly" ? "Monthly" : "Annual"})
                    </Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      placeholder="0"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="expense-description">Description (Optional)</Label>
                    <Input
                      id="expense-description"
                      placeholder="Brief description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button onClick={addExpense} className="w-full">
                      Add Expense
                    </Button>
                  </div>
                </div>

                {/* Expense List */}
                {deductibleExpenses.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Added Expenses:</h4>
                    {deductibleExpenses.map((expense, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{expense.category}</Badge>
                            <span className="font-medium">{formatCurrency(expense.amount)}</span>
                          </div>
                          {expense.description && (
                            <p className="text-sm text-muted-foreground mt-1">{expense.description}</p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeExpense(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Calculate Button */}
              <Button 
                onClick={calculateTax} 
                className="w-full"
                disabled={!grossIncome}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Tax
              </Button>

              {/* Results */}
              {calculation && (
                <div className="space-y-4">
                  <Separator />
                  <h3 className="text-lg font-medium">Tax Calculation Results</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Income Breakdown */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Income Breakdown (Monthly)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Gross Income</span>
                          <span className="font-medium">{formatCurrency(calculation.grossIncome)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Business Expenses</span>
                          <span className="font-medium text-green-600">
                            -{formatCurrency(deductibleExpenses.reduce((sum, exp) => sum + (incomeType === "annual" ? exp.amount / 12 : exp.amount), 0))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">NSSF Contribution</span>
                          <span className="font-medium text-blue-600">-{formatCurrency(calculation.nssf)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Taxable Income</span>
                          <span className="font-medium">{formatCurrency(calculation.taxableIncome)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tax & Deductions */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Tax & Deductions (Monthly)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">PAYE Tax</span>
                          <span className="font-medium text-red-600">{formatCurrency(calculation.payeTax)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">NHIF</span>
                          <span className="font-medium text-blue-600">{formatCurrency(calculation.nhif)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Personal Relief</span>
                          <span className="font-medium text-green-600">-{formatCurrency(PERSONAL_RELIEF)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Net Income</span>
                          <span className="font-bold text-lg text-green-600">{formatCurrency(calculation.netIncome)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tax Rates */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{calculation.effectiveRate.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">Effective Tax Rate</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{calculation.marginalRate.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">Marginal Tax Rate</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{formatCurrency(calculation.netIncome * 12)}</div>
                          <div className="text-sm text-muted-foreground">Annual Net Income</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Download Report */}
                  <Button onClick={generateTaxReport} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Tax Report
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rates" className="space-y-6">
              {/* Tax Bands */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">PAYE Tax Bands (2024)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {TAX_BANDS.map((band, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="font-medium">
                          {formatCurrency(band.min)} - {band.max === Infinity ? "Above" : formatCurrency(band.max)}
                        </span>
                        <Badge variant="secondary">{(band.rate * 100).toFixed(1)}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* NHIF Rates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">NHIF Contribution Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm">
                    {NHIF_RATES.slice(0, 8).map((rate, index) => (
                      <div key={index} className="flex justify-between p-2 border rounded">
                        <span>{formatCurrency(rate.min)} - {formatCurrency(rate.max)}</span>
                        <span className="font-medium">{formatCurrency(rate.amount)}</span>
                      </div>
                    ))}
                    <div className="text-center mt-2">
                      <span className="text-muted-foreground">... and more</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">NSSF Contribution</h4>
                    <p className="text-sm text-muted-foreground">
                      6% of pensionable pay, capped at KES 2,160 per month (based on maximum pensionable pay of KES 36,000)
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Personal Relief</h4>
                    <p className="text-sm text-muted-foreground">
                      KES 2,400 per month (KES 28,800 annually) - automatically deducted from your tax liability
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Deductible Expenses for Freelancers</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Office rent and utilities</li>
                      <li>• Equipment and software</li>
                      <li>• Internet and communication costs</li>
                      <li>• Business transport expenses</li>
                      <li>• Professional training and certification</li>
                      <li>• Marketing and advertising</li>
                      <li>• Professional insurance premiums</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
