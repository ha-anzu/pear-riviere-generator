import {
  DEFAULT_PEAR_SKU,
  PEAR_CATALOG,
  catalogBetween,
  formatPearSku,
  pearRatioOf,
  resolvePearSku,
  type PearSku,
} from "./pear-catalog.ts";

export type { PearSku };
export {
  DEFAULT_PEAR_SKU,
  PEAR_CATALOG,
  formatPearSku,
  pearRatioOf,
  pearSkuById,
  pearSkuId,
  pearSkuOptionLabel,
  resolvePearSku,
} from "./pear-catalog.ts";

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
export const DEFAULT_PEAR_RATIO = pearRatioOf(DEFAULT_PEAR_SKU);
export const PEAR_RATIO_MIN = 1.25;
export const PEAR_RATIO_MAX = 1.8;
export const PEAR_DEPTH_FACTOR = 0.61;
export const PEAR_ORIENTATION =
  "Tip-out: every pear tip points radially away from the necklace center; the rounded lobe faces the neck. Strand pitch is pear width + gap." ;

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
  /** Pear length (mm). */
  sizeMm: number;
  /** Pear width (mm). Required for catalog SKUs that share a length. */
  widthMm?: number;
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
  minWidth?: number;
  maxWidth?: number;
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

export function skuOf(length: number, width?: number, ratio = DEFAULT_PEAR_RATIO): PearSku {
  if (width && width > 0) return resolvePearSku(length, width);
  const fromLength = resolvePearSku(length);
  if (Math.abs(fromLength.lengthMm - round1(length)) < 0.05) return fromLength;
  const widthMm = round2(Math.max(0.1, length) / normalizeRatio(ratio));
  return resolvePearSku(length, widthMm);
}

export function pearWidth(length: number, ratio = DEFAULT_PEAR_RATIO, width?: number): number {
  return skuOf(length, width, ratio).widthMm;
}

export function pearDepth(width: number): number {
  return round2(Math.max(0.1, width) * PEAR_DEPTH_FACTOR);
}

export function pearDimensions(length: number, ratio = DEFAULT_PEAR_RATIO, width?: number) {
  const sku = skuOf(length, width, ratio);
  return {
    lengthMm: sku.lengthMm,
    widthMm: sku.widthMm,
    depthMm: pearDepth(sku.widthMm),
  };
}

/** Tip points radially outward. PearMark draws tip-up at rotation 0. */
export function pearTipOutRotation(angleRadians: number): number {
  return (angleRadians * 180) / Math.PI + 90;
}

/** @deprecated Name kept for call sites; orientation is tip-out. */
export function pearShoulderRotation(
  _x: number,
  _y: number,
  angleRadians: number,
  _cx: number,
  _cy: number,
): number {
  return pearTipOutRotation(angleRadians);
}

/** Catalog carat when the size matches a trade SKU; otherwise L×W×61%×0.006. */
export function caratOf(length: number, ratio = DEFAULT_PEAR_RATIO, width?: number): number {
  const sku = skuOf(length, width, ratio);
  if (Math.abs(sku.lengthMm - round1(length)) < 0.05) return sku.carat;
  const { lengthMm, widthMm, depthMm } = pearDimensions(length, ratio, width);
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
      { minMm: 5.0, maxMm: 6.0, perCt: 1800 },
      { minMm: 6.0, maxMm: 7.0, perCt: 2200 },
      { minMm: 7.0, maxMm: 8.0, perCt: 2800 },
      { minMm: 8.0, maxMm: 10.0, perCt: 3600 },
      { minMm: 10.0, maxMm: 12.0, perCt: 4800 },
      { minMm: 12.0, maxMm: 16.0, perCt: 6500 },
    ];
  }
  return [
    { minMm: 5.0, maxMm: 8.0, perCt: 12 },
    { minMm: 8.0, maxMm: 12.0, perCt: 18 },
    { minMm: 12.0, maxMm: 16.0, perCt: 24 },
  ];
}

