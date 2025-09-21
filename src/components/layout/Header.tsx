import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BookOpen, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="gradient-primary p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gradient">StudyBolt</span>
              <span className="text-xs text-muted-foreground hidden sm:block">AI Study Assistant</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-fast">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-fast">
              Pricing
            </a>
            <a href="#docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-fast">
              Docs
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth/signin")}>
              Sign In
            </Button>
            <Button variant="hero" size="sm" className="shadow-subtle hover:shadow-glow" onClick={() => navigate("/auth/signup")}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};