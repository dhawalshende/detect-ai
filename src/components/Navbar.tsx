import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1200px,calc(100%-2rem))]">
      <div className="glass-strong rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between glow-soft">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how" className="hover:text-primary transition-colors">How it works</a>
          <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-soft">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
