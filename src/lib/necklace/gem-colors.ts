export const GEM_COLORS = {
  colorless: { label: "White diamond", fill: "#eefcff", light: "#ffffff", edge: "#8abfd0" },
  black: { label: "Black diamond", fill: "#141820", light: "#697386", edge: "#05070a" },
  green: { label: "Emerald", fill: "#20a66a", light: "#8bf5bf", edge: "#075432" },
  red: { label: "Ruby", fill: "#d62f4b", light: "#ff90a2", edge: "#741426" },
  blue: { label: "Blue sapphire", fill: "#2c74da", light: "#8fc8ff", edge: "#153b82" },
  purple: { label: "Amethyst", fill: "#8350c7", light: "#d8b4ff", edge: "#402265" },
  orange: { label: "Orange sapphire", fill: "#e97224", light: "#ffc08e", edge: "#8e3510" },
  champagne: { label: "Champagne diamond", fill: "#c9a66b", light: "#f6dfb2", edge: "#715834" },
  brown: { label: "Cognac diamond", fill: "#754b35", light: "#cda083", edge: "#382016" },
  light_canary: { label: "Canary diamond", fill: "#f1df6c", light: "#fff6aa", edge: "#9b8421" },
  yellow: { label: "Yellow sapphire", fill: "#e8bd20", light: "#fff277", edge: "#8a6a06" },
  turquoise: { label: "Turquoise", fill: "#24bfc1", light: "#8ffff4", edge: "#0a686b" },
  malachite: { label: "Malachite", fill: "#087f5b", light: "#52e0a8", edge: "#034331" },
  pink: { label: "Pink sapphire", fill: "#e873a7", light: "#ffd0e4", edge: "#89375d" },
  teal: { label: "Paraiba", fill: "#168d91", light: "#72e3df", edge: "#075054" },
} as const;

export type GemColorKey = keyof typeof GEM_COLORS;
export type ColorScope = "stone" | "pair" | "all";

export const DEFAULT_GEM_COLOR: GemColorKey = "colorless";

export function isGemColor(value: unknown): value is GemColorKey {
  return typeof value === "string" && value in GEM_COLORS;
}

export function gemColorAt(colors: readonly string[], index: number): GemColorKey {
  const value = colors[index];
  return isGemColor(value) ? value : DEFAULT_GEM_COLOR;
}

export function normalizeGemColors(colors: readonly string[] | undefined): GemColorKey[] {
  return (colors ?? []).map((color) => (isGemColor(color) ? color : DEFAULT_GEM_COLOR));
}

export function gemColorCounts(colors: readonly string[], total: number) {
  const counts = new Map<GemColorKey, number>();
  for (let index = 0; index < total; index += 1) {
    const color = gemColorAt(colors, index);
    counts.set(color, (counts.get(color) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count, ...GEM_COLORS[key] }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function formatColorPlan(colors: readonly string[], total: number): string {
  return gemColorCounts(colors, total)
    .map((item) => `${item.label} = ${item.count} pcs`)
    .join("\n");
}
