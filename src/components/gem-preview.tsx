import { PearMark } from "@/components/diamond-mark";
import {
  caratOf,
  formatCarat,
  formatPearSize,
  type MetalColor,
  type PatternResult,
} from "@/lib/necklace/engine";
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
  const frontPeak = peakNecklaceIndex(result);
  const index =
    selectedIndex != null && stations[selectedIndex] != null
      ? selectedIndex
      : frontPeak;
  const station = index != null ? stations[index] : null;
  const size = station?.sizeMm ?? result.maxSize;
  const width = station?.widthMm;
  const ratio = station
    ? station.lengthMm / Math.max(station.widthMm, 0.1)
    : result.ratio;
  const ct = caratOf(size, ratio, width);
  const gemColor = index == null ? "colorless" : gemColorAt(gemColors, index);

  return (
    <div className="pointer-events-none absolute right-2.5 bottom-2.5 z-10 w-[5.5rem] rounded-xl border border-border/80 bg-background/85 p-1.5 shadow-sm backdrop-blur-sm">
      <svg viewBox="0 0 72 88" className="mx-auto h-16 w-12" aria-hidden="true">
        <g transform="translate(36,46)">
          <PearMark
            r={12}
            metal={result.metal}
            metalColor={metalColor}
            gemColor={gemColor}
            aspectRatio={ratio}
            showProngs={false}
          />
        </g>
      </svg>
      <p className="mt-0.5 text-center text-[10px] leading-tight tabular-nums text-foreground">
        {formatPearSize(size, ratio, width)}
      </p>
      <p className="text-center text-[9px] leading-tight text-muted-foreground">
        {formatCarat(ct)} ct · {GEM_COLORS[gemColor].label}
      </p>
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
