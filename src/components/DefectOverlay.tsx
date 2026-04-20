import { Defect } from "@/lib/demo-data";

const SEVERITY_STROKE: Record<string, string> = {
  critical: "var(--danger)",
  major: "var(--warning)",
  minor: "var(--primary)",
};

export function DefectOverlay({ defects, animate = true }: { defects: Defect[]; animate?: boolean }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      {defects.map((d, i) => {
        const stroke = SEVERITY_STROKE[d.severity];
        return (
          <g key={d.id} style={{ animationDelay: `${i * 0.4}s` }}>
            <rect
              x={d.bbox.x}
              y={d.bbox.y}
              width={d.bbox.w}
              height={d.bbox.h}
              fill="none"
              stroke={stroke}
              strokeWidth="0.4"
              vectorEffect="non-scaling-stroke"
              className={animate ? "draw-box" : ""}
              style={{ animationDelay: `${i * 0.4}s`, filter: `drop-shadow(0 0 4px ${stroke})` }}
            />
            <rect x={d.bbox.x} y={d.bbox.y - 3} width={d.type.length * 1.6 + 4} height="2.8" fill={stroke} opacity="0.9" />
            <text x={d.bbox.x + 1} y={d.bbox.y - 1} fill="white" fontSize="2" fontWeight="600" fontFamily="JetBrains Mono">
              {d.type.toUpperCase()} {(d.confidence * 100).toFixed(0)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}