export function lockMm(
  stoneMm: number,
  gap: number,
  ratio = DEFAULT_PEAR_RATIO,
): number {
  return round2(LOCK_STONES * (pearWidth(stoneMm, ratio) + gap));
}

export function converterMm(
  stoneMm: number,
  gap: number,
  ratio = DEFAULT_PEAR_RATIO,
): number {
  return round2(CONVERTER_STONES * (pearWidth(stoneMm, ratio) + gap));
}

/** Closed-loop span: radial pears occupy their width plus one wrap gap. */
export function spanOf(
  sizes: number[],
  gap: number,
  ratio = DEFAULT_PEAR_RATIO,
): number {
  if (sizes.length === 0) return 0;
  return round2(
    sizes.reduce((a, length) => a + pearWidth(length, ratio), 0) +
      sizes.length * gap,
  );
}

function skuFromLength(length: number, ratio: number, width?: number): PearSku {
  return skuOf(length, width, ratio);
}

function spanOfSkus(skus: PearSku[], gap: number): number {
  if (skus.length === 0) return 0;
  return round2(skus.reduce((sum, sku) => sum + sku.widthMm, 0) + skus.length * gap);
}

function bomFromSkus(skus: PearSku[], prices: PriceBracket[]): BomLine[] {
  const counts = new Map<string, { sku: PearSku; pcs: number }>();
  for (const sku of skus) {
    const cur = counts.get(sku.id);
    if (cur) cur.pcs += 1;
    else counts.set(sku.id, { sku, pcs: 1 });
  }
  return [...counts.values()]
    .sort((a, b) => a.sku.lengthMm - b.sku.lengthMm || a.sku.widthMm - b.sku.widthMm)
    .map(({ sku, pcs }) => {
      const carat = round4(sku.carat * pcs);
      const perCt = perCtFor(sku.lengthMm, prices);
      return {
        sizeMm: sku.lengthMm,
        lengthMm: sku.lengthMm,
        widthMm: sku.widthMm,
        depthMm: pearDepth(sku.widthMm),
        pcs,
        carat,
        perCt,
        cost: round2(carat * perCt),
      };
    });
}

function bomFrom(
  stones: number[],
  prices: PriceBracket[],
  ratio: number,
): BomLine[] {
  return bomFromSkus(stones.map((length) => skuFromLength(length, ratio)), prices);
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
  const setMm = spanOf(sizes, gap, ratio);
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
  ratio = DEFAULT_PEAR_RATIO,
): number {
  const pitch = pearWidth(sizeMm, ratio) + gapMm;
  if (pitch <= 0) return 0;
  return Math.max(0, Math.floor(segmentMm / pitch + 1e-9) - hardware);
}

/**
 * Pack a run so sum(d) + n·gap ≤ spanMm. Largest at the center of the run
 * (front of the necklace), smallest toward both converters.
 */
function packRun(
  minSku: PearSku,
  maxSku: PearSku,
  gapMm: number,
  spanMm: number,
): PearSku[] {
  if (spanMm <= 0.05) return [];
  const skus = catalogBetween(minSku, maxSku);
  if (skus.length === 0) return [];
  const small = skus[0];
  const large = skus[skus.length - 1];
  const pitchMin = small.widthMm + gapMm;
  if (skus.length === 1) {
    const n = Math.max(0, Math.floor((spanMm + 1e-9) / pitchMin));
    return Array.from({ length: n }, () => small);
  }

  const centerSpan = large.widthMm + gapMm;
  if (centerSpan > spanMm) {
    const n = Math.max(0, Math.floor((spanMm + 1e-9) / pitchMin));
    return Array.from({ length: n }, () => small);
  }

  const half = spanMm / 2;
  const outward: PearSku[] = [];
  let used = centerSpan / 2;

  for (let i = 0; i < 400; i++) {
    const t = clamp(used / Math.max(half, 0.0001), 0, 1);
    const idx = Math.round((skus.length - 1) * (1 - t));
    const sku = skus[idx] ?? small;
    const need = sku.widthMm + gapMm;
    if (used + need > half + 1e-9) break;
    outward.push(sku);
    used += need;
  }

  let stones = [...outward].reverse().concat(large, outward);
  let leftover = spanMm - spanOfSkus(stones, gapMm);
  const add = pitchMin;
  while (leftover + 1e-9 >= add * 2 && stones.length < 400) {
    stones = [small, ...stones, small];
    leftover -= add * 2;
  }
  return stones;
}

