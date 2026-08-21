import { useMemo } from "react";
import { PearMark, METAL_PAINT, VelvetPad } from "@/components/diamond-mark";
import type {
  Metal,
  MetalColor,
  PatternResult,
  StationKind,
} from "@/lib/necklace/engine";
import { formatSize, pearShoulderRotation, stationLabel } from "@/lib/necklace/engine";
import { gemColorAt, type GemColorKey } from "@/lib/necklace/gem-colors";
import { useT } from "@/lib/locale";

type Pos = {
  x: number;
  y: number;
  r: number;
  size: number;
  lengthMm: number;
  widthMm: number;
  ratio: number;
  index: number;
  ang: number;
  startAng: number;
  endAng: number;
  kind: StationKind;
};

const BACK_KINDS = new Set<StationKind>(["lock1-f", "bracelet", "lock1-m"]);

function layoutStations(
  stations: PatternResult["stations"],
  gapMm: number,
  cx: number,
  cy: number,
  R: number,
): Pos[] {
  if (stations.length === 0) return [];
  const totalMm = Math.max(
    0.001,
    stations.reduce((a, s) => a + s.widthMm + gapMm, 0),
  );
  const braceletMm = stations.reduce(
    (a, s) => (BACK_KINDS.has(s.kind) ? a + s.widthMm + gapMm : a),
    0,
  );
  const mmToAngle = (mm: number) => (mm / totalMm) * Math.PI * 2;
  let ang = -Math.PI / 2 - mmToAngle(braceletMm) / 2;
  return stations.map((s, index) => {
    const startAng = ang;
    ang += mmToAngle(s.widthMm / 2);
    const mid = ang;
    const x = Number((cx + R * Math.cos(mid)).toFixed(3));
    const y = Number((cy + R * Math.sin(mid)).toFixed(3));
    const r = Number(((s.widthMm * Math.PI * R) / totalMm).toFixed(3));
    ang += mmToAngle(s.widthMm / 2 + gapMm);
    return {
      x,
      y,
      r,
      size: s.sizeMm,
      lengthMm: s.lengthMm,
      widthMm: s.widthMm,
      ratio: s.lengthMm / Math.max(s.widthMm, 0.1),
      index,
      ang: mid,
      startAng,
      endAng: startAng + mmToAngle(s.widthMm),
      kind: s.kind,
    };
  });
}

function polarLabel(
  cx: number,
  cy: number,
  R: number,
  ang: number,
  text: string,
  fill: string,
  size = 11,
) {
  const x = Number((cx + R * Math.cos(ang)).toFixed(3));
  const y = Number((cy + R * Math.sin(ang)).toFixed(3));
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fill={fill}
      fontSize={size}
      fontFamily="ui-sans-serif, system-ui, sans-serif"
      letterSpacing="0.12em"
    >
      {text}
    </text>
  );
}

function meanAng(positions: Pos[]): number {
  if (positions.length === 0) return 0;
  const x = positions.reduce((a, p) => a + Math.cos(p.ang), 0);
  const y = positions.reduce((a, p) => a + Math.sin(p.ang), 0);
  return Math.atan2(y, x);
}

function hardwareRole(kind: StationKind): "lock" | "conv" | null {
  if (kind.startsWith("lock")) return "lock";
  if (kind.startsWith("conv")) return "conv";
  return null;
}

function hardwareCallout(
  cx: number,
  cy: number,
  R: number,
  ang: number,
  title: string,
  sub: string,
  stroke: string,
  markerId: string,
) {
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);
  const x0 = Number((cx + (R + 26) * cos).toFixed(3));
  const y0 = Number((cy + (R + 26) * sin).toFixed(3));
  const x1 = Number((cx + (R + 58) * cos).toFixed(3));
  const y1 = Number((cy + (R + 58) * sin).toFixed(3));
  const tx = Number((cx + (R + 74) * cos).toFixed(3));
  const ty = Number((cy + (R + 74) * sin).toFixed(3));
  const anchor =
    Math.abs(cos) < 0.38 ? "middle" : cos > 0 ? "start" : "end";
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x0}
        y2={y0}
        stroke={stroke}
        strokeWidth={1.5}
        markerEnd={`url(#${markerId})`}
      />
      <text
        x={tx}
        y={ty}
        textAnchor={anchor}
        dominantBaseline="middle"
        fill={stroke}
        fontSize={9}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight={600}
        letterSpacing="0.1em"
      >
        {title}
        {sub ? (
          <tspan
            x={tx}
            dy="11"
            fontSize={8}
            fontWeight={500}
            letterSpacing="0.14em"
          >
            {sub}
          </tspan>
        ) : null}
      </text>
    </g>
  );
}

