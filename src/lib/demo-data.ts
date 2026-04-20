export type Severity = "critical" | "major" | "minor";
export type Decision = "ACCEPT" | "REVIEW" | "REJECT";

export interface Defect {
  id: string;
  type: string;
  confidence: number;
  severity: Severity;
  explanation: string;
  bbox: { x: number; y: number; w: number; h: number }; // % values
}

export interface Inspection {
  id: string;
  productType: string;
  date: string;
  imageUrl: string;
  defects: Defect[];
  score: number;
  decision: Decision;
  inspector: string;
}

export const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1565092270831-5d6e6f6c4f6f?auto=format&fit=crop&w=1200&q=80";

const img1 =
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80";
const img2 =
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80";
const img3 =
  "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1200&q=80";
const img4 =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

export const DEMO_DEFECTS: Defect[] = [
  {
    id: "d1",
    type: "Crack",
    confidence: 0.91,
    severity: "critical",
    explanation: "Structural weakness detected along welded seam. Risk of failure under load.",
    bbox: { x: 18, y: 22, w: 22, h: 14 },
  },
  {
    id: "d2",
    type: "Scratch",
    confidence: 0.76,
    severity: "major",
    explanation: "Surface damage identified. May affect coating integrity.",
    bbox: { x: 55, y: 40, w: 28, h: 8 },
  },
  {
    id: "d3",
    type: "Corrosion",
    confidence: 0.83,
    severity: "major",
    explanation: "Material degradation found near edge. Consider surface treatment.",
    bbox: { x: 30, y: 65, w: 18, h: 18 },
  },
];

export const DEMO_INSPECTIONS: Inspection[] = [
  {
    id: "INS-2041",
    productType: "Steel Pipe Assembly",
    date: "2025-04-18",
    imageUrl: img1,
    defects: DEMO_DEFECTS,
    score: 34,
    decision: "REJECT",
    inspector: "M. Chen",
  },
  {
    id: "INS-2040",
    productType: "Aluminum Bracket",
    date: "2025-04-17",
    imageUrl: img2,
    defects: [DEMO_DEFECTS[1]],
    score: 78,
    decision: "REVIEW",
    inspector: "M. Chen",
  },
  {
    id: "INS-2039",
    productType: "Circuit Housing",
    date: "2025-04-16",
    imageUrl: img3,
    defects: [],
    score: 96,
    decision: "ACCEPT",
    inspector: "M. Chen",
  },
  {
    id: "INS-2038",
    productType: "Hydraulic Cylinder",
    date: "2025-04-15",
    imageUrl: img4,
    defects: [DEMO_DEFECTS[0], DEMO_DEFECTS[2]],
    score: 52,
    decision: "REVIEW",
    inspector: "M. Chen",
  },
];

export function getInspection(id: string): Inspection | undefined {
  return DEMO_INSPECTIONS.find((i) => i.id === id);
}

export const SEVERITY_COLOR: Record<Severity, string> = {
  critical: "text-danger border-danger/40 bg-danger/10",
  major: "text-warning border-warning/40 bg-warning/10",
  minor: "text-primary border-primary/40 bg-primary/10",
};

export const DECISION_COLOR: Record<Decision, string> = {
  ACCEPT: "text-success border-success/40 bg-success/10",
  REVIEW: "text-warning border-warning/40 bg-warning/10",
  REJECT: "text-danger border-danger/40 bg-danger/10",
};
