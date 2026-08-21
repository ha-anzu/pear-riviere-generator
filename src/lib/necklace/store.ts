import { create } from "zustand";
import {
  type BraceletIn,
  type LengthIn,
  type ListLine,
  type Metal,
  type MetalColor,
  type PatternMode,
  type PatternResult,
  type PriceBracket,
  type SavedConfig,
  type Variant,
  DEFAULT_PEAR_RATIO,
  DEFAULT_PEAR_SKU,
  buildPattern,
  defaultMetalColor,
  defaultPrices,
  pearRatioOf,
  resolvePearSku,
  searchByTarget,
  styleVariants,
} from "./engine";
import { newProjectId } from "./history";
import { PRESETS, type Preset } from "./presets";
import {
  gemColorAt,
  normalizeGemColors,
  type ColorScope,
  type GemColorKey,
} from "./gem-colors";

export type AtelierState = {
  metal: Metal;
  metalColor: MetalColor;
  lengthIn: LengthIn;
  braceletIn: BraceletIn;
  gapMm: number;
  ratio: number;
  mode: PatternMode;
  minSize: number;
  maxSize: number;
  minWidth: number;
  maxWidth: number;
  list: ListLine[];
  prices: PriceBracket[];
  pricesDirty: boolean;
  autoGapFromList: boolean;
  targetCt: string;
  budget: string;
  selectedIndex: number | null;
  gemColors: GemColorKey[];
  colorScope: ColorScope;
  projectId: string;
  projectName: string;
  notes: string;
  result: PatternResult;
  variants: Variant[];
  matches: Variant[];

  setMetal: (metal: Metal) => void;
  setMetalColor: (metalColor: MetalColor) => void;
  setLength: (lengthIn: LengthIn) => void;
  setBracelet: (braceletIn: BraceletIn) => void;
  setGap: (gapMm: number) => void;
  setRatio: (ratio: number) => void;
  setMode: (mode: PatternMode) => void;
  setMin: (minSize: number, minWidth?: number) => void;
  setMax: (maxSize: number, maxWidth?: number) => void;
  setSingle: (size: number, width?: number) => void;
  setList: (list: ListLine[]) => void;
  addListRow: () => void;
  removeListRow: (index: number) => void;
  updateListRow: (index: number, patch: Partial<ListLine>) => void;
  setAutoGap: (v: boolean) => void;
  setPrice: (index: number, perCt: number) => void;
  setTargetCt: (v: string) => void;
  setBudget: (v: string) => void;
  setSelected: (index: number | null) => void;
  setColorScope: (scope: ColorScope) => void;
  paintGem: (color: GemColorKey) => void;
  setProjectId: (v: string) => void;
  setProjectName: (v: string) => void;
  setNotes: (v: string) => void;
  newProject: () => void;
  applyPreset: (preset: Preset) => void;
  applyVariant: (v: Variant) => void;
  loadConfig: (cfg: SavedConfig) => void;
  toConfig: () => SavedConfig;
  findMatches: () => void;
};

function compute(
  s: Pick<
    AtelierState,
    | "metal"
    | "lengthIn"
    | "braceletIn"
    | "gapMm"
    | "ratio"
    | "mode"
    | "minSize"
    | "maxSize"
    | "minWidth"
    | "maxWidth"
    | "list"
    | "prices"
    | "autoGapFromList"
  >,
): Pick<AtelierState, "result" | "variants"> {
  const input = {
    metal: s.metal,
    lengthIn: s.lengthIn,
    braceletIn: s.braceletIn,
    gapMm: s.gapMm,
    ratio: s.ratio,
    mode: s.mode,
    minSize: s.minSize,
    maxSize: s.maxSize,
    minWidth: s.minWidth,
    maxWidth: s.maxWidth,
    list: s.list,
    prices: s.prices,
    autoGapFromList: s.autoGapFromList,
  };
  return {
    result: buildPattern(input),
    variants: styleVariants(
      s.metal,
      s.lengthIn,
      s.gapMm,
      s.prices,
      s.braceletIn,
      s.ratio,
    ),
  };
}

const initialMetal: Metal = "gold";
const seed = {
  metal: initialMetal,
  metalColor: defaultMetalColor(initialMetal),
  lengthIn: 16 as LengthIn,
  braceletIn: 7 as BraceletIn,
  gapMm: 0.28,
  ratio: pearRatioOf(DEFAULT_PEAR_SKU),
  mode: "range" as PatternMode,
  minSize: 5,
  maxSize: 5,
  minWidth: 3,
  maxWidth: 3,
  list: [{ sizeMm: 5, widthMm: 3, pcs: 38 }] as ListLine[],
  prices: defaultPrices(initialMetal),
  autoGapFromList: true,
  projectId: "PR-DRAFT",
  projectName: "",
  notes: "",
};

const computed = compute(seed);

