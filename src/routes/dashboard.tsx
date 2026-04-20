import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ScanLine, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CountUp } from "@/components/CountUp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getUserInspections, getUserStats, type InspectionDoc, type DashboardStats } from "@/lib/firestore";
import { DECISION_COLOR } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ total: 0, accepted: 0, review: 0, rejected: 0 });
  const [recent, setRecent] = useState<InspectionDoc[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Inspector";
  const firstName = displayName.split(" ")[0];

  useEffect(() => {
    if (!user) return;
    setLoadingData(true);
    Promise.all([getUserStats(user.uid), getUserInspections(user.uid)])
      .then(([s, inspections]) => {
        setStats(s);
        setRecent(inspections.slice(0, 5)); // Show 5 most recent
      })
      .catch(console.error)
      .finally(() => setLoadingData(false));
  }, [user]);

  const statCards = [
    { label: "Total Inspections", value: stats.total, icon: ScanLine, color: "text-primary", bg: "bg-primary/10" },
    { label: "Passed", value: stats.accepted, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Under Review", value: stats.review, icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-danger", bg: "bg-danger/10" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {firstName}</h1>
            <p className="text-muted-foreground text-sm mt-1 font-mono">{today}</p>
          </div>
          <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-soft">
            <Link to="/inspect"><Plus className="h-4 w-4 mr-1" /> New Inspection</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-5 hover:border-primary/40 hover:glow-soft transition-all"
            >
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center mb-3", s.bg, s.color)}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-3xl font-bold">
                {loadingData ? (
                  <span className="inline-block w-12 h-8 bg-muted/50 rounded animate-pulse" />
                ) : (
                  <CountUp to={s.value} />
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick start CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-strong rounded-2xl p-8 relative overflow-hidden glow-soft"
        >
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Quick action</div>
              <h2 className="text-2xl font-bold">Start a new inspection</h2>
              <p className="text-muted-foreground text-sm mt-1 max-w-md">
                Upload a product image and let DETECTAI surface every defect in seconds.
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
              <Link to="/inspect">Start Inspecting <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </motion.div>

        {/* Recent inspections */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent inspections</h2>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
              <Link to="/history">View all <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
            </Button>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left p-4 font-medium">Image</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Date</th>
                    <th className="text-left p-4 font-medium">Defects</th>
                    <th className="text-left p-4 font-medium">Score</th>
                    <th className="text-left p-4 font-medium">Decision</th>
                    <th className="text-right p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingData ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="p-4"><div className="h-10 w-24 bg-muted/50 rounded animate-pulse" /></td>
                        <td className="p-4 hidden md:table-cell"><div className="h-4 w-20 bg-muted/50 rounded animate-pulse" /></td>
                        <td className="p-4"><div className="h-4 w-8 bg-muted/50 rounded animate-pulse" /></td>
                        <td className="p-4"><div className="h-4 w-12 bg-muted/50 rounded animate-pulse" /></td>
                        <td className="p-4"><div className="h-6 w-16 bg-muted/50 rounded animate-pulse" /></td>
                        <td className="p-4 text-right"><div className="h-8 w-12 bg-muted/50 rounded animate-pulse ml-auto" /></td>
                      </tr>
                    ))
                  ) : recent.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-muted-foreground">
                        <ScanLine className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        No inspections yet.{" "}
                        <Link to="/inspect" className="text-primary hover:underline">Run your first one →</Link>
                      </td>
                    </tr>
                  ) : (
                    recent.map((ins) => (
                      <tr key={ins.id} className="border-t border-border hover:bg-primary/5 transition-colors">
                        <td className="p-4">
                          <div className="h-10 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                            <img
                              src={ins.imageBase64}
                              alt="Inspection thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground font-mono text-xs hidden md:table-cell">
                          {ins.createdAt instanceof Date
                            ? ins.createdAt.toLocaleDateString()
                            : new Date(ins.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-mono">{ins.defects.length}</td>
                        <td className="p-4 font-mono text-primary font-semibold">{ins.score}/100</td>
                        <td className="p-4">
                          <Badge variant="outline" className={cn("font-semibold border", DECISION_COLOR[ins.finalDecision])}>
                            {ins.finalDecision}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Button asChild size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary">
                            <Link to="/report/$id" params={{ id: ins.id }}>View</Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
