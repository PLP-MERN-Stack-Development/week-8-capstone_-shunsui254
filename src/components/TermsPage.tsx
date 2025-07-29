import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold ml-4">Terms of Service</h1>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <CardTitle className="text-2xl">MyBudgeteer Terms of Service</CardTitle>
            </div>
            <p className="text-muted-foreground">Last updated: July 29, 2025</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h3 className="text-lg font-semibold">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground">
                By accessing and using MyBudgeteer, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">2. Use License</h3>
              <p className="text-muted-foreground">
                Permission is granted to temporarily use MyBudgeteer for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to decompile or reverse engineer any software contained in MyBudgeteer</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">3. User Accounts</h3>
              <p className="text-muted-foreground">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for activities that occur under your account.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">4. Financial Data</h3>
              <p className="text-muted-foreground">
                MyBudgeteer allows you to track your financial information. You acknowledge that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>You are responsible for the accuracy of all financial data you input</li>
                <li>MyBudgeteer is for informational purposes only and does not constitute financial advice</li>
                <li>You should consult with financial professionals for investment decisions</li>
                <li>Your financial data is stored locally and you are responsible for backups</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">5. Prohibited Uses</h3>
              <p className="text-muted-foreground">
                You may not use MyBudgeteer:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">6. Disclaimer</h3>
              <p className="text-muted-foreground">
                The materials on MyBudgeteer are provided on an 'as is' basis. MyBudgeteer makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">7. Limitations</h3>
              <p className="text-muted-foreground">
                In no event shall MyBudgeteer or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use MyBudgeteer, even if MyBudgeteer or its authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">8. Modifications</h3>
              <p className="text-muted-foreground">
                MyBudgeteer may revise these terms of service at any time without notice. By using this application, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">9. Contact Information</h3>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="text-muted-foreground ml-4">
                <p>Email: Cecilbezalel@gmail.com</p>
                <p>GitHub: https://github.com/shunsui254</p>
                <p>WhatsApp: +254799350952</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