export const useAtelier = create<AtelierState>((set, get) => ({
  ...seed,
  pricesDirty: false,
  targetCt: "",
  budget: "",
  selectedIndex: null,
  gemColors: [],
  colorScope: "pair",
  result: computed.result,
  variants: computed.variants,
  matches: [],

  setMetal: (metal) =>
    set((s) => {
      const prices = s.pricesDirty ? s.prices : defaultPrices(metal);
      const metalColor =
        s.metalColor === "yellow" && metal === "silver"
          ? "white"
          : s.metalColor === "white" && metal === "gold" && s.metal === "silver"
            ? "yellow"
            : s.metalColor;
      const next = {
        ...s,
        metal,
        metalColor,
        prices,
        matches: [],
      };
      return { ...next, ...compute(next) };
    }),

  setMetalColor: (metalColor) => set({ metalColor }),

  setLength: (lengthIn) =>
    set((s) => {
      const next = { ...s, lengthIn, matches: [] };
      return { ...next, ...compute(next) };
    }),

  setBracelet: (braceletIn) =>
    set((s) => {
      const next = { ...s, braceletIn, matches: [] };
      return { ...next, ...compute(next) };
    }),

  setGap: (gapMm) =>
    set((s) => {
      const next = { ...s, gapMm, matches: [] };
      return { ...next, ...compute(next) };
    }),

  setRatio: (ratio) =>
    set((s) => {
      const next = { ...s, ratio, matches: [] };
      return { ...next, ...compute(next) };
    }),

  setMode: (mode) =>
    set((s) => {
      const next = { ...s, mode, selectedIndex: null };
      return { ...next, ...compute(next) };
    }),

  setMin: (minSize, minWidth) =>
    set((s) => {
      const sku = resolvePearSku(minSize, minWidth ?? s.minWidth);
      const maxSku = resolvePearSku(Math.max(s.maxSize, sku.lengthMm), s.maxWidth);
      const next = {
        ...s,
        minSize: sku.lengthMm,
        minWidth: sku.widthMm,
        maxSize: maxSku.lengthMm,
        maxWidth: maxSku.widthMm,
        ratio: pearRatioOf(sku),
      };
      return { ...next, ...compute(next) };
    }),

  setMax: (maxSize, maxWidth) =>
    set((s) => {
      const sku = resolvePearSku(maxSize, maxWidth ?? s.maxWidth);
      const minSku = resolvePearSku(Math.min(s.minSize, sku.lengthMm), s.minWidth);
      const next = {
        ...s,
        maxSize: sku.lengthMm,
        maxWidth: sku.widthMm,
        minSize: minSku.lengthMm,
        minWidth: minSku.widthMm,
        ratio: pearRatioOf(minSku),
      };
      return { ...next, ...compute(next) };
    }),

  setSingle: (size, width) =>
    set((s) => {
      const sku = resolvePearSku(size, width ?? s.minWidth);
      const next = {
        ...s,
        minSize: sku.lengthMm,
        maxSize: sku.lengthMm,
        minWidth: sku.widthMm,
        maxWidth: sku.widthMm,
        ratio: pearRatioOf(sku),
      };
      return { ...next, ...compute(next) };
    }),

  setList: (list) =>
    set((s) => {
      const next = { ...s, list };
      return { ...next, ...compute(next) };
    }),

  addListRow: () =>
    set((s) => {
      const sku = resolvePearSku(s.maxSize, s.maxWidth);
      const list = [...s.list, { sizeMm: sku.lengthMm, widthMm: sku.widthMm, pcs: 10 }];
      const next = { ...s, list };
      return { ...next, ...compute(next) };
    }),

  removeListRow: (index) =>
    set((s) => {
      const list = s.list.filter((_, i) => i !== index);
      const next = { ...s, list };
      return { ...next, ...compute(next) };
    }),

  updateListRow: (index, patch) =>
    set((s) => {
      const list = s.list.map((row, i) =>
        i === index ? { ...row, ...patch } : row,
      );
      const next = { ...s, list };
      return { ...next, ...compute(next) };
    }),

  setAutoGap: (autoGapFromList) =>
    set((s) => {
      const next = { ...s, autoGapFromList };
      return { ...next, ...compute(next) };
    }),

  setPrice: (index, perCt) =>
    set((s) => {
      const prices = s.prices.map((b, i) =>
        i === index ? { ...b, perCt } : b,
      );
      const next = { ...s, prices, pricesDirty: true };
      return { ...next, ...compute(next) };
    }),

  setTargetCt: (targetCt) => set({ targetCt }),
  setBudget: (budget) => set({ budget }),
  setSelected: (selectedIndex) => set({ selectedIndex }),
  setColorScope: (colorScope) => set({ colorScope }),
  paintGem: (color) =>
    set((s) => {
      if (s.selectedIndex == null) return s;
      const total = s.result.totalPcs;
      const selected = s.selectedIndex;
      const mirror = total - 1 - selected;
      const gemColors = Array.from({ length: total }, (_, index) =>
        gemColorAt(s.gemColors, index),
      );
      if (s.colorScope === "all") gemColors.fill(color);
      else {
        gemColors[selected] = color;
        if (s.colorScope === "pair") gemColors[mirror] = color;
      }
      return { gemColors };
    }),
  setProjectId: (projectId) => set({ projectId }),
  setProjectName: (projectName) => set({ projectName }),
  setNotes: (notes) => set({ notes }),

  newProject: () =>
    set({
      projectId: newProjectId(),
      projectName: "",
      notes: "",
    }),

  applyPreset: (preset) =>
    set((s) => {
      const prices = s.pricesDirty ? s.prices : defaultPrices(preset.metal);
      const next = {
        ...s,
        metal: preset.metal,
        metalColor: defaultMetalColor(preset.metal),
        lengthIn: preset.lengthIn,
        braceletIn: preset.braceletIn ?? 7,
        gapMm: preset.gapMm,
        ratio: preset.ratio,
        mode: preset.mode,
        minSize: preset.minSize,
        maxSize: preset.maxSize,
        minWidth: preset.minWidth ?? resolvePearSku(preset.minSize).widthMm,
        maxWidth: preset.maxWidth ?? resolvePearSku(preset.maxSize).widthMm,
        list: preset.list.map((l) => ({ ...l })),
        autoGapFromList: preset.autoGapFromList,
        prices,
        selectedIndex: null,
        gemColors: [],
        matches: [],
        projectId: newProjectId(),
        projectName: preset.projectName ?? preset.name,
        notes: preset.notes ?? "",
      };
      return { ...next, ...compute(next) };
    }),

  applyVariant: (v) =>
    set((s) => {
      const next = {
        ...s,
        mode: v.mode,
        minSize: v.minSize,
        maxSize: v.maxSize,
        list: v.list.map((l) => ({ ...l })),
        selectedIndex: null,
      };
      return { ...next, ...compute(next) };
    }),

  loadConfig: (cfg) =>
    set((s) => {
      const next = {
        ...s,
        metal: cfg.metal,
        metalColor: cfg.metalColor ?? defaultMetalColor(cfg.metal),
        lengthIn: cfg.lengthIn,
        braceletIn: cfg.braceletIn ?? 7,
        gapMm: cfg.gapMm,
        ratio: cfg.ratio ?? DEFAULT_PEAR_RATIO,
        mode: cfg.mode,
        minSize: cfg.minSize,
        maxSize: cfg.maxSize,
        minWidth: cfg.minWidth ?? resolvePearSku(cfg.minSize).widthMm,
        maxWidth: cfg.maxWidth ?? resolvePearSku(cfg.maxSize).widthMm,
        list: cfg.list.map((l) => ({ ...l })),
        prices: cfg.prices,
        pricesDirty: true,
        autoGapFromList: cfg.autoGapFromList,
        targetCt: cfg.targetCt != null ? String(cfg.targetCt) : "",
        budget: cfg.budget != null ? String(cfg.budget) : "",
        selectedIndex: null,
        gemColors: normalizeGemColors(cfg.gemColors),
        colorScope: cfg.colorScope ?? "pair",
        matches: [],
        projectId: cfg.projectId || newProjectId(),
        projectName: cfg.projectName ?? "",
        notes: cfg.notes ?? "",
      };
      return { ...next, ...compute(next) };
    }),

  toConfig: () => {
    const s = get();
    return {
      metal: s.metal,
      lengthIn: s.lengthIn,
      braceletIn: s.braceletIn,
      gapMm: s.gapMm,
      ratio: s.ratio,
      mode: s.mode,
      minSize: s.minSize,
      maxSize: s.maxSize,
      minWidth: s.minWidth,
      maxWidth: s.maxWidth,
      list: s.list,
      prices: s.prices,
      autoGapFromList: s.autoGapFromList,
      targetCt: s.targetCt ? Number(s.targetCt) : null,
      budget: s.budget ? Number(s.budget) : null,
      metalColor: s.metalColor,
      projectId: s.projectId,
      projectName: s.projectName,
      notes: s.notes,
      gemColors: s.gemColors,
      colorScope: s.colorScope,
    };
  },

  findMatches: () =>
    set((s) => {
      const ct = Number(s.targetCt);
      const budget = Number(s.budget);
      let matches: Variant[] = [];
      if (Number.isFinite(ct) && ct > 0) {
        matches = searchByTarget(
          s.metal,
          s.lengthIn,
          s.gapMm,
          s.prices,
          "carat",
          ct,
          s.braceletIn,
          s.ratio,
        );
      } else if (Number.isFinite(budget) && budget > 0) {
        matches = searchByTarget(
          s.metal,
          s.lengthIn,
          s.gapMm,
          s.prices,
          "budget",
          budget,
          s.braceletIn,
          s.ratio,
        );
      }
      return { matches };
    }),
}));

export { PRESETS };
