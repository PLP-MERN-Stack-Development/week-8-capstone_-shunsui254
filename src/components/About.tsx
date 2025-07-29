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
        <p className="text-muted-foreground mt-2">
          A modern financial management solution crafted with precision and care
        </p>
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
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">CB</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Cecil Bezalel</h3>
                <p className="text-muted-foreground">Full-Stack Developer & Financial Tech Enthusiast</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Hi there! I'm Cecil Bezalel, and I pour my heart into creating tools that simplify life. With a knack for modern web technologies and a real-world grasp of money matters, I've crafted MyBudgeteer to be your new budgeting best friend.
              </p>
              
              <p>
                I totally get it—budgeting can feel like a chore. That's why I've made MyBudgeteer as intuitive and user-friendly as possible. It's like having a financial advisor tucked right in your pocket, minus the steep fees. And it's not just easy; it's efficient too. I've obsessed over every detail so you can breeze through your budgeting tasks and get back to the things that light you up.
              </p>
              
              <p>
                When I'm not coding, I'm out exploring hiking trails or savoring a cup of coffee at my favorite local spot. I believe a great budget shouldn't tie you down—it should set you free to enjoy what you love. With MyBudgeteer, you're not just getting a tool; you're gaining a partner in financial wellness. My passion and know-how are woven into every feature, so you can trust that your financial journey is in caring, capable hands.
              </p>
              
              <p className="font-medium text-foreground">
                Ready to take control of your finances with ease? Give MyBudgeteer a try and see how it can transform your budgeting experience.
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
