import type { BraceletIn, LengthIn, ListLine, Metal, PatternMode } from "./engine";

export type Preset = {
  id: string;
  name: string;
  metal: Metal;
  lengthIn: LengthIn;
  braceletIn?: BraceletIn;
  mode: PatternMode;
  minSize: number;
  maxSize: number;
  minWidth?: number;
  maxWidth?: number;
  list: ListLine[];
  gapMm: number;
  ratio: number;
  autoGapFromList: boolean;
  projectName?: string;
  notes?: string;
};

export const PRESETS: Preset[] = [
  {
    id: "rn",
    name: "Example RN · silver 15″",
    metal: "silver",
    lengthIn: 15,
    braceletIn: 7,
    mode: "list",
    minSize: 5,
    maxSize: 7,
    minWidth: 3,
    maxWidth: 5,
    gapMm: 0.35,
    ratio: 1.67,
    autoGapFromList: true,
    projectName: "RN-Example",
    notes: "Shop example. Silver 15″ graduated pear rivière. Front list only — bracelet auto-fills in 5 × 3 mm.",
    list: [
      { sizeMm: 5, widthMm: 3, pcs: 10 },
      { sizeMm: 5, widthMm: 4, pcs: 8 },
      { sizeMm: 6, widthMm: 4, pcs: 6 },
      { sizeMm: 6.5, widthMm: 4.5, pcs: 4 },
      { sizeMm: 7, widthMm: 5, pcs: 1 },
    ],
  },
  {
    id: "rr",
    name: "Example RR · gold 16″ 5 × 3",
    metal: "gold",
    lengthIn: 16,
    braceletIn: 7,
    mode: "list",
    minSize: 5,
    maxSize: 5,
    minWidth: 3,
    maxWidth: 3,
    gapMm: 0.3,
    ratio: 1.67,
    autoGapFromList: true,
    projectName: "RR-Example",
    notes: "Shop example. Gold 16″ single-size pear line. Front list only — 7″ bracelet auto-fills in 5 × 3 mm pears.",
    list: [{ sizeMm: 5, widthMm: 3, pcs: 38 }],
  },
  {
    id: "n1",
    name: "Necklace 1 · 15″ 5×3 → 6×4",
    metal: "gold",
    lengthIn: 15,
    braceletIn: 7,
    mode: "range",
    minSize: 5,
    maxSize: 6,
    minWidth: 3,
    maxWidth: 4,
    gapMm: 0.2,
    ratio: 1.67,
    autoGapFromList: false,
    list: [],
  },
  {
    id: "n2",
    name: "Necklace 2 · 15″ 5 × 3 line",
    metal: "gold",
    lengthIn: 15,
    braceletIn: 7,
    mode: "range",
    minSize: 5,
    maxSize: 5,
    minWidth: 3,
    maxWidth: 3,
    gapMm: 0.2,
    ratio: 1.67,
    autoGapFromList: false,
    list: [],
  },
  {
    id: "n3",
    name: "Necklace 3 · 15″ 5 × 4 line",
    metal: "gold",
    lengthIn: 15,
    braceletIn: 7,
    mode: "range",
    minSize: 5,
    maxSize: 5,
    minWidth: 4,
    maxWidth: 4,
    gapMm: 0.3,
    ratio: 1.25,
    autoGapFromList: false,
    list: [],
  },
  {
    id: "n4",
    name: "Necklace 4 · 15″ 6 × 4 line",
    metal: "gold",
    lengthIn: 15,
    braceletIn: 7,
    mode: "range",
    minSize: 6,
    maxSize: 6,
    minWidth: 4,
    maxWidth: 4,
    gapMm: 0.25,
    ratio: 1.5,
    autoGapFromList: false,
    list: [],
  },
  {
    id: "ag-line",
    name: "Silver 16″ 5 × 3 line",
    metal: "silver",
    lengthIn: 16,
    braceletIn: 7,
    mode: "range",
    minSize: 5,
    maxSize: 5,
    minWidth: 3,
    maxWidth: 3,
    gapMm: 0.3,
    ratio: 1.67,
    autoGapFromList: false,
    list: [],
  },
  {
    id: "ag-riv",
    name: "Silver 16″ 5×3 → 8×6 rivière",
    metal: "silver",
    lengthIn: 16,
    braceletIn: 7,
    mode: "range",
    minSize: 5,
    maxSize: 8,
    minWidth: 3,
    maxWidth: 6,
    gapMm: 0.3,
    ratio: 1.67,
    autoGapFromList: false,
    list: [],
  },
];
