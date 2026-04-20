import { ScanEye } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 rounded-lg bg-primary/30 blur-md group-hover:bg-primary/50 transition-colors" />
        <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground glow-soft">
          <ScanEye className="h-5 w-5" />
        </div>
      </div>
      <span className="font-bold text-lg tracking-tight">
        DETECT<span className="text-gradient-cyan">AI</span>
      </span>
    </Link>
  );
}
