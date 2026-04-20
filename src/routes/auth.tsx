import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ScanLine, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function getFirebaseErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "This email is already registered. Try logging in.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/invalid-credential": "Invalid email or password.",
  };
  return messages[code] ?? "Something went wrong. Please try again.";
}

function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (tab === "signup" && password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (tab === "signup" && password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (tab === "login") {
        await signInWithEmail(email, password);
        toast.success("Welcome back!");
      } else {
        await signUpWithEmail(email, password, name);
        toast.success("Account created! Welcome to DETECTAI.");
      }
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      toast.error(getFirebaseErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google!");
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      toast.error(getFirebaseErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  // Show a spinner while Firebase is resolving auth state (prevents blank/flash)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If already logged in, redirect is happening via useEffect — show nothing briefly
  if (user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left showcase panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center" style={{ background: "#0A0A0F" }}>
        {/* Animated grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0,210,211,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,211,0.07) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          animation: "gridMove 8s linear infinite",
        }} />

        {/* Ambient glow */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,210,211,0.10) 0%, transparent 70%)",
        }} />

        {/* DETECTAI branding */}
        <div className="absolute top-8 left-8 flex items-center gap-2 z-20">
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #00D2D3, #0078d7)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ScanLine className="h-4 w-4 text-white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#fff", letterSpacing: 1 }}>
            DETECT<span style={{ color: "#00D2D3" }}>AI</span>
          </span>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">

          {/* ── Radar Scanner ── */}
          <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>

            {/* Outer rotating dashed ring */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "1.5px dashed rgba(0,210,211,0.5)",
              animation: "spinSlow 12s linear infinite",
            }} />

            {/* Middle pulsing glow ring */}
            <div style={{
              position: "absolute", inset: 20, borderRadius: "50%",
              border: "1px solid rgba(0,210,211,0.3)",
              boxShadow: "0 0 24px rgba(0,210,211,0.25), inset 0 0 24px rgba(0,210,211,0.08)",
              animation: "pulseRing 3s ease-in-out infinite",
            }} />

            {/* Inner circle with circuit pattern */}
            <div style={{
              position: "absolute", inset: 44, borderRadius: "50%",
              background: "radial-gradient(circle at 40% 40%, #111827, #0A0A0F)",
              border: "1px solid rgba(0,210,211,0.2)",
              overflow: "hidden",
            }}>
              {/* Circuit line decoration */}
              <svg width="100%" height="100%" viewBox="0 0 192 192" style={{ opacity: 0.25 }}>
                <line x1="96" y1="20" x2="96" y2="172" stroke="#00D2D3" strokeWidth="0.8"/>
                <line x1="20" y1="96" x2="172" y2="96" stroke="#00D2D3" strokeWidth="0.8"/>
                <circle cx="96" cy="96" r="30" stroke="#00D2D3" strokeWidth="0.8" fill="none"/>
                <circle cx="96" cy="96" r="55" stroke="#00D2D3" strokeWidth="0.5" fill="none" strokeDasharray="4 8"/>
                <circle cx="96" cy="40" r="3" fill="#00D2D3"/>
                <circle cx="96" cy="152" r="3" fill="#00D2D3"/>
                <circle cx="40" cy="96" r="3" fill="#00D2D3"/>
                <circle cx="152" cy="96" r="3" fill="#00D2D3"/>
              </svg>

              {/* Radar sweep */}
              <div style={{
                position: "absolute", inset: 0,
                borderRadius: "50%",
                background: "conic-gradient(from 0deg, transparent 0deg, rgba(0,210,211,0.18) 30deg, transparent 60deg)",
                animation: "radarSweep 3s linear infinite",
              }} />

              {/* Center dot */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: 8, height: 8, borderRadius: "50%",
                background: "#00D2D3",
                boxShadow: "0 0 10px #00D2D3",
              }} />
            </div>

            {/* ── Floating Defect Cards ── */}

            {/* Card 1: CRITICAL — top left */}
            <div style={{
              position: "absolute", top: -20, left: -120,
              background: "rgba(10,10,15,0.92)",
              border: "1px solid rgba(239,68,68,0.5)",
              borderRadius: 12, padding: "10px 14px",
              boxShadow: "0 0 16px rgba(239,68,68,0.25)",
              minWidth: 150,
              animation: "float1 4s ease-in-out infinite",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: 1,
                  color: "#ef4444", background: "rgba(239,68,68,0.15)",
                  borderRadius: 4, padding: "2px 6px",
                }}>CRITICAL</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>Crack Detected</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>91% confidence</div>
            </div>

            {/* Card 2: MAJOR — right */}
            <div style={{
              position: "absolute", top: 80, right: -140,
              background: "rgba(10,10,15,0.92)",
              border: "1px solid rgba(245,158,11,0.5)",
              borderRadius: 12, padding: "10px 14px",
              boxShadow: "0 0 16px rgba(245,158,11,0.20)",
              minWidth: 155,
              animation: "float2 5s ease-in-out infinite",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: 1,
                  color: "#f59e0b", background: "rgba(245,158,11,0.15)",
                  borderRadius: 4, padding: "2px 6px",
                }}>MAJOR</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>Corrosion Found</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>83% confidence</div>
            </div>

            {/* Card 3: PASSED — bottom left */}
            <div style={{
              position: "absolute", bottom: -30, left: -110,
              background: "rgba(10,10,15,0.92)",
              border: "1px solid rgba(34,197,94,0.5)",
              borderRadius: 12, padding: "10px 14px",
              boxShadow: "0 0 16px rgba(34,197,94,0.20)",
              minWidth: 150,
              animation: "float3 4.5s ease-in-out infinite",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: 1,
                  color: "#22c55e", background: "rgba(34,197,94,0.15)",
                  borderRadius: 4, padding: "2px 6px",
                }}>PASSED</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>No Defects</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>98% confidence</div>
            </div>
          </div>

          {/* Bottom text */}
          <div className="mt-16 text-center px-8">
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>
              AI-Powered Inspection
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>
              Real-time defect detection for industrial products
            </div>

            {/* Stat pills */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
              {[">90% Accuracy", "< 1 min Analysis", "Real AI Vision"].map((s) => (
                <span key={s} style={{
                  fontSize: 11, color: "#00D2D3",
                  background: "rgba(0,210,211,0.08)",
                  border: "1px solid rgba(0,210,211,0.2)",
                  borderRadius: 20, padding: "4px 12px",
                  fontFamily: "monospace",
                }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-8 text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>
          DETECTAI © 2025 — Quality first
        </div>

        {/* CSS Keyframes */}
        <style>{`
          @keyframes gridMove {
            0% { background-position: 0 0; }
            100% { background-position: 48px 48px; }
          }
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes radarSweep {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulseRing {
            0%, 100% { opacity: 0.6; box-shadow: 0 0 16px rgba(0,210,211,0.2), inset 0 0 16px rgba(0,210,211,0.06); }
            50% { opacity: 1; box-shadow: 0 0 32px rgba(0,210,211,0.45), inset 0 0 24px rgba(0,210,211,0.12); }
          }
          @keyframes float1 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes float2 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes float3 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
        `}</style>
      </div>


      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <div className="lg:hidden mb-8"><Logo /></div>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome to DETECT<span className="text-primary">AI</span></h1>
            <p className="text-muted-foreground mt-2 text-sm">Sign in to access your inspection workspace.</p>
          </div>

          {/* Tabs */}
          <div className="glass rounded-xl p-1 flex mb-6 relative">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2.5 text-sm font-medium relative z-10 transition-colors"
              >
                <span className={tab === t ? "text-primary-foreground" : "text-muted-foreground"}>
                  {t === "login" ? "Login" : "Sign Up"}
                </span>
              </button>
            ))}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-1 bottom-1 w-1/2 rounded-lg bg-primary glow-soft"
              style={{ left: tab === "login" ? "0.25rem" : "calc(50% - 0.25rem)" }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={tab}
              initial={{ opacity: 0, x: tab === "login" ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tab === "login" ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {tab === "signup" && (
                <Field icon={User} label="Full Name" type="text" placeholder="Maya Chen"
                  value={name} onChange={(v) => setName(v)} />
              )}
              <Field icon={Mail} label="Email" type="email" placeholder="you@factory.com"
                value={email} onChange={(v) => setEmail(v)} />
              <Field icon={Lock} label="Password" type="password" placeholder="••••••••"
                value={password} onChange={(v) => setPassword(v)} />
              {tab === "signup" && (
                <Field icon={Lock} label="Confirm Password" type="password" placeholder="••••••••"
                  value={confirm} onChange={(v) => setConfirm(v)} />
              )}

              {tab === "login" && (
                <div className="text-right">
                  <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-soft h-11"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {tab === "login" ? "Login" : "Create Account"}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-3 text-muted-foreground">or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={handleGoogle}
                className="w-full rounded-lg h-11 glass"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.77.42 3.44 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon, label, type, placeholder, value, onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="pl-10 h-11 bg-input/50 border-border focus-visible:ring-primary focus-visible:border-primary transition-all"
        />
      </div>
    </div>
  );
}
