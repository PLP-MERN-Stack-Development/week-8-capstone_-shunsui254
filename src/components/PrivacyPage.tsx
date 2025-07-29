import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PrivacyPage = () => {
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
          <h1 className="text-xl font-bold ml-4">Privacy Policy</h1>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <CardTitle className="text-2xl">MyBudgeteer Privacy Policy</CardTitle>
            </div>
            <p className="text-muted-foreground">Last updated: July 29, 2025</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h3 className="text-lg font-semibold">1. Information We Collect</h3>
              <p className="text-muted-foreground">
                When you use MyBudgeteer, we may collect the following types of information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li><strong>Account Information:</strong> Name, email address, phone number (optional)</li>
                <li><strong>Financial Data:</strong> Transaction records, budgets, and financial goals you input</li>
                <li><strong>Usage Data:</strong> How you interact with our application</li>
                <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">2. How We Use Your Information</h3>
              <p className="text-muted-foreground">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>Provide, operate, and maintain our service</li>
                <li>Improve, personalize, and expand our service</li>
                <li>Understand and analyze how you use our service</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you for customer service and support</li>
                <li>Send you emails and notifications related to your account</li>
                <li>Find and prevent fraud and security issues</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">3. Data Storage and Security</h3>
              <p className="text-muted-foreground">
                Your financial data privacy and security are our top priorities:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li><strong>Local Storage:</strong> Your financial data is stored locally on your device</li>
                <li><strong>Encryption:</strong> Data is encrypted using industry-standard encryption methods</li>
                <li><strong>No Third-Party Access:</strong> We do not sell, trade, or share your financial data with third parties</li>
                <li><strong>HTTPS:</strong> All data transmission is protected using HTTPS encryption</li>
                <li><strong>Regular Updates:</strong> We regularly update our security measures</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">4. Information Sharing</h3>
              <p className="text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal information to third parties except:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With trusted service providers who assist us in operating our service (under strict confidentiality agreements)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">5. Your Data Rights</h3>
              <p className="text-muted-foreground">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li><strong>Access:</strong> Request access to your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Objection:</strong> Object to processing of your personal data</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">6. Cookies and Tracking</h3>
              <p className="text-muted-foreground">
                MyBudgeteer uses minimal tracking technologies:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>No Analytics:</strong> We do not use third-party analytics cookies</li>
                <li><strong>No Advertising:</strong> We do not use advertising or tracking cookies</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">7. Children's Privacy</h3>
              <p className="text-muted-foreground">
                MyBudgeteer is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">8. International Data Transfers</h3>
              <p className="text-muted-foreground">
                Since your data is stored locally on your device, international data transfers are minimal. When they occur (such as for account authentication), we ensure appropriate safeguards are in place to protect your data.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">9. Data Retention</h3>
              <p className="text-muted-foreground">
                We retain your personal information only as long as necessary to provide our services and fulfill the purposes outlined in this policy. You can delete your account and data at any time through the application settings.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">10. Changes to This Policy</h3>
              <p className="text-muted-foreground">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">11. Contact Us</h3>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="text-muted-foreground ml-4">
                <p>Email: Cecilbezalel@gmail.com</p>
                <p>GitHub: https://github.com/shunsui254</p>
                <p>WhatsApp: +254799350952</p>
              </div>
              <p className="text-muted-foreground">
                We are committed to resolving any privacy concerns you may have.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
