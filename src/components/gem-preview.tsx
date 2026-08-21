import { PearMark } from "@/components/diamond-mark";
import {
  caratOf,
  formatCarat,
  formatPearSize,
  stationLabel,
  type MetalColor,
  type PatternResult,
} from "@/lib/necklace/engine";
import { cn } from "@/lib/utils";
import {
  GEM_COLORS,
  gemColorAt,
  type GemColorKey,
} from "@/lib/necklace/gem-colors";

export function GemPreview({
  result,
  selectedIndex,
  metalColor,
  gemColors,
}: {
  result: PatternResult;
  selectedIndex: number | null;
  metalColor: MetalColor;
  gemColors: GemColorKey[];
}) {
  const stations = result.stations;
  const n = stations.length;
  const frontPeak = peakNecklaceIndex(result);
  const index =
    selectedIndex != null && stations[selectedIndex] != null
      ? selectedIndex
      : frontPeak;
  const station = index != null ? stations[index] : null;
  const size = station?.sizeMm ?? result.maxSize;
  const ct = caratOf(size, result.ratio);
  const zone = station ? stationLabel(station.kind) : "—";
  const gemColor = index == null ? "colorless" : gemColorAt(gemColors, index);

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-4 lg:h-full">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">
        Gem preview
      </p>
      <div className="mt-2 flex min-h-40 flex-1 items-center justify-center">
        <svg viewBox="0 0 180 180" className="h-40 w-40">
          <circle cx="90" cy="90" r="86" fill="var(--color-velvet)" />
          <g transform="translate(90,90)">
            <PearMark
              r={42}
              metal={result.metal}
              metalColor={metalColor}
              gemColor={gemColor}
              aspectRatio={result.ratio}
              showProngs
            />
          </g>
        </svg>
      </div>
      <div className="mt-1 space-y-1.5">
        <p className="font-display text-3xl leading-none text-foreground">
          {formatPearSize(size, result.ratio)}
          <span className="ml-1 text-lg text-muted-foreground">mm</span>
        </p>
        <p className="text-sm tabular-nums text-muted-foreground">
          {formatCarat(ct)} ct each · 3-prong {metalColor}{" "}
          {result.metal === "gold" ? "gold" : "silver"}
        </p>
        <p className="text-xs text-muted-foreground">
          {zone}
          {index != null ? ` · #${index + 1} of ${n}` : ""}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span
            className={cn(
              "size-3 rounded-full",
              result.metal === "gold" ? "bg-gold" : "bg-silver",
            )}
          />
          <span className="text-xs text-muted-foreground">
            Pear brilliant · {GEM_COLORS[gemColor].label} · shoulder sweep
          </span>
        </div>
      </div>
    </div>
  );
}

function peakNecklaceIndex(result: PatternResult): number | null {
  const hits: number[] = [];
  let best = -1;
  result.stations.forEach((s, i) => {
    if (s.kind !== "necklace") return;
    if (s.sizeMm > best) {
      best = s.sizeMm;
      hits.length = 0;
      hits.push(i);
    } else if (s.sizeMm === best) {
      hits.push(i);
    }
  });
  if (hits.length) return hits[Math.floor(hits.length / 2)];
  return result.stations.length ? 0 : null;
}
