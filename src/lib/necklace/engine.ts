export type Metal = "gold" | "silver";
export type PatternMode = "range" | "list";
export type MetalColor = "yellow" | "white" | "rose";

export const INCHES = [14, 15, 16, 17, 18] as const;
export type LengthIn = (typeof INCHES)[number];

export const BRACELET_IN = [6, 6.5, 7] as const;
export type BraceletIn = (typeof BRACELET_IN)[number];

export const METAL = {
  gold: {
    id: "gold" as const,
    label: "Gold",
    min: 1.5,
    max: 11,
    step: 0.1,
  },
  silver: {
    id: "silver" as const,
    label: "Silver",
    min: 3.5,
    max: 12,
    step: 0.5,
  },
};

export const METAL_COLOR: Record<
  MetalColor,
  { fill: string; light: string; dark: string; label: string }
> = {
  yellow: { fill: "#d4a017", light: "#f0d78a", dark: "#a67c00", label: "Yellow" },
  white: { fill: "#c0c0c8", light: "#eef1f4", dark: "#8a8a96", label: "White" },
  rose: { fill: "#c98a7a", light: "#e8c4b8", dark: "#9a5f52", label: "Rose" },
};

export function defaultMetalColor(metal: Metal): MetalColor {
  return metal === "gold" ? "yellow" : "white";
}

export const GAP_MIN = 0.2;
export const GAP_MAX = 0.5;
export const LOCK_STONES = 3;
export const LOCK_FEMALE = 2;
export const LOCK_MALE = 1;
export const CONVERTER_STONES = 1;
export const MM_PER_INCH = 25.4;
export const DEFAULT_PEAR_RATIO = 1.5;
export const PEAR_RATIO_MIN = 1.3;
export const PEAR_RATIO_MAX = 1.8;
export const PEAR_DEPTH_FACTOR = 0.61;
export const PEAR_ORIENTATION =
  "Point-to-center: every pear point faces inward; the center pear's rounded lobe rests at 6 o'clock.";

export type StationKind =
  | "lock1-f"
  | "bracelet"
  | "lock1-m"
  | "lock2-f"
  | "conv-l"
  | "necklace"
  | "conv-r"
  | "lock2-m";

export const STATION_LABEL: Record<StationKind, string> = {
  "lock1-f": "Lock 1 · female",
  bracelet: "Bracelet · back",
  "lock1-m": "Lock 1 · male",
  "lock2-f": "Lock 2 · female",
  "conv-l": "Left converter",
  necklace: "Necklace · front",
  "conv-r": "Right converter",
  "lock2-m": "Lock 2 · male",
};

export function stationLabel(kind: StationKind): string {
  return STATION_LABEL[kind];
}

export type Station = {
  /** Pear length. Kept as sizeMm for compatibility with the established UI. */
  sizeMm: number;
  lengthMm: number;
  widthMm: number;
  depthMm: number;
  kind: StationKind;
};

export type PriceBracket = {
  minMm: number;
  maxMm: number;
  perCt: number;
};

export type ListLine = {
  sizeMm: number;
  pcs: number;
};

export type BomLine = {
  /** Pear length. */
  sizeMm: number;
  lengthMm: number;
  widthMm: number;
  depthMm: number;
  pcs: number;
  carat: number;
  perCt: number;
  cost: number;
};

export type SegmentFit = {
  label: string;
  lengthIn: number;
  lengthMm: number;
  setMm: number;
  leftoverMm: number;
  fit: "ok" | "short" | "long";
  pcs: number;
  carat: number;
  bom: BomLine[];
};

export type FindingLine = {
  id: string;
  name: string;
  detail: string;
  sizeMm: number;
  lengthMm: number;
  widthMm: number;
  pcs: number;
  stonesOnTop: number;
};

export type AssemblyStep = {
  n: number;
  title: string;
  detail: string;
};

export type PatternInput = {
  metal: Metal;
  lengthIn: LengthIn;
  braceletIn: BraceletIn;
  gapMm: number;
  ratio: number;
  mode: PatternMode;
  minSize: number;
  maxSize: number;
  list: ListLine[];
  prices: PriceBracket[];
  /** Honor list pcs exactly and back-solve gap (may fall outside 0.2–0.5). */
  autoGapFromList?: boolean;
};