export function NecklaceRing({
  result,
  selectedIndex,
  onSelect,
  metalColor,
  gemColors,
}: {
  result: PatternResult;
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  metalColor: MetalColor;
  gemColors: GemColorKey[];
}) {
  const t = useT();
  const size = 800;
  const cx = size / 2;
  const cy = size / 2;
  const R = 260;
  const metal: Metal = result.metal;
  const paint = METAL_PAINT[metalColor];

  const positions = useMemo(
    () => layoutStations(result.stations, result.gapMm, cx, cy, R),
    [result.stations, result.gapMm, cx, cy],
  );

  const lockRight = positions.filter(
    (p) => p.kind === "lock1-m" || p.kind === "lock2-f",
  );
  const lockLeft = positions.filter(
    (p) => p.kind === "lock2-m" || p.kind === "lock1-f",
  );
  const convL = positions.find((p) => p.kind === "conv-l");
  const convR = positions.find((p) => p.kind === "conv-r");

  return (
    <svg
      id="necklace-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${size} ${size}`}
      className="h-full w-full"
      role="img"
      aria-label={`${result.lengthIn} inch convertible pear rivière, ${result.braceletIn} inch bracelet back, ${result.totalPcs} stones`}
      onClick={() => onSelect(null)}
    >
      <defs>
        <marker
          id="lock-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--color-gold)" />
        </marker>
        <marker
          id="conv-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--color-silver)" />
        </marker>
      </defs>
      <VelvetPad />
      <circle
        cx={cx}
        cy={cy}
        r={R + 42}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={1}
      />
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill="none"
        stroke={paint.fill}
        strokeWidth={2}
        opacity={0.4}
      />

      {positions.map((p) => (
        <g
          key={p.index}
          transform={`translate(${p.x}, ${p.y})`}
          className="cursor-pointer"
          tabIndex={0}
          role="button"
          aria-label={`${stationLabel(p.kind)} stone ${p.index + 1}, ${formatSize(p.size)} millimeters`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(p.index === selectedIndex ? null : p.index);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              onSelect(p.index === selectedIndex ? null : p.index);
            }
          }}
        >
          <g transform={`rotate(${pearShoulderRotation(p.x, p.y, p.ang, cx, cy).toFixed(3)})`}>
          <PearMark
            r={Math.max(1.6, p.r)}
            metal={metal}
            metalColor={metalColor}
            gemColor={gemColorAt(gemColors, p.index)}
            aspectRatio={p.ratio}
            selected={p.index === selectedIndex}
            callout={hardwareRole(p.kind)}
          />
          </g>
        </g>
      ))}

      {polarLabel(cx, cy, R + 40, -Math.PI / 2, t("back"), "var(--color-muted-foreground)", 10)}
      {polarLabel(cx, cy, R + 40, Math.PI / 2, t("frontMark"), "var(--color-muted-foreground)", 10)}
      {lockLeft.length > 0 &&
        hardwareCallout(
          cx,
          cy,
          R,
          meanAng(lockLeft),
          t("lockCallout"),
          t("left"),
          "var(--color-gold)",
          "lock-arrow",
        )}
      {lockRight.length > 0 &&
        hardwareCallout(
          cx,
          cy,
          R,
          meanAng(lockRight),
          t("lockCallout"),
          t("right"),
          "var(--color-gold)",
          "lock-arrow",
        )}
      {convL &&
        hardwareCallout(
          cx,
          cy,
          R,
          convL.ang,
          t("converterCallout"),
          t("left"),
          "var(--color-silver)",
          "conv-arrow",
        )}
      {convR &&
        hardwareCallout(
          cx,
          cy,
          R,
          convR.ang,
          t("converterCallout"),
          t("right"),
          "var(--color-silver)",
          "conv-arrow",
        )}

      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fill="var(--color-foreground)"
        fontSize={28}
        fontFamily="ui-serif, Georgia, serif"
      >
        {result.lengthIn}″ {metal === "gold" ? "Gold" : "Silver"}
      </text>
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        fill="var(--color-muted-foreground)"
        fontSize={12}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {result.braceletIn}″ back · {result.necklaceIn}″ front
      </text>
    </svg>
  );
}

