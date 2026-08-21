import { create } from "zustand";

export type Lang = "en" | "th";

const KEY = "riviere-lang";

const EN = {
  suite: "Rivière",
  pearTool: "Pear rivière",
  roundTool: "Round necklace",
  braceletTool: "Round bracelet",
  suiteHome: "All styles",
  english: "EN",
  thai: "ไทย",
  black: "Black",
  white: "White",
  signIn: "Sign in",
  save: "Save",
  newId: "New",
  hdJpg: "JPG",
  json: "JSON",
  copy: "Copy",
  print: "Print",
  history: "History",
  metal: "Metal",
  gold: "Gold",
  silver: "Silver",
  metalColor: "Setting color",
  yellow: "Yellow",
  whiteMetal: "White",
  rose: "Rose",
  length: "Necklace length",
  backBracelet: "Bracelet length",
  pattern: "Pattern",
  range: "Min / max",
  list: "Stone list",
  singleSize: "One size",
  smallest: "Smallest (bracelet / lock)",
  largest: "Largest (front)",
  pearSize: "Pear size",
  sizePcs: "Size · pcs",
  addSize: "Add",
  gap: "Gap",
  color: "Color",
  tapStone: "Tap a stone",
  stone: "This stone",
  pair: "Pair",
  all: "All",
  sizeList: "Size list",
  shopSheet: "Shop sheet",
  finishedLength: "Finished length",
  braceletBack: "Bracelet · back",
  necklaceFront: "Necklace · front",
  inclLock1: "includes lock 1",
  inclLock2: "includes lock 2 + converters",
  chain: "Chain order",
  findings: "Findings",
  item: "Item",
  size: "Size",
  pcs: "Pcs",
  stonesOnTop: "Stones on top",
  assembly: "Assembly 1–9",
  necklaceMode: "Wear as necklace",
  braceletMode: "Wear as bracelet",
  necklaceModeBody:
    "Close both locks at the shoulders. Left: male 2 → female 1. Right: male 1 → female 2. Open either side.",
  braceletModeBody:
    "Disconnect both converters. Close lock 1 on itself. Front strand stays on the converters.",
  lock: "Lock",
  converter: "Converter",
  f1: "F1 box",
  m1: "M1 tongue",
  f2: "F2 box",
  m2: "M2 tongue",
  convL: "Conv L",
  convR: "Conv R",
  bracelet: "Bracelet",
  front: "Front",
  back: "BACK",
  frontMark: "FRONT",
  left: "L",
  right: "R",
  ct: "ct",
  leftover: "leftover",
  fitOk: "OK",
  fitLong: "too long",
  fitShort: "too short",
  of: "of",
  total: "Total",
  empty: "Empty",
  braceletBom: "Bracelet BOM",
  necklaceBom: "Necklace BOM",
  cost: "Cost",
  copied: "Copied",
  step1: "Lock 1 female · box",
  step1d: "Set 2 stones on the box. Bracelet joint.",
  step2: "Bracelet run",
  step2d: "All smallest size. Includes lock 1.",
  step3: "Lock 1 male · tongue",
  step3d: "Set 1 stone on the tongue. Closes into lock 1 female.",
  step4: "Lock 2 female · box",
  step4d: "Same lock SKU. Right shoulder when worn as necklace.",
  step5: "Left converter",
  step5d: "1 stone. Necklace hinge + bracelet hinge.",
  step6: "Necklace run",
  step6d: "Largest at the front. Includes lock 2 and both converters.",
  step7: "Right converter",
  step7d: "Same as left, mirrored.",
  step8: "Lock 2 male · tongue",
  step8d: "Set 1 stone. Same SKU as lock 1 male.",
  step9: "Close the loop",
  step9d: "Necklace: M2→F1 left, M1→F2 right. Bracelet: close lock 1 on itself.",
  project: "Project",
  name: "Name",
  notes: "Notes",
  backSolveGap: "Fit gap from this count",
  metalWeight: "Metal weight",
  metalPrice: "Metal $/g",
  grams: "g",
  perGram: "$/g",
  metalCost: "Metal",
  stoneCost: "Stones",
  grandTotal: "Total",
  bezelNote:
    "Bezel: 4.5 mm Ag925 = 0.4 g. Scales with size³. Pear uses √(L×W). Alloy by density.",
  lockCallout: "LOCK",
  converterCallout: "CONVERTER",
} as const;

