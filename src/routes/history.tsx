import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, FileSearch, ArrowRight, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getUserInspections, type InspectionDoc } from "@/lib/firestore";
import { DECISION_COLOR, type Decision } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

const filters: { label: string; value: Decision | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Accepted", value: "ACCEPT" },
  { label: "Review", value: "REVIEW" },
  { label: "Rejected", value: "REJECT" },
];

function HistoryPage() {
  const { user } = useAuth();
  const [inspections, setInspections] = useState<InspectionDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Decision | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getUserInspections(user.uid)
      .then(setInspections)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = inspections.filter(
    (i) =>
      (filter === "all" || i.finalDecision === filter) &&
      (search === "" ||
        i.id.toLowerCase().includes(search.toLowerCase()) ||
        i.summary?.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Inspection History</h1>
          <p className="text-muted-foreground text-sm mt-1">Browse and audit every inspection you have run.</p>
        </div>

        {/* Filter bar */}
        <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID or summary…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-input/50 border-border focus-visible:ring-primary"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground mr-1" />
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  filter === f.value
                    ? "bg-primary text-primary-foreground glow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground font-mono">Loading inspections…</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <FileSearch className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold">No inspections found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {inspections.length === 0
                ? "You haven't run any inspections yet."
                : "Try adjusting your filters."}
            </p>
            <Button asChild className="mt-5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/inspect">Start New Inspection</Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((ins, i) => (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl overflow-hidden hover:border-primary/40 hover:glow-soft transition-all"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-muted">
                  <img
                    src={ins.imageBase64}
                    alt="Inspection"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className={cn("font-bold border backdrop-blur", DECISION_COLOR[ins.finalDecision])}>
                      {ins.finalDecision}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded bg-background/70 backdrop-blur text-[10px] font-mono">
                    {ins.score}/100
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {ins.summary || "No summary available."}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>
                      {ins.createdAt instanceof Date
                        ? ins.createdAt.toLocaleDateString()
                        : new Date(ins.createdAt).toLocaleDateString()}
                    </span>
                    <span>{ins.defects.length} defect{ins.defects.length !== 1 && "s"}</span>
                  </div>
                  <Button asChild size="sm" variant="ghost" className="w-full mt-3 hover:bg-primary/10 hover:text-primary">
                    <Link to="/report/$id" params={{ id: ins.id }}>
                      View Report <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