export type PatternResult = {
  stones: number[];
  stations: Station[];
  bom: BomLine[];
  totalPcs: number;
  totalCarat: number;
  totalCost: number;
  lengthIn: LengthIn;
  lengthMm: number;
  braceletIn: BraceletIn;
  necklaceIn: number;
  claspMm: number;
  lockMm: number;
  converterMm: number;
  gapMm: number;
  ratio: number;
  depthFactor: number;
  orientation: string;
  minSize: number;
  maxSize: number;
  setMm: number;
  totalMm: number;
  leftoverMm: number;
  fit: "ok" | "short" | "long";
  gapOutOfRange: boolean;
  metal: Metal;
  mode: PatternMode;
  bracelet: SegmentFit;
  necklace: SegmentFit;
  findings: FindingLine[];
  assembly: AssemblyStep[];
};

export type Variant = {
  id: string;
  name: string;
  note: string;
  minSize: number;
  maxSize: number;
  mode: PatternMode;
  list: ListLine[];
  result: PatternResult;
};

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function sizeGrid(metal: Metal): number[] {
  const { min, max, step } = METAL[metal];
  const out: number[] = [];
  const n0 = Math.round(min / step);
  const n1 = Math.round(max / step);
  for (let n = n0; n <= n1; n++) out.push(round1(n * step));
  return out;
}

export function snapSize(mm: number, metal: Metal): number {
  const { min, max, step } = METAL[metal];
  const n = Math.round(mm / step);
  return clamp(round1(n * step), min, max);
}

export function lengthMm(inches: number): number {
  return round2(inches * MM_PER_INCH);
}

export function normalizeRatio(ratio: number): number {
  return round2(clamp(ratio || DEFAULT_PEAR_RATIO, PEAR_RATIO_MIN, PEAR_RATIO_MAX));
}

export function pearWidth(length: number, ratio = DEFAULT_PEAR_RATIO): number {
  return round2(Math.max(0.1, length) / normalizeRatio(ratio));
}

export function pearDepth(width: number): number {
  return round2(Math.max(0.1, width) * PEAR_DEPTH_FACTOR);
}

export function pearDimensions(length: number, ratio = DEFAULT_PEAR_RATIO) {
  const lengthMm = round1(length);
  const widthMm = pearWidth(lengthMm, ratio);
  const depthMm = pearDepth(widthMm);
  return { lengthMm, widthMm, depthMm };
}

/** Pear weight estimate: length × width × 61% depth × 0.0060. */
export function caratOf(length: number, ratio = DEFAULT_PEAR_RATIO): number {
  const { lengthMm, widthMm, depthMm } = pearDimensions(length, ratio);
  return round4(lengthMm * widthMm * depthMm * 0.006);
}

export function perCtFor(sizeMm: number, brackets: PriceBracket[]): number {
  if (brackets.length === 0) return 0;
  const hit = brackets.find((b) => sizeMm >= b.minMm && sizeMm < b.maxMm);
  if (hit) return hit.perCt;
  const last = brackets[brackets.length - 1];
  if (sizeMm >= last.maxMm) return last.perCt;
  return brackets[0].perCt;
}

export function defaultPrices(metal: Metal): PriceBracket[] {
  if (metal === "gold") {
    return [
      { minMm: 1.5, maxMm: 2.0, perCt: 450 },
      { minMm: 2.0, maxMm: 2.5, perCt: 550 },
      { minMm: 2.5, maxMm: 3.0, perCt: 750 },
      { minMm: 3.0, maxMm: 4.0, perCt: 1100 },
      { minMm: 4.0, maxMm: 5.0, perCt: 1800 },
      { minMm: 5.0, maxMm: 6.5, perCt: 3200 },
      { minMm: 6.5, maxMm: 11.1, perCt: 5500 },
    ];
  }
  return [
    { minMm: 3.5, maxMm: 5.0, perCt: 8 },
    { minMm: 5.0, maxMm: 8.0, perCt: 12 },
    { minMm: 8.0, maxMm: 12.1, perCt: 18 },
  ];
}

export function lockMm(stoneMm: number, gap: number): number {
  return round2(LOCK_STONES * (stoneMm + gap));
}

export function converterMm(stoneMm: number, gap: number): number {
  return round2(CONVERTER_STONES * (stoneMm + gap));
}

/** Closed-loop span: every station carries one gap, including wrap. */
export function spanOf(sizes: number[], gap: number): number {
  if (sizes.length === 0) return 0;
  return round2(
    sizes.reduce((a, d) => a + d, 0) + sizes.length * gap,
  );
}

