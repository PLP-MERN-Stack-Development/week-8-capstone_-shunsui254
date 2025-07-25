import { Heart, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Developer Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Crafted with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by</span>
            <span className="font-semibold text-foreground">Cecil Bezalel</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => window.open("https://github.com/cecilbezalel", "_blank")}
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => window.open("https://linkedin.com/in/cecilbezalel", "_blank")}
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => window.open("mailto:cecil.bezalel@gmail.com", "_blank")}
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </Button>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MyBudgeteer. All rights reserved.
          </div>
        </div>

        {/* Project Info */}
        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            MyBudgeteer v1.0.0 - A modern multi-currency budgeting application
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Built with React, TypeScript, Tailwind CSS, and real-time exchange rate APIs
          </p>
        </div>
      </div>
    </footer>
  );
};