/** Wrap BOM counts: largest at front, split toward both converters. */
export function layoutFromList(list: ListLine[]): number[] {
  return layoutSkusFromList(list).map((sku) => sku.lengthMm);
}

function layoutSkusFromList(list: ListLine[]): PearSku[] {
  const lines = list
    .filter((l) => l.pcs > 0 && l.sizeMm > 0)
    .map((l) => ({ sku: resolvePearSku(l.sizeMm, l.widthMm), pcs: l.pcs }))
    .sort((a, b) => b.sku.lengthMm - a.sku.lengthMm || b.sku.widthMm - a.sku.widthMm);
  let seq: PearSku[] = [];
  for (const line of lines) {
    const left = Math.ceil(line.pcs / 2);
    const right = Math.floor(line.pcs / 2);
    seq = [
      ...Array.from({ length: left }, () => line.sku),
      ...seq,
      ...Array.from({ length: right }, () => line.sku),
    ];
  }
  return seq;
}

function makeStation(kind: StationKind, sku: PearSku): Station {
  return {
    sizeMm: sku.lengthMm,
    lengthMm: sku.lengthMm,
    widthMm: sku.widthMm,
    depthMm: pearDepth(sku.widthMm),
    kind,
  };
}

function repeat(kind: StationKind, sku: PearSku, n: number): Station[] {
  return Array.from({ length: n }, () => makeStation(kind, sku));
}

function buildStations(
  d: PearSku,
  braceletRun: PearSku[],
  necklaceRun: PearSku[],
): Station[] {
  return [
    ...repeat("lock1-f", d, LOCK_FEMALE),
    ...braceletRun.map((sku) => makeStation("bracelet", sku)),
    ...repeat("lock1-m", d, LOCK_MALE),
    ...repeat("lock2-f", d, LOCK_FEMALE),
    ...repeat("conv-l", d, CONVERTER_STONES),
    ...necklaceRun.map((sku) => makeStation("necklace", sku)),
    ...repeat("conv-r", d, CONVERTER_STONES),
    ...repeat("lock2-m", d, LOCK_MALE),
  ];
}

