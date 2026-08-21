/** Shop bezel metal: 4.5 mm round Ag925 = 0.4 g. Volume scales with d³. */

export const SILVER_BEZEL_REF_MM = 4.5;
export const SILVER_BEZEL_REF_G = 0.4;

export const ALLOYS = {
  k18: { id: "k18", label: "18K gold", short: "18K", density: 15.45 },
  k14: { id: "k14", label: "14K gold", short: "14K", density: 13.07 },
  k9: { id: "k9", label: "9K gold", short: "9K", density: 11.35 },
  ag925: { id: "ag925", label: "Silver 925", short: "Ag 925", density: 10.36 },
  pt950: { id: "pt950", label: "Platinum", short: "Pt", density: 21.4 },
} as const;

export type AlloyId = keyof typeof ALLOYS;
export const ALLOY_ORDER: AlloyId[] = ["k18", "k14", "k9", "ag925", "pt950"];

export type MetalWeights = Record<AlloyId, number>;

export const DEFAULT_METAL_PRICES: MetalWeights = {
  k18: 114,
  k14: 89,
  k9: 57,
  ag925: 2.4,
  pt950: 63,
};

export type MetalQuote = {
  id: AlloyId;
  label: string;
  short: string;
  grams: number;
  perG: number;
  metalCost: number;
  stoneCost: number;
  total: number;
};

function round3(n: number): number {
  return Math.round((n + Number.EPSILON) * 1000) / 1000;
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Ag925 grams for one round bezel of diameter `mm`. */
export function silverBezelGrams(mm: number): number {
  const d = Math.max(0.1, mm);
  return round3(SILVER_BEZEL_REF_G * (d / SILVER_BEZEL_REF_MM) ** 3);
}

/** Pear bezel: equivalent round diameter = √(L × W). */
export function pearBezelGrams(lengthMm: number, widthMm: number): number {
  return silverBezelGrams(
    Math.sqrt(Math.max(0.1, lengthMm) * Math.max(0.1, widthMm)),
  );
}

export function alloyGramsFromSilver(agGrams: number): MetalWeights {
  const dAg = ALLOYS.ag925.density;
  const out = {} as MetalWeights;
  for (const id of ALLOY_ORDER) {
    out[id] = round3(agGrams * (ALLOYS[id].density / dAg));
  }
  return out;
}

export function bezelGramsRound(sizesMm: readonly number[]): number {
  return round3(sizesMm.reduce((sum, mm) => sum + silverBezelGrams(mm), 0));
}

export function bezelGramsPear(
  pears: readonly { lengthMm: number; widthMm: number }[],
): number {
  return round3(
    pears.reduce(
      (sum, p) => sum + pearBezelGrams(p.lengthMm, p.widthMm),
      0,
    ),
  );
}

export function normalizeMetalPrices(
  prices?: Partial<Record<AlloyId, number>> | null,
): MetalWeights {
  const out = { ...DEFAULT_METAL_PRICES };
  if (!prices) return out;
  for (const id of ALLOY_ORDER) {
    const v = Number(prices[id]);
    if (Number.isFinite(v) && v >= 0) out[id] = v;
  }
  return out;
}

export function quoteMetals(
  agGrams: number,
  stoneCost: number,
  prices: Partial<Record<AlloyId, number>> = DEFAULT_METAL_PRICES,
): MetalQuote[] {
  const rates = normalizeMetalPrices(prices);
  const weights = alloyGramsFromSilver(agGrams);
  const stones = round2(stoneCost);
  return ALLOY_ORDER.map((id) => {
    const grams = weights[id];
    const perG = rates[id];
    const metalCost = round2(grams * perG);
    return {
      id,
      label: ALLOYS[id].label,
      short: ALLOYS[id].short,
      grams,
      perG,
      metalCost,
      stoneCost: stones,
      total: round2(metalCost + stones),
    };
  });
}