const KIND_TONE: Record<StationKind, string> = {
  "lock1-f": "var(--color-gold)",
  "lock1-m": "var(--color-gold)",
  "lock2-f": "var(--color-gold)",
  "lock2-m": "var(--color-gold)",
  bracelet: "var(--color-muted-foreground)",
  necklace: "var(--color-foreground)",
  "conv-l": "var(--color-silver)",
  "conv-r": "var(--color-silver)",
};

export function StrandView({
  result,
  selectedIndex,
  onSelect,
  metalColor,
  gemColors,
}: {
  result: PatternResult;
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  metalColor: MetalColor;
  gemColors: GemColorKey[];
}) {
  const metal = result.metal;
  const paint = METAL_PAINT[metalColor];
  const stations = result.stations;
  if (stations.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
        No stones in this run yet.
      </div>
    );
  }
  const maxW = Math.max(...stations.map((s) => s.widthMm));
  const maxL = Math.max(...stations.map((s) => s.lengthMm));
  const scale = 9 / Math.max(maxW, 0.1);
  const pad = 16;
  const widths = stations.map((s) => s.widthMm * scale * 2 + 4);
  const totalW = widths.reduce((a, b) => a + b, 0) + pad * 2;
  const h = Math.max(72, maxL * scale * 2 + 28);

  let x = pad;
  const items = stations.map((s, i) => {
    const w = widths[i];
    const cx = x + w / 2;
    x += w;
    return {
      ...s,
      i,
      cx: Number(cx.toFixed(3)),
      r: Number(Math.max(2.2, s.widthMm * scale).toFixed(3)),
      x0: Number((cx - w / 2).toFixed(3)),
      w: Number(w.toFixed(3)),
    };
  });

  const bands: { kind: StationKind; x: number; w: number; label: string }[] = [];
  for (const it of items) {
    const last = bands[bands.length - 1];
    if (last && last.kind === it.kind) last.w += it.w;
    else
      bands.push({
        kind: it.kind,
        x: it.x0,
        w: it.w,
        label: shortKind(it.kind),
      });
  }

  return (
    <div className="min-w-0 space-y-2">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">
        Unrolled chain · F1 → back → R → front → L
      </p>
      <div className="min-w-0 overflow-x-auto rounded-xl border border-border bg-card">
        <svg
          viewBox={`0 0 ${totalW} ${h}`}
          width={totalW}
          height={h}
          className="h-16 w-auto max-w-none"
          role="img"
          aria-label="Unrolled convertible chain, female lock 1 to male lock 2"
        >
          <rect width={totalW} height={h} fill="var(--color-card)" />
          {bands.map((b, i) => (
            <g key={`${b.kind}-${i}`}>
              <rect
                x={b.x}
                y={4}
                width={b.w}
                height={h - 8}
                fill={KIND_TONE[b.kind]}
                opacity={0.08}
              />
              {b.w > 28 && (
                <text
                  x={b.x + b.w / 2}
                  y={12}
                  textAnchor="middle"
                  fill="var(--color-muted-foreground)"
                  fontSize={8}
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  {b.label}
                </text>
              )}
            </g>
          ))}
          <line
            x1={pad}
            x2={totalW - pad}
            y1={h / 2 + 4}
            y2={h / 2 + 4}
            stroke={paint.fill}
            strokeWidth={2}
            opacity={0.5}
          />
          {items.map((it) => (
            <g
              key={it.i}
              transform={`translate(${it.cx}, ${h / 2 + 4})`}
              className="cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label={`${stationLabel(it.kind)} stone ${it.i + 1}, ${formatSize(it.sizeMm)} millimeters`}
              onClick={() => onSelect(it.i === selectedIndex ? null : it.i)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(it.i === selectedIndex ? null : it.i);
                }
              }}
            >
              <PearMark
                r={it.r}
                metal={metal}
                metalColor={metalColor}
                gemColor={gemColorAt(gemColors, it.i)}
                aspectRatio={it.lengthMm / Math.max(it.widthMm, 0.1)}
                selected={it.i === selectedIndex}
              />
              <title>{stationLabel(it.kind)}</title>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function shortKind(kind: StationKind): string {
  switch (kind) {
    case "lock1-f":
      return "F1";
    case "lock1-m":
      return "M1";
    case "lock2-f":
      return "F2";
    case "lock2-m":
      return "M2";
    case "conv-l":
      return "CONV L";
    case "conv-r":
      return "CONV R";
    case "bracelet":
      return "BRACELET";
    case "necklace":
      return "FRONT";
  }
}