const TH: Record<keyof typeof EN, string> = {
  suite: "Rivière",
  pearTool: "สร้อยเพชรหยดน้ำ",
  roundTool: "สร้อยเทนนิสกลม",
  braceletTool: "สร้อยข้อมือกลม",
  suiteHome: "เลือกทรง",
  english: "EN",
  thai: "ไทย",
  black: "ดำ",
  white: "ขาว",
  signIn: "เข้าสู่ระบบ",
  save: "บันทึก",
  newId: "ใหม่",
  hdJpg: "JPG",
  json: "JSON",
  copy: "คัดลอก",
  print: "พิมพ์",
  history: "ประวัติ",
  metal: "โลหะ",
  gold: "ทอง",
  silver: "เงิน",
  metalColor: "สีเรือน",
  yellow: "เหลือง",
  whiteMetal: "ขาว",
  rose: "ชมพู",
  length: "ความยาวสร้อยคอ",
  backBracelet: "ความยาวสร้อยข้อมือ",
  pattern: "ลาย",
  range: "เล็ก / ใหญ่",
  list: "รายการไซส์",
  singleSize: "ไซส์เดียว",
  smallest: "เล็กสุด (ข้อมือ / ล็อค)",
  largest: "ใหญ่สุด (ด้านหน้า)",
  pearSize: "ไซส์เพียร์",
  sizePcs: "ไซส์ · เม็ด",
  addSize: "เพิ่ม",
  gap: "ช่องไฟ",
  color: "สีพลอย",
  tapStone: "แตะเม็ดบนวง",
  stone: "เม็ดนี้",
  pair: "คู่",
  all: "ทั้งเส้น",
  sizeList: "รายการไซส์",
  shopSheet: "ใบสั่งผลิต",
  finishedLength: "ความยาวสำเร็จ",
  braceletBack: "สร้อยข้อมือ · หลัง",
  necklaceFront: "สร้อยคอ · หน้า",
  inclLock1: "รวมล็อค 1",
  inclLock2: "รวมล็อค 2 และคอนเวอร์เตอร์",
  chain: "ลำดับสาย",
  findings: "อะไหล่",
  item: "รายการ",
  size: "ไซส์",
  pcs: "เม็ด",
  stonesOnTop: "เพชรบนอะไหล่",
  assembly: "ขั้นตอนประกอบ 1–9",
  necklaceMode: "ใส่เป็นสร้อยคอ",
  braceletMode: "ใส่เป็นสร้อยข้อมือ",
  necklaceModeBody:
    "ล็อคสองข้างที่บ่า ซ้าย: ตัวผู้ 2 → ตัวเมีย 1 ขวา: ตัวผู้ 1 → ตัวเมีย 2 เปิดได้ทั้งสองข้าง",
  braceletModeBody:
    "ถอดคอนเวอร์เตอร์ทั้งสอง ปิดล็อค 1 เข้าด้วยกัน สายด้านหน้าค้างที่คอนเวอร์เตอร์",
  lock: "ล็อค",
  converter: "คอนเวอร์เตอร์",
  f1: "F1 กล่อง",
  m1: "M1 ลิ้น",
  f2: "F2 กล่อง",
  m2: "M2 ลิ้น",
  convL: "แปลง ซ้าย",
  convR: "แปลง ขวา",
  bracelet: "ข้อมือ",
  front: "ด้านหน้า",
  back: "หลัง",
  frontMark: "หน้า",
  left: "ซ้าย",
  right: "ขวา",
  ct: "กะรัต",
  leftover: "เหลือ",
  fitOk: "พอดี",
  fitLong: "ยาวเกิน",
  fitShort: "สั้น",
  of: "จาก",
  total: "รวม",
  empty: "ว่าง",
  braceletBom: "BOM ข้อมือ",
  necklaceBom: "BOM สร้อย",
  cost: "ราคา",
  copied: "คัดลอกแล้ว",
  step1: "ล็อค 1 ตัวเมีย · กล่อง",
  step1d: "ฝัง 2 เม็ดบนกล่อง ข้อต่อสายข้อมือ",
  step2: "สายข้อมือ",
  step2d: "ไซส์เล็กสุดทั้งหมด รวมล็อค 1",
  step3: "ล็อค 1 ตัวผู้ · ลิ้น",
  step3d: "ฝัง 1 เม็ดบนลิ้น เสียบเข้ากล่องล็อค 1",
  step4: "ล็อค 2 ตัวเมีย · กล่อง",
  step4d: "ล็อค SKU เดียวกัน บ่าขวาเมื่อใส่เป็นสร้อยคอ",
  step5: "คอนเวอร์เตอร์ซ้าย",
  step5d: "1 เม็ด บานพับสร้อย + บานพับข้อมือ",
  step6: "สายสร้อยด้านหน้า",
  step6d: "เม็ดใหญ่สุดอยู่หน้า รวมล็อค 2 และคอนเวอร์เตอร์",
  step7: "คอนเวอร์เตอร์ขวา",
  step7d: "เหมือนซ้าย กลับด้าน",
  step8: "ล็อค 2 ตัวผู้ · ลิ้น",
  step8d: "ฝัง 1 เม็ด SKU เดียวกับล็อค 1 ตัวผู้",
  step9: "ปิดวง",
  step9d: "สร้อยคอ: M2→F1 ซ้าย, M1→F2 ขวา ข้อมือ: ปิดล็อค 1 เข้าด้วยกัน",
  project: "งาน",
  name: "ชื่อ",
  notes: "หมายเหตุ",
  backSolveGap: "คำนวณช่องไฟจากจำนวนเม็ด",
  metalWeight: "น้ำหนักโลหะ",
  metalPrice: "โลหะ $/กรัม",
  grams: "กรัม",
  perGram: "$/กรัม",
  metalCost: "โลหะ",
  stoneCost: "พลอย",
  grandTotal: "รวม",
  bezelNote:
    "บีดเซล: 4.5 มม. เงิน 925 = 0.4 กรัม คูณตามขนาด³ เพียร์ใช้ √(ยาว×กว้าง)",
  lockCallout: "ล็อค",
  converterCallout: "คอนเวอร์เตอร์",
};

export type Msg = keyof typeof EN;

export function readLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    return window.localStorage.getItem(KEY) === "th" ? "th" : "en";
  } catch {
    return "en";
  }
}

export function applyLang(lang: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
  try {
    window.localStorage.setItem(KEY, lang);
  } catch {
    /* private mode */
  }
}

type LocaleState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export const useLocale = create<LocaleState>((set) => ({
  lang: "en",
  setLang: (lang) => {
    applyLang(lang);
    set({ lang });
  },
}));

export function translate(lang: Lang, key: Msg): string {
  return lang === "th" ? TH[key] : EN[key];
}

export function useT() {
  const lang = useLocale((s) => s.lang);
  return (key: Msg) => translate(lang, key);
}
