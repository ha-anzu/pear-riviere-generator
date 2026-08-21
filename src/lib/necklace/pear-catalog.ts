/** Trade pear sizes: length × width (mm) with shop-chart carat. */

export type PearSku = {
  id: string;
  lengthMm: number;
  widthMm: number;
  carat: number;
};

export const PEAR_CATALOG: readonly PearSku[] = [
  { id: "5x3", lengthMm: 5, widthMm: 3, carat: 0.25 },
  { id: "5x4", lengthMm: 5, widthMm: 4, carat: 0.35 },
  { id: "6x4", lengthMm: 6, widthMm: 4, carat: 0.5 },
  { id: "6.5x4.5", lengthMm: 6.5, widthMm: 4.5, carat: 0.6 },
  { id: "7x5", lengthMm: 7, widthMm: 5, carat: 0.75 },
  { id: "7.5x5.5", lengthMm: 7.5, widthMm: 5.5, carat: 0.85 },
  { id: "7.7x5.7", lengthMm: 7.7, widthMm: 5.7, carat: 1 },
  { id: "8x6", lengthMm: 8, widthMm: 6, carat: 1.25 },
  { id: "8.5x6.5", lengthMm: 8.5, widthMm: 6.5, carat: 1.5 },
  { id: "9x7", lengthMm: 9, widthMm: 7, carat: 2 },
  { id: "10x6", lengthMm: 10, widthMm: 6, carat: 1.75 },
  { id: "10x8", lengthMm: 10, widthMm: 8, carat: 2.5 },
  { id: "11x7.5", lengthMm: 11, widthMm: 7.5, carat: 2.61 },
  { id: "11x8", lengthMm: 11, widthMm: 8, carat: 2.7 },
  { id: "12x8", lengthMm: 12, widthMm: 8, carat: 3 },
  { id: "12x9", lengthMm: 12, widthMm: 9, carat: 3.5 },
  { id: "13x8", lengthMm: 13, widthMm: 8, carat: 3.4 },
  { id: "13x9", lengthMm: 13, widthMm: 9, carat: 4.11 },
  { id: "14x8", lengthMm: 14, widthMm: 8, carat: 4 },
  { id: "14x9", lengthMm: 14, widthMm: 9, carat: 4.25 },
  { id: "14.5x9", lengthMm: 14.5, widthMm: 9, carat: 4.5 },
  { id: "15x9", lengthMm: 15, widthMm: 9, carat: 5 },
  { id: "15x10", lengthMm: 15, widthMm: 10, carat: 5.75 },
];

export const DEFAULT_PEAR_SKU = PEAR_CATALOG[0];

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function pearSkuId(lengthMm: number, widthMm: number): string {
  const l = Number.isInteger(round1(lengthMm)) ? String(Math.round(lengthMm)) : round1(lengthMm).toFixed(1);
  const w = Number.isInteger(round1(widthMm)) ? String(Math.round(widthMm)) : round1(widthMm).toFixed(1);
  return `${l}x${w}`;
}

export function pearSkuById(id: string | undefined | null): PearSku {
  return PEAR_CATALOG.find((sku) => sku.id === id) ?? DEFAULT_PEAR_SKU;
}

export function resolvePearSku(lengthMm: number, widthMm?: number): PearSku {
  const length = round1(lengthMm);
  const width = widthMm && widthMm > 0 ? round1(widthMm) : null;
  if (width != null) {
    const exact = PEAR_CATALOG.find((sku) => sku.lengthMm === length && sku.widthMm === width);
    if (exact) return exact;
  }
  const sameLength = PEAR_CATALOG.filter((sku) => sku.lengthMm === length);
  if (sameLength.length === 1) return sameLength[0];
  if (sameLength.length > 1 && width == null) return sameLength[0];

  let best = DEFAULT_PEAR_SKU;
  let bestScore = Number.POSITIVE_INFINITY;
  for (const sku of PEAR_CATALOG) {
    const score =
      Math.abs(sku.lengthMm - length) * 2 +
      (width != null ? Math.abs(sku.widthMm - width) : 0);
    if (score < bestScore) {
      best = sku;
      bestScore = score;
    }
  }
  return best;
}

export function pearSkuKey(sku: PearSku): number {
  return sku.lengthMm * 100 + sku.widthMm;
}

export function catalogBetween(minSku: PearSku, maxSku: PearSku): PearSku[] {
  const lo = Math.min(pearSkuKey(minSku), pearSkuKey(maxSku));
  const hi = Math.max(pearSkuKey(minSku), pearSkuKey(maxSku));
  return PEAR_CATALOG.filter((sku) => {
    const key = pearSkuKey(sku);
    return key >= lo && key <= hi;
  });
}

export function formatPearSku(sku: PearSku): string {
  const l = Number.isInteger(sku.lengthMm) ? String(sku.lengthMm) : sku.lengthMm.toFixed(1);
  const w = Number.isInteger(sku.widthMm) ? String(sku.widthMm) : sku.widthMm.toFixed(1);
  return `${l} × ${w}`;
}

export function pearSkuOptionLabel(sku: PearSku): string {
  return `${formatPearSku(sku)} mm · ${sku.carat} ct`;
}

export function pearRatioOf(sku: PearSku): number {
  return Math.round((sku.lengthMm / sku.widthMm) * 100) / 100;
}
