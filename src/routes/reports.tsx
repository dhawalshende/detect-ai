import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Loader2, ScanLine } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserInspections, type InspectionDoc } from "@/lib/firestore";
import { DECISION_COLOR } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  component: Reports,
});

function Reports() {
  const { user } = useAuth();
  const [inspections, setInspections] = useState<InspectionDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getUserInspections(user.uid)
      .then(setInspections)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">Audit-ready reports for every inspection.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground font-mono">Loading reports…</p>
            </div>
          </div>
        ) : inspections.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <ScanLine className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold">No reports yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Run your first inspection to generate a report.</p>
            <Button asChild className="mt-5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/inspect">Start New Inspection</Link>
            </Button>
          </div>
        ) : (
          <div className="glass rounded-2xl divide-y divide-border">
            {inspections.map((ins) => {
              const dateStr =
                ins.createdAt instanceof Date
                  ? ins.createdAt.toLocaleDateString()
                  : new Date(ins.createdAt).toLocaleDateString();
              return (
                <div key={ins.id} className="p-4 flex items-center gap-4 hover:bg-primary/5 transition-colors">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="h-10 w-16 rounded-lg overflow-hidden bg-muted shrink-0 hidden sm:block">
                    <img
                      src={ins.imageBase64}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate text-sm">
                      {ins.summary || "Inspection Report"}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {ins.id.slice(0, 12)}… · {dateStr} · {ins.defects.length} defect{ins.defects.length !== 1 && "s"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-sm text-primary font-semibold hidden md:inline">
                      {ins.score}/100
                    </span>
                    <Badge variant="outline" className={cn("border", DECISION_COLOR[ins.finalDecision])}>
                      {ins.finalDecision}
                    </Badge>
                    <Button asChild size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary">
                      <Link to="/report/$id" params={{ id: ins.id }}>
                        Open <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
