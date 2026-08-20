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
    minSize: 3.5,
    maxSize: 6,
    gapMm: 0.35,
    ratio: 1.5,
    autoGapFromList: true,
    projectName: "RN-Example",
    notes: "Shop example. Silver 15″ graduated rivière. Front list only — bracelet auto-fills in 3.5 mm.",
    list: [
      { sizeMm: 3.5, pcs: 10 },
      { sizeMm: 4, pcs: 22 },
      { sizeMm: 4.5, pcs: 4 },
      { sizeMm: 5, pcs: 2 },
      { sizeMm: 5.5, pcs: 2 },
      { sizeMm: 6, pcs: 1 },
    ],
  },
  {
    id: "rr",
    name: "Example RR · gold 16″ 2.5 × 1.7",
    metal: "gold",
    lengthIn: 16,
    braceletIn: 7,
    mode: "list",
    minSize: 2.5,
    maxSize: 2.5,
    gapMm: 0.3,
    ratio: 1.5,
    autoGapFromList: true,
    projectName: "RR-Example",
    notes: "Shop example. Gold 16″ single-size pear line. Front list only — 7″ bracelet auto-fills in 2.5 × 1.7 mm pears.",
    list: [{ sizeMm: 2.5, pcs: 84 }],
  },
  {
    id: "n1",
    name: "Necklace 1 · 15″ graduated",
    metal: "gold",
    lengthIn: 15,
    braceletIn: 7,
    mode: "range",
    minSize: 1.8,
    maxSize: 2.3,
    gapMm: 0.28,
    ratio: 1.5,
    autoGapFromList: false,
    list: [],
  },
  {
    id: "n2",
    name: "Necklace 2 · 15″ 2.5 mm line",
    metal: "gold",
    lengthIn: 15,
    braceletIn: 7,
    mode: "range",
    minSize: 2.5,
    maxSize: 2.5,
    gapMm: 0.28,
    ratio: 1.5,
    autoGapFromList: false,
    list: [],
  },
  {
    id: "n3",
    name: "Necklace 3 · 15″ 1.7 mm line",
    metal: "gold",
    lengthIn: 15,
    braceletIn: 7,
    mode: "range",
    minSize: 1.7,
    maxSize: 1.7,
    gapMm: 0.5,
    ratio: 1.5,
    autoGapFromList: false,
    list: [],
  },
  {
    id: "n4",
    name: "Necklace 4 · 15″ 3 mm line",
    metal: "gold",
    lengthIn: 15,
    braceletIn: 7,
    mode: "range",
    minSize: 3,
    maxSize: 3,
    gapMm: 0.25,
    ratio: 1.5,
    autoGapFromList: false,
    list: [],
  },
  {
    id: "ag-line",
    name: "Silver 16″ 5 mm line",
    metal: "silver",
    lengthIn: 16,
    braceletIn: 7,
    mode: "range",
    minSize: 5,
    maxSize: 5,
    gapMm: 0.3,
    ratio: 1.5,
    autoGapFromList: false,
    list: [],
  },
  {
    id: "ag-riv",
    name: "Silver 16″ 4 → 8 mm rivière",
    metal: "silver",
    lengthIn: 16,
    braceletIn: 7,
    mode: "range",
    minSize: 4,
    maxSize: 8,
    gapMm: 0.3,
    ratio: 1.5,
    autoGapFromList: false,
    list: [],
  },
];
