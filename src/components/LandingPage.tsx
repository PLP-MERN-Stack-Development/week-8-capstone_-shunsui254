import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Shield, 
  Smartphone, 
  Globe, 
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Target,
  PieChart,
  MessageCircle
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Multi-Currency Support",
      description: "Handle 12+ major currencies with real-time exchange rates and automatic conversion.",
      color: "text-blue-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-time Updates",
      description: "Live exchange rates with smart caching and offline support for uninterrupted tracking.",
      color: "text-yellow-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Your financial data stays local with enterprise-grade security and encryption.",
      color: "text-green-500"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Responsive",
      description: "Perfect experience across desktop, tablet, and mobile devices with native feel.",
      color: "text-purple-500"
    },
    {
      icon: <PieChart className="h-8 w-8" />,
      title: "Smart Analytics",
      description: "Powerful insights and visualizations to understand your spending patterns.",
      color: "text-orange-500"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Goal Tracking",
      description: "Set and achieve financial goals with intelligent tracking and notifications.",
      color: "text-red-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      content: "MyBudgeteer transformed how I manage my finances across multiple currencies. The real-time exchange rates are a game-changer!",
      rating: 5
    },
    {
      name: "Marcus Chen",
      role: "Digital Nomad",
      content: "Finally, a financial tracking app that understands my multi-currency lifestyle. Clean interface and powerful features.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      content: "The analytics dashboard gives me insights I never had before. Highly recommend for anyone serious about financial tracking.",
      rating: 5
    }
  ];

  const handleGetStarted = () => {
    window.location.href = "/login";
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would subscribe the user to updates
    alert("Thanks for your interest! We'll keep you updated on new features.");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-all duration-300">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 transition-colors duration-300 hover:bg-primary/20">
              <DollarSign className="h-6 w-6 text-primary transition-transform duration-300 hover:rotate-12" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">MyBudgeteer</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button onClick={handleGetStarted} className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className={`container mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge variant="secondary" className="mb-4 animate-pulse">
            ✨ Multi-Currency Financial Tracking Made Simple
          </Badge>
          
          <h1 className={`text-4xl md:text-6xl font-bold text-foreground mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Take Control of Your
            <span className="block text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent animate-pulse">Financial Future</span>
          </h1>
          
          <p className={`text-xl text-muted-foreground mb-8 max-w-2xl mx-auto transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            A modern, intuitive financial tracking app with real-time currency conversion, 
            powerful analytics, and smart insights to help you achieve your financial goals.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Button size="lg" onClick={handleGetStarted} className="px-8 group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25">
              Start Tracking Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="group transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <MessageCircle className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              Contact Cecil
            </Button>
          </div>
          
          <div className={`flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
              <CheckCircle className="h-4 w-4 text-green-500 animate-pulse" />
              Free to use
            </div>
            <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
              <CheckCircle className="h-4 w-4 text-green-500 animate-pulse" />
              No credit card required
            </div>
            <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
              <CheckCircle className="h-4 w-4 text-green-500 animate-pulse" />
              12+ currencies
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Track Finances Smarter
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with modern technologies and designed for real-world financial management
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`p-6 hover:shadow-lg transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100 + 1000}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className={`p-3 rounded-lg bg-muted/50 w-fit ${feature.color} transition-all duration-300 hover:scale-110 hover:rotate-6`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl transition-colors duration-300 hover:text-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div className={`transition-all duration-700 hover:scale-110 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '1800ms' }}>
              <div className="text-4xl font-bold text-primary mb-2 transition-all duration-300 hover:scale-125">12+</div>
              <div className="text-muted-foreground">Supported Currencies</div>
            </div>
            <div className={`transition-all duration-700 hover:scale-110 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '1900ms' }}>
              <div className="text-4xl font-bold text-primary mb-2 transition-all duration-300 hover:scale-125">99.9%</div>
              <div className="text-muted-foreground">Uptime Reliability</div>
            </div>
            <div className={`transition-all duration-700 hover:scale-110 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '2000ms' }}>
              <div className="text-4xl font-bold text-primary mb-2 transition-all duration-300 hover:scale-125">Real-time</div>
              <div className="text-muted-foreground">Exchange Rates</div>
            </div>
            <div className={`transition-all duration-700 hover:scale-110 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '2100ms' }}>
              <div className="text-4xl font-bold text-primary mb-2 transition-all duration-300 hover:scale-125">100%</div>
              <div className="text-muted-foreground">Privacy Focused</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Loved by Users Worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See what people are saying about MyBudgeteer
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className={`p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150 + 2200}ms` }}
              >
                <CardContent>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-5 w-5 fill-yellow-400 text-yellow-400 transition-transform duration-300 hover:scale-125" 
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold transition-colors duration-300 hover:text-primary">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Developer Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className={`max-w-4xl mx-auto transition-all duration-700 hover:shadow-xl ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '2600ms' }}>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4 transition-colors duration-300 hover:text-primary">Meet Cecil Bezalel</CardTitle>
              <p className="text-muted-foreground">The Developer Behind MyBudgeteer</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary/20">
                  <span className="text-primary font-bold text-3xl">CB</span>
                </div>
              </div>
              
              <div className="space-y-4 text-center max-w-3xl mx-auto">
                <p className="text-muted-foreground leading-relaxed">
                  Hi there! I'm Cecil Bezalel, and I pour my heart into creating tools that simplify life. 
                  With a knack for modern web technologies and a real-world grasp of money matters, 
                  I've crafted MyBudgeteer to be your new financial tracking best friend.
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  I totally get it—financial tracking can feel like a chore. That's why I've made MyBudgeteer as 
                  intuitive and user-friendly as possible. It's like having a financial advisor tucked 
                  right in your pocket, minus the steep fees.
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  <Badge variant="secondary" className="transition-all duration-300 hover:scale-105 hover:bg-primary/20">React Expert</Badge>
                  <Badge variant="secondary" className="transition-all duration-300 hover:scale-105 hover:bg-primary/20">TypeScript</Badge>
                  <Badge variant="secondary" className="transition-all duration-300 hover:scale-105 hover:bg-primary/20">UI/UX Design</Badge>
                  <Badge variant="secondary" className="transition-all duration-300 hover:scale-105 hover:bg-primary/20">Financial Tech</Badge>
                  <Badge variant="secondary" className="transition-all duration-300 hover:scale-105 hover:bg-primary/20">API Integration</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className={`container mx-auto text-center transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '2800ms' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 transition-colors duration-300 hover:text-primary">
            Ready to Transform Your Financial Tracking Experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who have taken control of their finances with MyBudgeteer
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="px-8 group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
          
          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email for updates"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background transition-all duration-300 focus:scale-105 focus:ring-2 focus:ring-primary/50"
                required
              />
              <Button type="submit" variant="outline" className="transition-all duration-300 hover:scale-105">
                Subscribe
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-card">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0 transition-transform duration-300 hover:scale-105">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 transition-colors duration-300 hover:bg-primary/20">
                <DollarSign className="h-5 w-5 text-primary transition-transform duration-300 hover:rotate-12" />
              </div>
              <span className="text-xl font-bold">MyBudgeteer</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground mb-2">
                Created with ❤️ by Cecil Bezalel
              </p>
              <div className="flex items-center justify-center md:justify-end gap-4 text-sm text-muted-foreground">
                <a href="mailto:Cecilbezalel@gmail.com" className="hover:text-primary transition-all duration-300 hover:scale-105">
                  Cecilbezalel@gmail.com
                </a>
                <a href="https://github.com/shunsui254" className="hover:text-primary transition-all duration-300 hover:scale-105">
                  GitHub
                </a>
                <a href="https://wa.me/254799350952" className="hover:text-primary transition-all duration-300 hover:scale-105">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 MyBudgeteer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
