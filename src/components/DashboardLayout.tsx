import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ScanLine,
  History,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  Loader2,
} from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inspect", label: "New Inspection", icon: ScanLine },
  { to: "/history", label: "History", icon: History },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }
  return (email?.[0] ?? "U").toUpperCase();
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  // Auth guard — redirect to /auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  // While Firebase is resolving the initial auth state, show a brief spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-mono">Authenticating…</p>
        </div>
      </div>
    );
  }

  // Auth resolved but no user — navigate() is called in useEffect above, render null briefly
  if (!user) return null;

  const displayName = user.displayName || user.email?.split("@")[0] || "User";
  const displayEmail = user.email ?? "";
  const initials = getInitials(user.displayName, user.email);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-64 z-40 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-5 border-b border-sidebar-border">
          <Logo />
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              location.pathname === item.to ||
              (item.to !== "/dashboard" && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                  active
                    ? "bg-primary/10 text-primary glow-soft"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                {active && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-primary" />}
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
            <Avatar className="h-9 w-9 ring-2 ring-primary/30 shrink-0">
              {user.photoURL && <AvatarImage src={user.photoURL} alt={displayName} />}
              <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{displayName}</div>
              <div className="text-xs text-muted-foreground truncate">{displayEmail}</div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="shrink-0 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="flex-1 min-w-0">
        <div className="lg:hidden sticky top-0 z-20 flex items-center justify-between p-4 bg-background/80 backdrop-blur border-b border-border">
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