function assemblySteps(
  d: PearSku,
  braceletIn: number,
  necklaceIn: number,
  braceletRun: number,
  necklaceRun: number,
): AssemblyStep[] {
  const s = formatPearSku(d);
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

function findingsOf(d: PearSku): FindingLine[] {
  const s = formatPearSku(d);
  return [
    {
      id: "lock",
      name: "Concealed spring lock",
      detail: `${s} mm · 3-stone cover (box 2 / tongue 1) · same SKU both sides`,
      sizeMm: d.lengthMm,
      lengthMm: d.lengthMm,
      widthMm: d.widthMm,
      pcs: 2,
      stonesOnTop: LOCK_STONES,
    },
    {
      id: "converter",
      name: "Converter",
      detail: `${s} mm · dual hinge · necklace joint + bracelet joint`,
      sizeMm: d.lengthMm,
      lengthMm: d.lengthMm,
      widthMm: d.widthMm,
      pcs: 2,
      stonesOnTop: CONVERTER_STONES,
    },
  ];
}

function layoutOnce(
  input: PatternInput,
  d: PearSku,
  gap: number,
  necklaceRun: PearSku[],
): PatternResult {
  const ratio = pearRatioOf(d);
  const braceletIn = input.braceletIn;
  const necklaceIn = round2(input.lengthIn - braceletIn);
  const bMm = lengthMm(braceletIn);
  const nB = countClosed(bMm, d.lengthMm, gap, LOCK_STONES, ratio);
  const braceletRun = Array.from({ length: nB }, () => d);

  const stations = buildStations(d, braceletRun, necklaceRun);
  const stones = stations.map((s) => s.sizeMm);
  const skus = stations.map((s) => resolvePearSku(s.lengthMm, s.widthMm));
  const totalMm = spanOfSkus(skus, gap);
  const length = lengthMm(input.lengthIn);
  const leftoverMm = round2(length - totalMm);

  const braceletSkus = [
    ...Array.from({ length: LOCK_FEMALE }, () => d),
    ...braceletRun,
    ...Array.from({ length: LOCK_MALE }, () => d),
  ];
  const necklaceSkus = [
    ...Array.from({ length: LOCK_FEMALE }, () => d),
    ...Array.from({ length: CONVERTER_STONES }, () => d),
    ...necklaceRun,
    ...Array.from({ length: CONVERTER_STONES }, () => d),
    ...Array.from({ length: LOCK_MALE }, () => d),
  ];

  const bracelet = makeSegment(
    "Bracelet",
    braceletIn,
    braceletSkus.map((sku) => sku.lengthMm),
    gap,
    input.prices,
    ratio,
  );
  bracelet.setMm = spanOfSkus(braceletSkus, gap);
  bracelet.leftoverMm = round2(bracelet.lengthMm - bracelet.setMm);
  bracelet.fit = fitLabel(bracelet.leftoverMm);
  bracelet.bom = bomFromSkus(braceletSkus, input.prices);
  bracelet.carat = round4(bracelet.bom.reduce((a, l) => a + l.carat, 0));

  const necklace = makeSegment(
    "Necklace front",
    necklaceIn,
    necklaceSkus.map((sku) => sku.lengthMm),
    gap,
    input.prices,
    ratio,
  );
  necklace.setMm = spanOfSkus(necklaceSkus, gap);
  necklace.leftoverMm = round2(necklace.lengthMm - necklace.setMm);
  necklace.fit = fitLabel(necklace.leftoverMm);
  necklace.bom = bomFromSkus(necklaceSkus, input.prices);
  necklace.carat = round4(necklace.bom.reduce((a, l) => a + l.carat, 0));

  const bom = bomFromSkus(skus, input.prices);
  const totalCarat = round4(bom.reduce((a, l) => a + l.carat, 0));
  const totalCost = round2(bom.reduce((a, l) => a + l.cost, 0));
  const lock = round2(LOCK_STONES * (d.widthMm + gap));

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
    converterMm: round2(CONVERTER_STONES * (d.widthMm + gap)),
    gapMm: round2(gap),
    ratio,
    depthFactor: PEAR_DEPTH_FACTOR,
    orientation: PEAR_ORIENTATION,
    minSize: d.lengthMm,
    maxSize:
      necklaceRun.length > 0
        ? necklaceRun.reduce((a, sku) => Math.max(a, sku.lengthMm), d.lengthMm)
        : d.lengthMm,
    setMm: totalMm,
    totalMm,
    leftoverMm,
    fit: fitLabel(leftoverMm),
    gapOutOfRange: gap < GAP_MIN - 0.005 || gap > GAP_MAX + 0.005,
    metal: input.metal,
    mode: input.mode,
    bracelet,
    necklace,
    findings: findingsOf(d),
    assembly: assemblySteps(
      d,
      braceletIn,
      necklaceIn,
      braceletRun.length,
      necklaceRun.length,
    ),
  };
}

