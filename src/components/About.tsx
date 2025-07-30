import { Code, Palette, Zap, Globe, Shield, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const About = () => {
  const features = [
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Multi-Currency Support",
      description: "Handle 12+ major currencies with real-time exchange rates"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Real-time Updates",
      description: "Live exchange rates with smart caching and offline support"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure & Private",
      description: "Your financial data stays local with enterprise-grade security"
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Mobile Responsive",
      description: "Perfect experience across desktop, tablet, and mobile devices"
    },
    {
      icon: <Palette className="h-5 w-5" />,
      title: "Modern Design",
      description: "Beautiful UI with dark/light theme support"
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: "Built with Modern Tech",
      description: "React 18, TypeScript, Tailwind CSS, and cutting-edge APIs"
    }
  ];

  const techStack = [
    "React 18", "TypeScript", "Tailwind CSS", "Vite", "shadcn/ui", 
    "Radix UI", "ExchangeRate-API", "React Query", "React Router"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">About MyBudgeteer</h1>
        <div className="mt-4 space-y-3">
          <p className="text-lg text-foreground font-medium">
            🚀 Where Financial Chaos Meets Digital Zen
          </p>
          <p className="text-muted-foreground leading-relaxed">
            MyBudgeteer isn't just another budgeting app—it's your financial transformation catalyst. We've weaponized cutting-edge technology to turn the mundane world of expense tracking into an engaging, intelligent experience that actually makes you <em>want</em> to manage your money.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Built for the ambitious, the overwhelmed, and everyone in between, this isn't your grandmother's spreadsheet. We're talking AI-powered insights, gamified achievements, multi-currency mastery, and offline resilience—all wrapped in a design so sleek it makes your bank's app weep with envy.
          </p>
          <p className="text-foreground font-medium">
            Ready to transform financial stress into financial success? Welcome to your money's new home. 💰✨
          </p>
        </div>
      </div>

      {/* Developer Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            About the Developer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                <img 
                  src="/profile.jpg" 
                  alt="Cecil Bezalel - Developer" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Cecil Bezalel</h3>
                <p className="text-muted-foreground">Full-Stack Developer & Financial Tech Enthusiast</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                👋 Cecil Bezalel here – the dev who turned budgeting from boring spreadsheets into something you'll actually <em>want</em> to use. I blend cutting-edge tech with real-world financial wisdom to create tools that don't just work, they <strong>work for you</strong>.
              </p>
              
              <p>
                Tired of budgeting apps that feel like homework? Same. That's why I engineered MyBudgeteer to be your financial wingman – intelligent enough to guide you, simple enough to love, and powerful enough to transform how you think about money. No finance degree required. ✨
              </p>
              
              <p className="font-medium text-foreground">
                From coffee-fueled coding sessions to hiking trails, I believe your budget should enhance your life, not limit it. Ready to experience financial management that actually makes sense?
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">React Expert</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">UI/UX Design</Badge>
              <Badge variant="secondary">Financial Tech</Badge>
              <Badge variant="secondary">API Integration</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Features */}
      <Card>
        <CardHeader>
          <CardTitle>Project Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <h4 className="font-medium">{feature.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Built with modern, industry-standard technologies for optimal performance and maintainability:
          </p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">v1.0.0</div>
              <div className="text-sm text-muted-foreground">Current Version</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">12+</div>
              <div className="text-sm text-muted-foreground">Supported Currencies</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">2025</div>
              <div className="text-sm text-muted-foreground">Development Year</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