function bomFrom(
  stones: number[],
  prices: PriceBracket[],
  ratio: number,
): BomLine[] {
  const counts = new Map<number, number>();
  for (const d of stones) {
    const key = round1(d);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const sizes = [...counts.keys()].sort((a, b) => a - b);
  return sizes.map((sizeMm) => {
    const pcs = counts.get(sizeMm) ?? 0;
    const dims = pearDimensions(sizeMm, ratio);
    const carat = round4(caratOf(sizeMm, ratio) * pcs);
    const perCt = perCtFor(sizeMm, prices);
    return {
      sizeMm,
      ...dims,
      pcs,
      carat,
      perCt,
      cost: round2(carat * perCt),
    };
  });
}

function fitLabel(leftoverMm: number): SegmentFit["fit"] {
  if (leftoverMm < -2.5) return "long";
  if (leftoverMm > 4) return "short";
  return "ok";
}

function makeSegment(
  label: string,
  lengthIn: number,
  sizes: number[],
  gap: number,
  prices: PriceBracket[],
  ratio: number,
): SegmentFit {
  const target = lengthMm(lengthIn);
  const setMm = spanOf(sizes, gap);
  const leftoverMm = round2(target - setMm);
  const bom = bomFrom(sizes, prices, ratio);
  return {
    label,
    lengthIn,
    lengthMm: target,
    setMm,
    leftoverMm,
    fit: fitLabel(leftoverMm),
    pcs: sizes.length,
    carat: round4(bom.reduce((a, l) => a + l.carat, 0)),
    bom,
  };
}

export function countClosed(
  segmentMm: number,
  sizeMm: number,
  gapMm: number,
  hardware: number,
): number {
  const pitch = sizeMm + gapMm;
  if (pitch <= 0) return 0;
  return Math.max(0, Math.floor(segmentMm / pitch + 1e-9) - hardware);
}

/**
 * Pack a run so sum(d) + n·gap ≤ spanMm. Largest at the center of the run
 * (front of the necklace), smallest toward both converters.
 */
function packRun(
  minSize: number,
  maxSize: number,
  gapMm: number,
  spanMm: number,
  metal: Metal,
): number[] {
  if (spanMm <= 0.05) return [];
  const pitchMin = minSize + gapMm;
  if (Math.abs(maxSize - minSize) < 0.05) {
    const n = Math.max(0, Math.floor((spanMm + 1e-9) / pitchMin));
    return Array.from({ length: n }, () => minSize);
  }

  const min = Math.min(minSize, maxSize);
  const max = Math.max(minSize, maxSize);
  const step = METAL[metal].step;
  const snap = (v: number) => {
    const n = Math.round(v / step);
    return clamp(round1(n * step), min, max);
  };

  const center = snap(max);
  const centerSpan = center + gapMm;
  if (centerSpan > spanMm) {
    const n = Math.max(0, Math.floor((spanMm + 1e-9) / pitchMin));
    return Array.from({ length: n }, () => min);
  }

  const half = spanMm / 2;
  const outward: number[] = [];
  let used = centerSpan / 2;

  for (let i = 0; i < 400; i++) {
    const t = clamp(used / Math.max(half, 0.0001), 0, 1);
    const d = snap(max + (min - max) * t);
    const need = d + gapMm;
    if (used + need > half + 1e-9) break;
    outward.push(d);
    used += need;
  }

  let stones = [...outward].reverse().concat(center, outward);
  let leftover = spanMm - spanOf(stones, gapMm);
  const add = min + gapMm;
  while (leftover + 1e-9 >= add * 2 && stones.length < 400) {
    stones = [min, ...stones, min];
    leftover -= add * 2;
  }
  // Preserve a true mirrored graduation. A single extra pear would bias one
  // converter end, so any remainder below a pair stays as reported slack.
  return stones;
}

/** Wrap BOM counts: largest at front, split toward both converters. */
export function layoutFromList(list: ListLine[]): number[] {
  const lines = list
    .filter((l) => l.pcs > 0 && l.sizeMm > 0)
    .sort((a, b) => b.sizeMm - a.sizeMm);
  let seq: number[] = [];
  for (const line of lines) {
    const left = Math.ceil(line.pcs / 2);
    const right = Math.floor(line.pcs / 2);
    seq = [
      ...Array.from({ length: left }, () => line.sizeMm),
      ...seq,
      ...Array.from({ length: right }, () => line.sizeMm),
    ];
  }
  return seq;
}

function makeStation(
  kind: StationKind,
  sizeMm: number,
  ratio: number,
): Station {
  return { sizeMm, ...pearDimensions(sizeMm, ratio), kind };
}

function repeat(
  kind: StationKind,
  sizeMm: number,
  n: number,
  ratio: number,
): Station[] {
  return Array.from({ length: n }, () => makeStation(kind, sizeMm, ratio));
}

function buildStations(
  d: number,
  braceletRun: number[],
  necklaceRun: number[],
  ratio: number,
): Station[] {
  return [
    ...repeat("lock1-f", d, LOCK_FEMALE, ratio),
    ...braceletRun.map((sizeMm) => makeStation("bracelet", sizeMm, ratio)),
    ...repeat("lock1-m", d, LOCK_MALE, ratio),
    ...repeat("lock2-f", d, LOCK_FEMALE, ratio),
    ...repeat("conv-l", d, CONVERTER_STONES, ratio),
    ...necklaceRun.map((sizeMm) => makeStation("necklace", sizeMm, ratio)),
    ...repeat("conv-r", d, CONVERTER_STONES, ratio),
    ...repeat("lock2-m", d, LOCK_MALE, ratio),
  ];
}

function assemblySteps(
  d: number,
  braceletIn: number,
  necklaceIn: number,
  braceletRun: number,
  necklaceRun: number,
  ratio: number,
): AssemblyStep[] {
  const s = formatPearSize(d, ratio);
  return [
    {
      n: 1,
      title: "Lock 1 female · box",
      detail: `Concealed spring lock. Set ${LOCK_FEMALE} × ${s} mm pears on the box. Bracelet joint.`,
    },
    {
      n: 2,
      title: "Bracelet run",
      detail: `${braceletRun} pcs × ${s} mm pears, single size. Back ${braceletIn}″ finished, including lock 1.`,
    },
    {
      n: 3,
      title: "Lock 1 male · tongue",
      detail: `Same lock SKU. Set ${LOCK_MALE} × ${s} mm on the tongue. Closes into lock 1 female for bracelet mode.`,
    },
    {
      n: 4,
      title: "Lock 2 female · box",
      detail: `Identical lock to #1. Set ${LOCK_FEMALE} × ${s} mm. Right shoulder when worn as necklace.`,
    },
    {
      n: 5,
      title: "Left converter",
      detail: `1 × ${s} mm. Hinge A: necklace joint. Hinge B: bracelet / lock joint.`,
    },
    {
      n: 6,
      title: "Necklace run",
      detail: `${necklaceRun} pcs. Largest at front center. Front ${necklaceIn}″ finished, including lock 2 and both converters.`,
    },
    {
      n: 7,
      title: "Right converter",
      detail: `1 × ${s} mm. Same dual hinge as left, mirrored.`,
    },
    {
      n: 8,
      title: "Lock 2 male · tongue",
      detail: `Set ${LOCK_MALE} × ${s} mm. Same SKU as lock 1 male.`,
    },
    {
      n: 9,
      title: "Close the loop",
      detail: `Necklace mode: male 2 → female 1 (left shoulder) and male 1 → female 2 (right shoulder). Open either lock. Bracelet mode: disconnect converters, close lock 1 on itself.`,
    },
  ];
}

function findingsOf(d: number, ratio: number): FindingLine[] {
  const dims = pearDimensions(d, ratio);
  const s = formatPearSize(d, ratio);
  return [
    {
      id: "lock",
      name: "Concealed spring lock",
      detail: `${s} mm · 3-stone cover (box 2 / tongue 1) · same SKU both sides`,
      sizeMm: d,
      lengthMm: dims.lengthMm,
      widthMm: dims.widthMm,
      pcs: 2,
      stonesOnTop: LOCK_STONES,
    },
    {
      id: "converter",
      name: "Converter",
      detail: `${s} mm · dual hinge · necklace joint + bracelet joint`,
      sizeMm: d,
      lengthMm: dims.lengthMm,
      widthMm: dims.widthMm,
      pcs: 2,
      stonesOnTop: CONVERTER_STONES,
    },
  ];
}

function layoutOnce(
  input: PatternInput,
  d: number,
  gap: number,
  necklaceRun: number[],
): PatternResult {
  const ratio = normalizeRatio(input.ratio);
  const braceletIn = input.braceletIn;
  const necklaceIn = round2(input.lengthIn - braceletIn);
  const bMm = lengthMm(braceletIn);
  const nB = countClosed(bMm, d, gap, LOCK_STONES);
  const braceletRun = Array.from({ length: nB }, () => d);

  const stations = buildStations(d, braceletRun, necklaceRun, ratio);
  const stones = stations.map((s) => s.sizeMm);
  const totalMm = spanOf(stones, gap);
  const length = lengthMm(input.lengthIn);
  const leftoverMm = round2(length - totalMm);

  const braceletSizes = [
    ...Array.from({ length: LOCK_FEMALE }, () => d),
    ...braceletRun,
    ...Array.from({ length: LOCK_MALE }, () => d),
  ];
  const necklaceSizes = [
    ...Array.from({ length: LOCK_FEMALE }, () => d),
    ...Array.from({ length: CONVERTER_STONES }, () => d),
    ...necklaceRun,
    ...Array.from({ length: CONVERTER_STONES }, () => d),
    ...Array.from({ length: LOCK_MALE }, () => d),
  ];

  const bracelet = makeSegment(
    "Bracelet",
    braceletIn,
    braceletSizes,
    gap,
    input.prices,
    ratio,
  );
  const necklace = makeSegment(
    "Necklace front",
    necklaceIn,
    necklaceSizes,
    gap,
    input.prices,
    ratio,
  );
  const bom = bomFrom(stones, input.prices, ratio);
  const totalCarat = round4(bom.reduce((a, l) => a + l.carat, 0));
  const totalCost = round2(bom.reduce((a, l) => a + l.cost, 0));
  const lock = lockMm(d, gap);

  return {
    stones,
    stations,
    bom,
    totalPcs: stones.length,
    totalCarat,
    totalCost,
    lengthIn: input.lengthIn,
    lengthMm: length,
    braceletIn,
    necklaceIn,
    claspMm: round2(lock * 2),
    lockMm: lock,
    converterMm: converterMm(d, gap),
    gapMm: round2(gap),
    ratio,
    depthFactor: PEAR_DEPTH_FACTOR,
    orientation: PEAR_ORIENTATION,
    minSize: d,
    maxSize:
      necklaceRun.length > 0
        ? necklaceRun.reduce((a, b) => Math.max(a, b), d)
        : d,
    setMm: totalMm,
    totalMm,
    leftoverMm,
    fit: fitLabel(leftoverMm),
    gapOutOfRange: gap < GAP_MIN - 0.005 || gap > GAP_MAX + 0.005,
    metal: input.metal,
    mode: input.mode,
    bracelet,
    necklace,
    findings: findingsOf(d, ratio),
    assembly: assemblySteps(
      d,
      braceletIn,
      necklaceIn,
      braceletRun.length,
      necklaceRun.length,
      ratio,
    ),
  };
}

export function buildPattern(input: PatternInput): PatternResult {
  const braceletIn = input.braceletIn ?? 7;
  const gap0 = clamp(input.gapMm, 0.05, 1.5);
  const listSnapped = input.list.map((l) => ({
    sizeMm: snapSize(l.sizeMm, input.metal),
    pcs: Math.max(0, Math.round(l.pcs)),
  }));
  const fromList =
    input.mode === "list" && listSnapped.some((l) => l.pcs > 0);
  const d = snapSize(
    fromList
      ? Math.min(...listSnapped.filter((l) => l.pcs > 0).map((l) => l.sizeMm))
      : Math.min(input.minSize, input.maxSize),
    input.metal,
  );
  const max = snapSize(
    fromList
      ? Math.max(...listSnapped.filter((l) => l.pcs > 0).map((l) => l.sizeMm))
      : Math.max(input.minSize, input.maxSize),
    input.metal,
  );
  const filled: PatternInput = {
    ...input,
    braceletIn,
    minSize: d,
    maxSize: max,
    ratio: normalizeRatio(input.ratio),
  };

  const necklaceIn = round2(input.lengthIn - braceletIn);
  const nMm = lengthMm(necklaceIn);
  const hardware = LOCK_STONES + CONVERTER_STONES * 2;

  let gap = gap0;
  let necklaceRun: number[] = [];

  if (input.mode === "list" && fromList) {
    necklaceRun = layoutFromList(listSnapped);
    if (input.autoGapFromList) {
      for (let i = 0; i < 6; i++) {
        const trial = layoutOnce(filled, d, gap, necklaceRun);
        const sizes = trial.stones;
        if (sizes.length === 0) break;
        const next = (lengthMm(input.lengthIn) - sizes.reduce((a, x) => a + x, 0)) /
          sizes.length;
        if (!Number.isFinite(next)) break;
        gap = round2(clamp(next, 0.05, 1.5));
      }
    }
    return layoutOnce(filled, d, gap, necklaceRun);
  }

  const span = nMm - hardware * (d + gap);
  necklaceRun = packRun(d, max, gap, span, input.metal);
  return layoutOnce(filled, d, gap, necklaceRun);
}

export function styleVariants(
  metal: Metal,
  lengthIn: LengthIn,
  gapMm: number,
  prices: PriceBracket[],
  braceletIn: BraceletIn = 7,
  ratio: number = DEFAULT_PEAR_RATIO,
): Variant[] {
  const base = {
    metal,
    lengthIn,
    braceletIn,
    gapMm,
    list: [] as ListLine[],
    prices,
    mode: "range" as const,
    ratio,
  };

  const lineSize = metal === "gold" ? 1.8 : 3.5;
  const classicSize = metal === "gold" ? 2.5 : 5.0;
  const rivMin = metal === "gold" ? 1.7 : 3.5;
  const rivMax = metal === "gold" ? 3.2 : 8.0;

  const mk = (
    id: string,
    name: string,
    note: string,
    minSize: number,
    maxSize: number,
  ): Variant => {
    const result = buildPattern({ ...base, minSize, maxSize });
    return { id, name, note, minSize, maxSize, mode: "range", list: [], result };
  };

  return [
    mk("line", "Line", "Single size throughout", lineSize, lineSize),
    mk("classic", "Classic", "Single size, mid melee", classicSize, classicSize),
    mk(
      "riviere",
      "Rivière",
      "Graduated front, bracelet in smallest",
      rivMin,
      rivMax,
    ),
  ];
}

function score(value: number, target: number): number {
  return Math.abs(value - target);
}

export function searchByTarget(
  metal: Metal,
  lengthIn: LengthIn,
  gapMm: number,
  prices: PriceBracket[],
  kind: "carat" | "budget",
  target: number,
  braceletIn: BraceletIn = 7,
  ratio: number = DEFAULT_PEAR_RATIO,
): Variant[] {
  if (!(target > 0)) return [];
  const grid = sizeGrid(metal);
  const step = METAL[metal].step;
  const sample =
    metal === "gold" ? grid.filter((_, i) => i % 2 === 0) : grid;

  type Cand = {
    minSize: number;
    maxSize: number;
    result: PatternResult;
    metric: number;
  };
  const cands: Cand[] = [];
  const base = {
    metal,
    lengthIn,
    braceletIn,
    gapMm,
    list: [] as ListLine[],
    prices,
    mode: "range" as const,
    ratio,
  };

  for (const size of grid) {
    const result = buildPattern({ ...base, minSize: size, maxSize: size });
    if (result.totalPcs < 8) continue;
    const metric = kind === "carat" ? result.totalCarat : result.totalCost;
    cands.push({ minSize: size, maxSize: size, result, metric });
  }

  for (let i = 0; i < sample.length; i++) {
    for (let j = i + 2; j < sample.length; j++) {
      const minSize = sample[i];
      const maxSize = sample[j];
      if (maxSize - minSize < step * 3) continue;
      const result = buildPattern({ ...base, minSize, maxSize });
      if (result.totalPcs < 8) continue;
      const metric = kind === "carat" ? result.totalCarat : result.totalCost;
      cands.push({ minSize, maxSize, result, metric });
    }
  }

  cands.sort((a, b) => score(a.metric, target) - score(b.metric, target));

  const picked: Cand[] = [];
  for (const c of cands) {
    if (picked.length >= 3) break;
    const dup = picked.some(
      (p) => p.minSize === c.minSize && p.maxSize === c.maxSize,
    );
    if (dup) continue;
    picked.push(c);
  }

  const names = ["Match", "Near", "Alt"];
  return picked.map((c, i) => ({
    id: `match-${i}`,
    name: names[i] ?? `Mix ${i + 1}`,
    note:
      c.minSize === c.maxSize
        ? `Single ${c.minSize.toFixed(1)} mm`
        : `${c.minSize.toFixed(1)} → ${c.maxSize.toFixed(1)} mm`,
    minSize: c.minSize,
    maxSize: c.maxSize,
    mode: "range" as const,
    list: [],
    result: c.result,
  }));
}

export function formatBomText(result: PatternResult): string {
  const metal = result.metal === "gold" ? "Gold" : "Silver";
  const kind =
    result.minSize === result.maxSize ? "single" : "graduated";
  const lines = [
    `${result.lengthIn}″ ${metal} pear rivière · ${kind}`,
    `Back bracelet ${result.braceletIn}″ · front ${result.necklaceIn}″`,
    `Pear ratio ${result.ratio.toFixed(2)} · depth ${Math.round(result.depthFactor * 100)}% of width`,
    `Lock ${formatPearSize(result.minSize, result.ratio)} mm concealed spring × 2 · converter × 2`,
    `Orientation: ${result.orientation}`,
    "",
    "BRACELET",
    ...result.bracelet.bom.map(
      (l) => `  ${formatPearSize(l.lengthMm, result.ratio)} = ${l.pcs}`,
    ),
    `  ${result.bracelet.pcs} pcs · ${formatCarat(result.bracelet.carat)} ct · leftover ${result.bracelet.leftoverMm.toFixed(1)} mm`,
    "",
    "NECKLACE FRONT",
    ...result.necklace.bom.map(
      (l) => `  ${formatPearSize(l.lengthMm, result.ratio)} = ${l.pcs}`,
    ),
    `  ${result.necklace.pcs} pcs · ${formatCarat(result.necklace.carat)} ct · leftover ${result.necklace.leftoverMm.toFixed(1)} mm`,
    "",
    "FINDINGS",
    ...result.findings.map(
      (f) => `  ${f.pcs} × ${f.name} · ${f.detail}`,
    ),
    "",
    "ASSEMBLY",
    ...result.assembly.map((s) => `${s.n}. ${s.title} — ${s.detail}`),
    "",
    `TOTAL ${result.totalPcs} pcs · ${formatCarat(result.totalCarat)} ct · ${formatMoney(result.totalCost)}`,
    `Gap ${result.gapMm.toFixed(2)} mm · ${spanOf(result.stones, result.gapMm).toFixed(1)} mm of ${result.lengthMm.toFixed(1)} mm`,
  ];
  return lines.join("\n");
}

export function formatSize(mm: number): string {
  return Number.isInteger(round1(mm))
    ? String(Math.round(mm))
    : round1(mm).toFixed(1);
}

export function formatPearSize(
  length: number,
  ratio = DEFAULT_PEAR_RATIO,
): string {
  const { lengthMm, widthMm } = pearDimensions(length, ratio);
  return `${formatSize(lengthMm)} × ${formatSize(widthMm)}`;
}

export function formatCarat(ct: number): string {
  const s =
    ct >= 10 ? ct.toFixed(2) : ct >= 1 ? ct.toFixed(3) : ct.toFixed(4);
  return s.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 100 ? 0 : 2,
  }).format(n);
}