export function buildPattern(input: PatternInput): PatternResult {
  const braceletIn = input.braceletIn ?? 7;
  const gap0 = clamp(input.gapMm, 0.05, 1.5);
  const listSnapped = input.list.map((l) => {
    const sku = resolvePearSku(l.sizeMm, l.widthMm);
    return {
      sizeMm: sku.lengthMm,
      widthMm: sku.widthMm,
      pcs: Math.max(0, Math.round(l.pcs)),
    };
  });
  const fromList =
    input.mode === "list" && listSnapped.some((l) => l.pcs > 0);
  const listedSkus = listSnapped
    .filter((l) => l.pcs > 0)
    .map((l) => resolvePearSku(l.sizeMm, l.widthMm));
  const minSku = fromList
    ? [...listedSkus].sort((a, b) => a.lengthMm - b.lengthMm || a.widthMm - b.widthMm)[0]
    : resolvePearSku(
        Math.min(input.minSize, input.maxSize),
        input.minWidth ?? input.maxWidth,
      );
  const maxSku = fromList
    ? [...listedSkus].sort((a, b) => b.lengthMm - a.lengthMm || b.widthMm - a.widthMm)[0]
    : resolvePearSku(
        Math.max(input.minSize, input.maxSize),
        input.maxWidth ?? input.minWidth,
      );
  const d = minSku ?? DEFAULT_PEAR_SKU;
  const max = maxSku ?? d;
  const filled: PatternInput = {
    ...input,
    braceletIn,
    minSize: d.lengthMm,
    maxSize: max.lengthMm,
    minWidth: d.widthMm,
    maxWidth: max.widthMm,
    ratio: pearRatioOf(d),
    list: listSnapped,
  };

  const necklaceIn = round2(input.lengthIn - braceletIn);
  const nMm = lengthMm(necklaceIn);
  const hardware = LOCK_STONES + CONVERTER_STONES * 2;

  let gap = gap0;
  let necklaceRun: PearSku[] = [];

  if (input.mode === "list" && fromList) {
    necklaceRun = layoutSkusFromList(listSnapped);
    if (input.autoGapFromList) {
      for (let i = 0; i < 6; i++) {
        const trial = layoutOnce(filled, d, gap, necklaceRun);
        const widths = trial.stations.map((station) => station.widthMm);
        if (widths.length === 0) break;
        const next =
          (lengthMm(input.lengthIn) - widths.reduce((a, w) => a + w, 0)) /
          widths.length;
        if (!Number.isFinite(next)) break;
        gap = round2(clamp(next, 0.05, 1.5));
      }
    }
    return layoutOnce(filled, d, gap, necklaceRun);
  }

  const span = nMm - hardware * (d.widthMm + gap);
  necklaceRun = packRun(d, max, gap, span);
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

  const lineSize = DEFAULT_PEAR_SKU.lengthMm;
  const classicSize = resolvePearSku(6, 4).lengthMm;
  const rivMin = DEFAULT_PEAR_SKU.lengthMm;
  const rivMax = resolvePearSku(8, 6).lengthMm;

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
  const grid = PEAR_CATALOG.map((sku) => sku.lengthMm);
  const sample = PEAR_CATALOG.filter((_, i) => i % 2 === 0).map((sku) => sku.lengthMm);

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
      if (maxSize - minSize < 1) continue;
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
    `Catalog L×W · depth ${Math.round(result.depthFactor * 100)}% of width · tip out`,
    `Lock ${formatPearSize(result.minSize, result.ratio)} mm concealed spring × 2 · converter × 2`,
    `Orientation: ${result.orientation}`,
    "",
    "BRACELET",
    ...result.bracelet.bom.map(
      (l) => `  ${formatPearSize(l.lengthMm, result.ratio, l.widthMm)} = ${l.pcs}`,
    ),
    `  ${result.bracelet.pcs} pcs · ${formatCarat(result.bracelet.carat)} ct · leftover ${result.bracelet.leftoverMm.toFixed(1)} mm`,
    "",
    "NECKLACE FRONT",
    ...result.necklace.bom.map(
      (l) => `  ${formatPearSize(l.lengthMm, result.ratio, l.widthMm)} = ${l.pcs}`,
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
    `Gap ${result.gapMm.toFixed(2)} mm · ${spanOf(result.stones, result.gapMm, result.ratio).toFixed(1)} mm of ${result.lengthMm.toFixed(1)} mm`,
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
  width?: number,
): string {
  return formatPearSku(skuOf(length, width, ratio));
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
  minWidth?: number;
  maxWidth?: number;
  list: ListLine[];
  prices: PriceBracket[];
  autoGapFromList: boolean;
  targetCt: number | null;
  budget: number | null;
  metalColor: MetalColor;
  projectId: string;
  projectName: string;
  notes: string;
  gemColors?: string[];
  colorScope?: "stone" | "pair" | "all";
};
