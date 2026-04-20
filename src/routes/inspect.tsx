import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  ScanLine,
  CheckCircle2,
  FileImage,
  X,
  AlertTriangle,
  XCircle,
  Download,
  ArrowRight,
  Sparkles,
  Cpu,
  FileText,
  Loader2,
  CircleCheck,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DefectOverlay } from "@/components/DefectOverlay";
import { SEVERITY_COLOR, DECISION_COLOR } from "@/lib/demo-data";
import { analyzeImage, mapToDefects, type GeminiResult } from "@/lib/gemini";
import { saveInspection } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/inspect")({
  component: InspectPage,
});

type Step = 1 | 2 | 3;

const SCAN_STEPS = [
  "Image loaded & validated",
  "Preprocessing image data",
  "Running DETECTAI Vision model",
  "Classifying defect severity",
  "Generating inspection report",
];

const SAMPLE =
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80";

/** Converts a remote image URL to a base64 data URL so Gemini can process it */
async function urlToBase64(url: string): Promise<{ dataUrl: string; mimeType: string }> {
  const response = await fetch(url);
  const blob = await response.blob();
  const mimeType = blob.type || "image/jpeg";
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ dataUrl: reader.result as string, mimeType });
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function InspectPage() {
  const [step, setStep] = useState<Step>(1);
  const [image, setImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");
  const [scanProgress, setScanProgress] = useState(0);
  const [geminiResult, setGeminiResult] = useState<GeminiResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [savedReportId, setSavedReportId] = useState<string | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFile = (file: File) => {
    setImageMimeType(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const useSample = async () => {
    setLoadingSample(true);
    try {
      const { dataUrl, mimeType } = await urlToBase64(SAMPLE);
      setImage(dataUrl);
      setImageMimeType(mimeType);
    } catch {
      toast.error("Failed to load sample image.");
    } finally {
      setLoadingSample(false);
    }
  };

  const startScan = () => {
    if (!image) return;
    setStep(2);
    setScanProgress(0);
    setGeminiResult(null);
    setAnalysisError(null);
    setSavedReportId(null);

    // Fire Gemini API call immediately (runs in parallel with animation)
    analyzeImage(image, imageMimeType)
      .then((result) => {
        setGeminiResult(result);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "AI analysis failed";
        setAnalysisError(msg);
        toast.error(msg);
        setStep(1);
      });
  };

  // Animate through first N-1 steps automatically on a timer
  useEffect(() => {
    if (step !== 2) return;
    let i = 0;
    const AUTO_UNTIL = SCAN_STEPS.length - 1; // Stop at last step — wait for Gemini

    const interval = setInterval(() => {
      i++;
      if (i < AUTO_UNTIL) {
        setScanProgress(i);
      } else {
        setScanProgress(AUTO_UNTIL);
        clearInterval(interval);
        // Step 5 "Generating report" stays active until Gemini responds
      }
    }, 700);
    return () => clearInterval(interval);
  }, [step]);

  // When Gemini result arrives AND animation has reached the last step → complete
  useEffect(() => {
    if (!geminiResult || step !== 2) return;
    if (scanProgress < SCAN_STEPS.length - 1) return; // Animation not caught up yet

    // Complete the final step and transition
    setScanProgress(SCAN_STEPS.length);
    setTimeout(() => setStep(3), 600);
  }, [geminiResult, scanProgress, step]);

  const reset = () => {
    setStep(1);
    setImage(null);
    setScanProgress(0);
    setGeminiResult(null);
    setAnalysisError(null);
    setSavedReportId(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { n: 1, label: "Upload", icon: Upload },
              { n: 2, label: "Scanning", icon: ScanLine },
              { n: 3, label: "Results", icon: FileText },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: step === s.n ? 1.1 : 1,
                      backgroundColor:
                        step >= s.n ? "var(--primary)" : "var(--muted)",
                    }}
                    className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center font-bold font-mono text-sm",
                      step >= s.n
                        ? "text-primary-foreground glow-soft"
                        : "text-muted-foreground",
                    )}
                  >
                    {step > s.n ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <s.icon className="h-5 w-5" />
                    )}
                  </motion.div>
                  <div
                    className={cn(
                      "text-xs mt-2 font-medium",
                      step >= s.n ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s.label}
                  </div>
                </div>
                {i < 2 && (
                  <div className="flex-1 h-0.5 mx-3 bg-muted relative -mt-6">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: step > s.n ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-primary glow-soft"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 1: Upload ── */}
          {step === 1 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
                }}
                onClick={() => !image && fileRef.current?.click()}
                className={cn(
                  "glass rounded-2xl p-8 md:p-16 text-center transition-all relative overflow-hidden",
                  !image &&
                    "cursor-pointer border-2 border-dashed border-primary/40 hover:border-primary hover:glow-soft",
                )}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                {!image ? (
                  <>
                    <div className="absolute inset-0 grid-bg opacity-20" />
                    <div className="relative">
                      <div className="mx-auto h-20 w-20 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-5 glow-soft">
                        <Upload className="h-9 w-9" />
                      </div>
                      <h3 className="text-xl font-semibold">Drop product image here</h3>
                      <p className="text-muted-foreground text-sm mt-2">
                        or click to browse from your device
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-5">
                        {["JPG", "PNG", "WEBP"].map((f) => (
                          <Badge
                            key={f}
                            variant="outline"
                            className="border-primary/30 text-primary font-mono text-xs"
                          >
                            {f}
                          </Badge>
                        ))}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          useSample();
                        }}
                        disabled={loadingSample}
                        className="mt-6 text-xs text-primary hover:underline inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingSample ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3" />
                        )}
                        {loadingSample ? "Loading sample…" : "Or try a sample image"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage(null);
                      }}
                      className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-danger hover:text-danger-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <img
                      src={image}
                      alt="Upload preview"
                      className="max-h-[400px] mx-auto rounded-xl glow-soft"
                    />
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => fileRef.current?.click()}
                        className="rounded-full"
                      >
                        <FileImage className="h-4 w-4 mr-1" /> Replace
                      </Button>
                      <Button
                        onClick={startScan}
                        size="lg"
                        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                      >
                        Start AI Inspection <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Scanning ── */}
          {step === 2 && image && (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-[1.4fr_1fr] gap-6"
            >
              {/* Scanned image */}
              <div className="glass-strong rounded-2xl p-4 relative overflow-hidden glow-soft">
                <div className="relative rounded-xl overflow-hidden bg-black">
                  <img src={image} alt="Scanning" className="w-full block" />
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className="absolute inset-x-0 h-[2px] bg-primary scan-line"
                      style={{ boxShadow: "0 0 20px var(--primary), 0 0 40px var(--primary)" }}
                    />
                  </div>
                  {/* Radar pulse */}
                  <div className="absolute bottom-3 right-3">
                    <div className="relative h-3 w-3">
                      <div className="absolute inset-0 rounded-full bg-primary pulse-ring" />
                      <div className="absolute inset-0 rounded-full bg-primary glow-primary" />
                    </div>
                  </div>
                  {/* Corner brackets */}
                  {[
                    "top-2 left-2 border-t-2 border-l-2",
                    "top-2 right-2 border-t-2 border-r-2",
                    "bottom-2 left-2 border-b-2 border-l-2",
                    "bottom-2 right-2 border-b-2 border-r-2",
                  ].map((c, i) => (
                    <div key={i} className={cn("absolute h-6 w-6 border-primary", c)} />
                  ))}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-background/70 backdrop-blur text-xs font-mono text-primary flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    SCANNING…
                  </div>
                </div>
              </div>

              {/* Steps panel */}
              <div className="glass-strong rounded-2xl p-6 glow-soft">
                <div className="flex items-center gap-2 mb-5">
                  <Cpu className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">DETECTAI Vision Pipeline</h3>
                </div>
                <div className="space-y-3">
                  {SCAN_STEPS.map((s, i) => {
                    const done = scanProgress > i;
                    const active = scanProgress === i;
                    const waiting = active && i === SCAN_STEPS.length - 1 && !geminiResult;
                    return (
                      <motion.div
                        key={s}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: done || active ? 1 : 0.4, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg transition-all",
                          done && "bg-success/10",
                          active && "bg-primary/10 glow-soft",
                        )}
                      >
                        <div
                          className={cn(
                            "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                            done && "bg-success text-success-foreground",
                            active && "bg-primary text-primary-foreground",
                            !done && !active && "bg-muted text-muted-foreground",
                          )}
                        >
                          {done ? (
                            <CircleCheck className="h-4 w-4" />
                          ) : active ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span className="text-xs font-mono font-bold">{i + 1}</span>
                          )}
                        </div>
                        <span className={cn("text-sm", (done || active) && "font-medium")}>{s}</span>
                        {waiting && (
                          <span className="ml-auto text-xs text-primary font-mono animate-pulse">
                            waiting…
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-6 pt-5 border-t border-border">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2 font-mono">
                    <span>PROGRESS</span>
                    <span>{Math.round((scanProgress / SCAN_STEPS.length) * 100)}%</span>
                  </div>
                  <Progress value={(scanProgress / SCAN_STEPS.length) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-3 text-center font-mono">
                    Powered by Gemini 2.5 Flash
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Results ── */}
          {step === 3 && image && geminiResult && (
            <ResultsView
              image={image}
              result={geminiResult}
              reset={reset}
              userId={user?.uid}
              onSaved={setSavedReportId}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

/* ─────────────────────────────────────────────── */
/* ResultsView                                     */
/* ─────────────────────────────────────────────── */
function ResultsView({
  image,
  result,
  reset,
  userId,
  onSaved,
}: {
  image: string;
  result: GeminiResult;
  reset: () => void;
  userId?: string;
  onSaved: (id: string) => void;
}) {
  const navigate = useNavigate();
  const defects = mapToDefects(result);
  const [reportId, setReportId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const hasSavedRef = useRef(false);

  // Save to Firestore once on mount
  useEffect(() => {
    if (!userId || hasSavedRef.current) return;
    hasSavedRef.current = true;

    setSaving(true);
    saveInspection({
      userId,
      imageBase64: image,
      defects,
      finalDecision: result.finalDecision,
      score: result.score,
      summary: result.summary,
    })
      .then((id) => {
        setReportId(id);
        onSaved(id);
        toast.success("Inspection saved to your history.");
      })
      .catch((err) => {
        console.error("Failed to save inspection:", err);
        hasSavedRef.current = false; // Allow retry if it failed
        toast.error("Inspection complete but couldn't be saved.");
      })
      .finally(() => setSaving(false));
  }, [userId, image, defects, result, onSaved]); // run when result is ready

  const counts = {
    critical: defects.filter((d) => d.severity === "critical").length,
    major: defects.filter((d) => d.severity === "major").length,
    minor: defects.filter((d) => d.severity === "minor").length,
  };

  const DecisionIcon =
    result.finalDecision === "ACCEPT"
      ? CheckCircle2
      : result.finalDecision === "REVIEW"
        ? AlertTriangle
        : XCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Decision banner */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={cn(
          "rounded-2xl p-6 border-2 flex items-center justify-between",
          DECISION_COLOR[result.finalDecision],
        )}
      >
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-current/10 flex items-center justify-center">
            <DecisionIcon className="h-8 w-8" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest opacity-80 font-semibold">
              Final Decision
            </div>
            <div className="text-3xl font-bold">{result.finalDecision}</div>
            <div className="text-sm opacity-80 mt-0.5">{result.summary}</div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs uppercase tracking-widest opacity-80 font-semibold">
            Inspection Score
          </div>
          <div className="text-3xl font-bold font-mono">{result.score}/100</div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
        {/* Annotated image */}
        <div className="glass rounded-2xl p-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3 px-2">
            Inspected image
          </div>
          <div className="relative rounded-xl overflow-hidden bg-black">
            <img src={image} alt="Inspected" className="w-full block" />
            {defects.length > 0 && <DefectOverlay defects={defects} animate={false} />}
          </div>
        </div>

        {/* Severity + defect cards */}
        <div className="space-y-4">
          {/* Score circle + severity bars */}
          <div className="glass rounded-2xl p-5 flex items-center gap-5">
            <ScoreCircle value={result.score} />
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                Severity breakdown
              </div>
              <div className="space-y-1.5">
                <SeverityBar
                  label="Critical"
                  count={counts.critical}
                  total={defects.length}
                  color="bg-danger"
                />
                <SeverityBar
                  label="Major"
                  count={counts.major}
                  total={defects.length}
                  color="bg-warning"
                />
                <SeverityBar
                  label="Minor"
                  count={counts.minor}
                  total={defects.length}
                  color="bg-primary"
                />
              </div>
            </div>
          </div>

          {/* Defect list */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h3 className="font-semibold">
                {defects.length === 0
                  ? "No defects detected ✓"
                  : `Detected Defects (${defects.length})`}
              </h3>
            </div>
            {defects.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This product passed inspection with no anomalies found.
              </p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {defects.map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 rounded-lg border border-border hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-sm">{d.type}</div>
                      <Badge
                        variant="outline"
                        className={cn("text-xs uppercase border", SEVERITY_COLOR[d.severity])}
                      >
                        {d.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Progress value={d.confidence * 100} className="h-1.5 flex-1" />
                      <span className="text-xs font-mono text-primary font-semibold">
                        {(d.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {d.explanation}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-end">
        <Button onClick={reset} variant="outline" className="rounded-full">
          <ScanLine className="h-4 w-4 mr-1" /> New Inspection
        </Button>
        <Button
          disabled={!reportId || saving}
          onClick={() => {
            if (reportId) navigate({ to: "/report/$id", params: { id: reportId } });
          }}
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-soft"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Download className="h-4 w-4 mr-1" />
          )}
          {saving ? "Saving…" : "View Full Report"}
        </Button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────── */
/* Helper sub-components                       */
/* ─────────────────────────────────────────── */
function SeverityBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 text-muted-foreground">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8 }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
      <span className="font-mono w-4 text-right">{count}</span>
    </div>
  );
}

function ScoreCircle({ value }: { value: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color =
    value >= 80 ? "var(--success)" : value >= 40 ? "var(--warning)" : "var(--danger)";
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} stroke="var(--muted)" strokeWidth="8" fill="none" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold font-mono">{value}</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</div>
      </div>
    </div>
  );
}