export function csvBom(result: PatternResult): string {
  const header = "unit,length_mm,width_mm,depth_mm,pcs,carat,usd_per_ct,cost_usd";
  const row = (unit: string, l: BomLine) =>
    `${unit},${l.lengthMm},${l.widthMm},${l.depthMm},${l.pcs},${l.carat.toFixed(4)},${l.perCt},${l.cost.toFixed(2)}`;
  const rows = [
    ...result.bracelet.bom.map((l) => row("bracelet", l)),
    ...result.necklace.bom.map((l) => row("necklace", l)),
    `TOTAL,all,all,all,${result.totalPcs},${result.totalCarat.toFixed(4)},,${result.totalCost.toFixed(2)}`,
    ...result.findings.map(
      (f) => `finding,${f.lengthMm},${f.widthMm},,${f.pcs},,,`,
    ),
  ];
  return [header, ...rows].join("\n");
}

export type SavedConfig = {
  metal: Metal;
  lengthIn: LengthIn;
  braceletIn: BraceletIn;
  gapMm: number;
  ratio: number;
  mode: PatternMode;
  minSize: number;
  maxSize: number;
  list: ListLine[];
  prices: PriceBracket[];
  autoGapFromList: boolean;
  targetCt: number | null;
  budget: number | null;
  metalColor: MetalColor;
  projectId: string;
  projectName: string;
  notes: string;
};
