import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Download, ArrowLeft, Printer, ScanEye, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DefectOverlay } from "@/components/DefectOverlay";
import { getInspectionById, type InspectionDoc } from "@/lib/firestore";
import { DECISION_COLOR, SEVERITY_COLOR } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/report/$id")({
  component: ReportPage,
});

/* ────────────────────── PDF Generation ────────────────────── */
async function generatePDF(element: HTMLElement, reportId: string) {
  const toastId = "pdf-gen";
  toast.loading("Preparing high-quality PDF...", { id: toastId });

  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    // Create a clone for capture to avoid flickering the UI
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = "fixed";
    clone.style.top = "-9999px";
    clone.style.left = "0";
    clone.style.width = "800px"; // Standard width for capture
    clone.style.backgroundColor = "#020617"; // Match app dark theme for PDF
    clone.style.color = "#ffffff";
    document.body.appendChild(clone);

    // Identify and fix elements that trip up html2canvas
    const blurs = clone.querySelectorAll(".backdrop-blur, .glow-soft, .glow-primary");
    blurs.forEach((el) => {
      (el as HTMLElement).style.backdropFilter = "none";
      (el as HTMLElement).style.filter = "none";
      (el as HTMLElement).style.boxShadow = "none";
    });

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#020617",
      logging: false,
      windowWidth: 800,
    });

    document.body.removeChild(clone);

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;
    const scaledHeight = (canvas.height * contentWidth) / canvas.width;

    // Add content to PDF (multi-page support)
    let heightLeft = scaledHeight;
    let position = margin;

    pdf.addImage(imgData, "JPEG", margin, position, contentWidth, scaledHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - scaledHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", margin, position, contentWidth, scaledHeight);
      heightLeft -= pdfHeight;
    }

    const dateStr = new Date().toISOString().slice(0, 10);
    pdf.save(`DETECTAI-Report-${dateStr}-${reportId.slice(0, 8)}.pdf`);
    toast.success("PDF Downloaded successfully!", { id: toastId });
  } catch (err) {
    console.error("PDF generation failed:", err);
    toast.success("Opening Print dialog...", { 
      id: toastId, 
      icon: "🖨️",
      duration: 3000 
    });
    setTimeout(() => window.print(), 500);
  }
}

/* ────────────────────── ReportPage ────────────────────── */
function ReportPage() {
  const { id } = Route.useParams();
  const [inspection, setInspection] = useState<InspectionDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getInspectionById(id)
      .then((doc) => {
        if (!doc) setNotFound(true);
        else setInspection(doc);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current || downloading) return;
    setDownloading(true);
    await generatePDF(reportRef.current, id);
    setDownloading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-mono">Loading report…</p>
        </div>
      </div>
    );
  }

  if (notFound || !inspection) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <ScanEye className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Report not found</h1>
        <p className="text-sm text-muted-foreground">
          This report may have been deleted or the ID is invalid.
        </p>
        <Button asChild>
          <Link to="/history">Back to history</Link>
        </Button>
      </div>
    );
  }

  const counts = {
    critical: inspection.defects.filter((d) => d.severity === "critical").length,
    major: inspection.defects.filter((d) => d.severity === "major").length,
    minor: inspection.defects.filter((d) => d.severity === "minor").length,
  };

  const createdAt =
    inspection.createdAt instanceof Date
      ? inspection.createdAt
      : new Date(inspection.createdAt);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar — hidden in print */}
      <div className="no-print sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link to="/history">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadPDF}
              disabled={downloading}
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary h-10 px-6"
            >
              {downloading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Download className="h-5 w-5 mr-2" />
              )}
              {downloading ? "Generating Report..." : "Download PDF Report"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 print:py-0">
        {/* ─── This div is captured for PDF ─── */}
        <div
          id="report-content"
          ref={reportRef}
          className="bg-card rounded-2xl p-8 md:p-12 print:rounded-none print:shadow-none print:p-0 border border-border"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground glow-soft print:shadow-none">
                <ScanEye className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold text-xl">
                  DETECT<span className="text-primary">AI</span>
                </div>
                <div className="text-xs text-muted-foreground">Inspection Report</div>
              </div>
            </div>
            <div className="text-right text-xs space-y-0.5 font-mono">
              <div>
                <span className="text-muted-foreground">Report ID: </span>
                <span className="font-semibold">{inspection.id.slice(0, 16)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Date: </span>
                {createdAt.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div>
                <span className="text-muted-foreground">Time: </span>
                {createdAt.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Executive summary */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <SummaryStat
              label="Final Decision"
              value={inspection.finalDecision}
              className={DECISION_COLOR[inspection.finalDecision]}
            />
            <SummaryStat label="Inspection Score" value={`${inspection.score}/100`} />
            <SummaryStat label="Total Defects" value={String(inspection.defects.length)} />
          </div>

          {/* AI Summary */}
          {inspection.summary && (
            <div className="mb-8 p-4 rounded-xl bg-muted/30 border border-border">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                AI Summary
              </div>
              <p className="text-sm">{inspection.summary}</p>
            </div>
          )}

          {/* Product image */}
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-3">
              Product image
            </h2>
            <div className="relative rounded-xl overflow-hidden bg-black border border-border">
              <img
                src={inspection.imageBase64}
                alt="Inspected product"
                className="w-full block"
              />
              {inspection.defects.length > 0 && (
                <DefectOverlay defects={inspection.defects} animate={false} />
              )}
            </div>
          </div>

          {/* Severity breakdown */}
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-3">
              Severity breakdown
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <BreakdownCard label="Critical" count={counts.critical} color="text-danger bg-danger/10" />
              <BreakdownCard label="Major" count={counts.major} color="text-warning bg-warning/10" />
              <BreakdownCard label="Minor" count={counts.minor} color="text-primary bg-primary/10" />
            </div>
          </div>

          {/* Defects table */}
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-3">
              Detected defects
            </h2>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase">
                  <tr>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Confidence</th>
                    <th className="text-left p-3 font-medium">Severity</th>
                    <th className="text-left p-3 font-medium">Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {inspection.defects.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-muted-foreground">
                        No defects detected. Product passed inspection.
                      </td>
                    </tr>
                  ) : (
                    inspection.defects.map((d) => (
                      <tr key={d.id} className="border-t border-border">
                        <td className="p-3 font-semibold">{d.type}</td>
                        <td className="p-3 font-mono text-primary">
                          {(d.confidence * 100).toFixed(0)}%
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={cn("text-xs uppercase border", SEVERITY_COLOR[d.severity])}
                          >
                            {d.severity}
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground text-xs">{d.explanation}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border pt-4 text-xs text-muted-foreground text-center">
            Generated by DETECTAI AI Inspection System · This report is suitable for quality assurance audit purposes.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────── Helper Components ────────────── */

function SummaryStat({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border p-4", className ?? "border-border")}>
      <div className="text-xs uppercase tracking-widest opacity-80 font-semibold">{label}</div>
      <div className="text-2xl font-bold font-mono mt-1">{value}</div>
    </div>
  );
}

function BreakdownCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className={cn("rounded-xl p-4 text-center", color)}>
      <div className="text-3xl font-bold font-mono">{count}</div>
      <div className="text-xs uppercase tracking-widest mt-1 font-semibold">{label}</div>
    </div>
  );
}
