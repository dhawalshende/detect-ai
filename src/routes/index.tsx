import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ScanLine, ShieldCheck, FileBarChart, Upload, Cpu, Eye, FileText, ArrowRight, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  { icon: ScanLine, title: "Instant Detection", desc: "Sub-second AI inference identifies cracks, scratches, corrosion and missing components." },
  { icon: ShieldCheck, title: "Severity Classification", desc: "Three-tier triage — Critical, Major, Minor — for rapid accept/review/reject decisions." },
  { icon: FileBarChart, title: "Detailed Reports", desc: "Audit-ready PDF reports with bounding boxes, confidence scores and explanations." },
];

const steps = [
  { icon: Upload, title: "Upload", desc: "Drop product image" },
  { icon: ScanLine, title: "Scan", desc: "AI inspects pixels" },
  { icon: Cpu, title: "Analyze", desc: "Classify severity" },
  { icon: FileText, title: "Report", desc: "Export PDF" },
];

/* ═══════════════════════════════════════════════════════════
   PREMIUM INSPECTION SHOWCASE — right side of hero
   ═══════════════════════════════════════════════════════════ */
function InspectionShowcase() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 580, margin: "0 auto" }}>

      {/* ── Floating card 1 — CRITICAL  (top-left) ── */}
      <div style={{
        position: "absolute", top: -20, left: -40, zIndex: 20,
        background: "rgba(10,10,20,0.92)",
        backdropFilter: "blur(12px)",
        borderLeft: "3px solid #ef4444",
        border: "1px solid rgba(239,68,68,0.3)",
        borderLeftWidth: 3, borderLeftColor: "#ef4444",
        borderRadius: 12, padding: "10px 14px",
        boxShadow: "0 0 20px rgba(239,68,68,0.15)",
        animation: "heroFloat 3s ease-in-out infinite",
        animationDelay: "0s",
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>
          🔴 Crack Detected
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>
          Confidence: 91%
        </div>
      </div>

      {/* ── Floating card 2 — MAJOR  (right) ── */}
      <div style={{
        position: "absolute", right: -50, top: "40%", zIndex: 20,
        background: "rgba(10,10,20,0.92)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(245,158,11,0.3)",
        borderLeftWidth: 3, borderLeftColor: "#f59e0b",
        borderRadius: 12, padding: "10px 14px",
        boxShadow: "0 0 20px rgba(245,158,11,0.15)",
        animation: "heroFloat 3s ease-in-out infinite",
        animationDelay: "1s",
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>
          🟡 Corrosion
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>
          Severity: Major
        </div>
      </div>

      {/* ── Floating card 3 — PASSED  (bottom-left) ── */}
      <div style={{
        position: "absolute", bottom: 60, left: -30, zIndex: 20,
        background: "rgba(10,10,20,0.92)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(34,197,94,0.3)",
        borderLeftWidth: 3, borderLeftColor: "#22c55e",
        borderRadius: 12, padding: "10px 14px",
        boxShadow: "0 0 20px rgba(34,197,94,0.15)",
        animation: "heroFloat 3s ease-in-out infinite",
        animationDelay: "2s",
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>
          ✅ Component OK
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>
          Passed
        </div>
      </div>

      {/* ══════ MAIN CARD ══════ */}
      <div style={{
        position: "relative", zIndex: 10,
        width: 400,
        margin: "0 auto",
        background: "rgba(10,10,20,0.9)",
        border: "1px solid rgba(0,212,255,0.4)",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 0 60px rgba(0,212,255,0.15), 0 24px 80px rgba(0,0,0,0.5)",
      }}>

        {/* Card header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid rgba(0,212,255,0.2)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: "linear-gradient(135deg, #00D2D3, #0078d7)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ScanLine style={{ width: 13, height: 13, color: "#fff" }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", letterSpacing: 0.3 }}>
              DETECTAI Vision Model
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px #22c55e",
              animation: "livePulse 2s ease-in-out infinite",
            }} />
            <span style={{ fontSize: 11, color: "#22c55e", fontFamily: "monospace" }}>Analyzing...</span>
          </div>
        </div>

        {/* Image/scan area */}
        <div style={{ position: "relative", padding: "14px 14px 0" }}>
          <div style={{
            position: "relative",
            height: 210,
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.06)",
            /* Circuit pattern background */
            background: `
              radial-gradient(circle at 25% 25%, rgba(0,212,255,0.06) 0%, transparent 40%),
              radial-gradient(circle at 75% 75%, rgba(0,212,255,0.04) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(0,212,255,0.03) 0%, transparent 60%),
              linear-gradient(135deg, #0d1117, #111827)
            `,
          }}>
            {/* Fine grid */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }} />

            {/* Circuit dots */}
            {[[60, 40], [180, 50], [100, 130], [260, 110], [200, 170], [320, 80], [40, 160], [280, 165]].map(([x, y], i) => (
              <div key={i} style={{
                position: "absolute", left: x, top: y,
                width: 3, height: 3, borderRadius: "50%",
                background: "rgba(0,212,255,0.2)",
              }} />
            ))}

            {/* Scan line */}
            <div style={{
              position: "absolute", left: 0, right: 0,
              height: 2,
              background: "linear-gradient(90deg, transparent 0%, #00D4FF 30%, #00D4FF 70%, transparent 100%)",
              boxShadow: "0 0 16px rgba(0,212,255,0.6), 0 0 40px rgba(0,212,255,0.25)",
              animation: "scanLine 3s linear infinite",
            }} />

            {/* Bounding box 1 — red (crack) */}
            <div style={{
              position: "absolute", top: 35, left: 40,
              width: 95, height: 60,
              borderRadius: 4,
              animation: "boxAppear 3s 1s ease-out both, dashMove 1.5s linear infinite",
              overflow: "visible",
            }}>
              <svg style={{ position: "absolute", inset: -1, width: "calc(100% + 2px)", height: "calc(100% + 2px)" }}>
                <rect x="1" y="1" width="93" height="58" rx="4" ry="4"
                  fill="none" stroke="#ef4444" strokeWidth="1.5"
                  strokeDasharray="8 5"
                  style={{ filter: "drop-shadow(0 0 4px rgba(239,68,68,0.5))" }}
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="-26" dur="1.2s" repeatCount="indefinite" />
                </rect>
              </svg>
              <span style={{
                position: "absolute", top: -20, left: -1,
                fontSize: 10, fontWeight: 700,
                color: "#ef4444",
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.4)",
                borderRadius: 4, padding: "1px 6px",
                fontFamily: "monospace", whiteSpace: "nowrap",
              }}>Crack 91%</span>
            </div>

            {/* Bounding box 2 — amber (corrosion) */}
            <div style={{
              position: "absolute", top: 105, right: 40,
              width: 80, height: 65,
              borderRadius: 4,
              animation: "boxAppear 3s 1.8s ease-out both",
              overflow: "visible",
            }}>
              <svg style={{ position: "absolute", inset: -1, width: "calc(100% + 2px)", height: "calc(100% + 2px)" }}>
                <rect x="1" y="1" width="78" height="63" rx="4" ry="4"
                  fill="none" stroke="#f59e0b" strokeWidth="1.5"
                  strokeDasharray="8 5"
                  style={{ filter: "drop-shadow(0 0 4px rgba(245,158,11,0.5))" }}
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="-26" dur="1.4s" repeatCount="indefinite" />
                </rect>
              </svg>
              <span style={{
                position: "absolute", top: -20, left: -1,
                fontSize: 10, fontWeight: 700,
                color: "#f59e0b",
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.4)",
                borderRadius: 4, padding: "1px 6px",
                fontFamily: "monospace", whiteSpace: "nowrap",
              }}>Corrosion 83%</span>
            </div>
          </div>
        </div>

        {/* Bottom — progress + badges */}
        <div style={{ padding: "14px 18px 16px" }}>
          {/* AI Analysis progress bar */}
          <div style={{ marginBottom: 12 }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6,
            }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: 0.5 }}>
                AI Analysis
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#00D2D3", fontFamily: "monospace" }}>
                78%
              </span>
            </div>
            <div style={{
              width: "100%", height: 5, borderRadius: 4,
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}>
              <div style={{
                width: "78%", height: "100%", borderRadius: 4,
                background: "linear-gradient(90deg, #00D2D3, #0078d7)",
                boxShadow: "0 0 8px rgba(0,212,255,0.4)",
                animation: "progressGlow 2s ease-in-out infinite",
              }} />
            </div>
          </div>

          {/* Result badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 11, fontWeight: 700, fontFamily: "monospace",
              color: "#ef4444", background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.35)",
              borderRadius: 20, padding: "4px 12px", letterSpacing: 0.5,
            }}>REJECT</span>
            <span style={{
              fontSize: 11, fontWeight: 600, fontFamily: "monospace",
              color: "#f59e0b", background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.25)",
              borderRadius: 20, padding: "4px 12px",
            }}>Score: 34/100</span>
            <span style={{
              fontSize: 11, fontWeight: 600, fontFamily: "monospace",
              color: "#ef4444", background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 20, padding: "4px 12px",
            }}>2 Defects</span>
          </div>
        </div>
      </div>

      {/* Stat pills below card */}
      <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "center", flexWrap: "wrap" }}>
        {[">90% Accuracy", "< 1 min", "Real AI"].map((s) => (
          <span key={s} style={{
            fontSize: 11, color: "#00D2D3", fontFamily: "monospace", fontWeight: 600,
            background: "rgba(0,210,211,0.08)",
            border: "1px solid rgba(0,210,211,0.2)",
            borderRadius: 20, padding: "5px 14px",
          }}>{s}</span>
        ))}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes scanLine {
          0%   { top: -2px; }
          100% { top: calc(100% + 2px); }
        }
        @keyframes boxAppear {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #22c55e; }
          50%       { opacity: 0.4; box-shadow: 0 0 14px #22c55e; }
        }
        @keyframes progressGlow {
          0%, 100% { box-shadow: 0 0 6px rgba(0,212,255,0.3); }
          50%       { box-shadow: 0 0 14px rgba(0,212,255,0.6); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════════ */
function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative" style={{ padding: "100px 60px 60px" }}>
        <div className="absolute inset-0 grid-bg grid-bg-fade pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />
        {/* Radial glow behind right component */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 70% 50%, rgba(0,212,255,0.05) 0%, transparent 60%)",
        }} />

        <div className="relative max-w-7xl mx-auto">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", minHeight: 520 }}
            className="hero-grid"
          >

            {/* Left — text */}
            <div style={{ maxWidth: 520 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-primary mb-6 w-fit"
              >
                <Zap className="h-3.5 w-3.5" /> Industrial-grade AI vision
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.08]"
              >
                <span className="text-gradient-cyan">AI-Powered</span>
                <br />
                Industrial<br />Quality Inspection
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-6 text-base text-muted-foreground leading-relaxed"
                style={{ maxWidth: 460 }}
              >
                A web-based AI system that automatically detects defects in product images,
                classifies severity, visually explains results, and generates an inspection report.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary px-7">
                  <Link to="/inspect">
                    Start Inspecting <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <a
                  href="#how"
                  className="hero-outline-btn"
                  style={{
                    display: "inline-flex", alignItems: "center",
                    padding: "10px 28px",
                    border: "1px solid #00D4FF",
                    borderRadius: 9999,
                    color: "#fff",
                    background: "transparent",
                    fontSize: 15, fontWeight: 500,
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  See How It Works
                </a>
              </motion.div>
            </div>

            {/* Right — animated showcase */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              style={{ maxWidth: 580, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <InspectionShowcase />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div style={{
        borderTop: "1px solid rgba(0,212,255,0.15)",
        borderBottom: "1px solid rgba(0,212,255,0.15)",
        background: "rgba(0,210,211,0.03)",
        padding: "24px 16px",
      }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0">
          {[
            { value: "PDF", label: "Export Ready" },
            { value: ">90%", label: "Accuracy" },
            { value: "< 1 min", label: "Analysis" },
            { value: "3", label: "Severity Levels" },
          ].map((s, i, arr) => (
            <div
              key={s.label}
              className="text-center py-2"
              style={{
                borderRight: i < arr.length - 1 ? "1px solid rgba(0,212,255,0.12)" : "none",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: "#00D2D3", fontFamily: "monospace", lineHeight: 1.1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature cards ── */}
      <section className="pt-20 pb-8 px-4">
        <div id="features" className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5" style={{ scrollMarginTop: "96px" }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-6 hover:glow-soft hover:border-primary/40 transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="pt-8 pb-24 px-4" style={{ scrollMarginTop: "96px" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Workflow</div>
            <h2 className="text-4xl md:text-5xl font-bold">How it works</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">From raw image to inspector-ready verdict in four steps.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-5 relative">
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="relative mx-auto h-24 w-24 rounded-2xl glass flex items-center justify-center mb-4 glow-soft">
                  <s.icon className="h-9 w-9 text-primary" />
                  <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center font-mono">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto glass-strong rounded-3xl p-10 md:p-16 text-center glow-soft relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

          {/* Animated radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(circle at 50% 50%, rgba(0,212,255,0.1) 0%, transparent 60%)",
            animation: "pulseGlow 4s ease-in-out infinite",
          }} />

          {/* Floating stat numbers */}
          <div className="absolute top-6 left-8 text-[10px] font-mono text-primary/60 border border-primary/20 rounded-md px-2 py-1 bg-primary/5">
            Visual Results Explained
          </div>
          <div className="absolute top-6 right-8 text-[10px] font-mono text-primary/60 border border-primary/20 rounded-md px-2 py-1 bg-primary/5">
            &gt; 90% Accuracy
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-primary/60 border border-primary/20 rounded-md px-2 py-1 bg-primary/5">
            &lt; 1 minute Analysis
          </div>

          <div className="relative">
            <div className="mb-6 relative inline-block">
              <Eye className="h-14 w-14 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to elevate your QA?</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join the inspectors who trust DETECTAI on the line.
            </p>

            <div className="flex flex-col items-center gap-6">
              <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary px-10 h-14 text-lg">
                <Link to="/auth">Get Started Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>

              {/* Trust pills */}
              <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="text-primary">✓</span> Auto Defect Detection</span>
                <span className="flex items-center gap-1.5"><span className="text-primary">✓</span> Instant Severity Analysis</span>
                <span className="flex items-center gap-1.5"><span className="text-primary">✓</span> Real AI vision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Keyframe */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>

      <footer className="border-t border-border pt-0 pb-10 overflow-hidden">
        {/* Technical Marquee Strip */}
        <div className="relative py-4 bg-primary/5 border-b border-border/50 mb-10 group">
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-background via-transparent to-background" />
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="flex whitespace-nowrap gap-12 text-[10px] font-mono tracking-widest text-primary/60 uppercase"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="flex gap-12">
                <span>PRECISION ANALYSIS</span>
                <span className="opacity-40">•</span>
                <span>REAL-TIME DEFECT DETECTION</span>
                <span className="opacity-40">•</span>
                <span>&gt;90% VISION ACCURACY</span>
                <span className="opacity-40">•</span>
                <span>INDUSTRIAL GRADE AI</span>
                <span className="opacity-40">•</span>
                <span>LOW LATENCY PIPELINE</span>
                <span className="opacity-40">•</span>
                <span>EDGE COMPUTING ENABLED</span>
                <span className="opacity-40 font-bold">///</span>
              </span>
            ))}
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground glow-soft">
              <ScanLine className="h-4 w-4" />
            </div>
            <span className="font-semibold text-lg tracking-tight">DETECT<span className="text-primary">AI</span></span>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">
              Autonomous Inspection Node v2.5.0
            </div>
            <div className="text-xs text-muted-foreground/60 font-mono">
              © 2025 DETECTAI VISION LABS • ALL RIGHTS RESERVED
            </div>
          </div>
        </div>
      </footer>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }
          .hero-grid > div:first-child {
            max-width: 100% !important;
            margin: 0 auto;
          }
          .hero-grid > div:last-child {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
