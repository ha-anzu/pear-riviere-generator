import assert from "node:assert/strict";
import test from "node:test";
import {
  BRACELET_IN,
  DEFAULT_PEAR_RATIO,
  GAP_MAX,
  GAP_MIN,
  INCHES,
  METAL,
  PEAR_DEPTH_FACTOR,
  PEAR_ORIENTATION,
  buildPattern,
  caratOf,
  defaultPrices,
  formatBomText,
  layoutFromList,
  lengthMm,
  pearDimensions,
  sizeGrid,
  spanOf,
  type BraceletIn,
  type LengthIn,
  type Metal,
  type PatternInput,
} from "./engine.ts";

function input(overrides: Partial<PatternInput> = {}): PatternInput {
  const metal = overrides.metal ?? "gold";
  return {
    metal,
    lengthIn: 16,
    braceletIn: 7,
    gapMm: 0.28,
    ratio: DEFAULT_PEAR_RATIO,
    mode: "range",
    minSize: metal === "gold" ? 2.5 : 4,
    maxSize: metal === "gold" ? 5 : 8,
    list: [],
    prices: defaultPrices(metal),
    autoGapFromList: false,
    ...overrides,
  };
}

test("gold and silver length grids are exact", () => {
  const gold = sizeGrid("gold");
  const silver = sizeGrid("silver");
  assert.equal(gold.length, 96);
  assert.deepEqual([gold[0], gold.at(-1)], [1.5, 11]);
  assert.ok(gold.every((v, i) => i === 0 || Math.abs(v - gold[i - 1] - 0.1) < 1e-9));
  assert.deepEqual(silver, [3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12]);
});

test("all supported necklace and bracelet lengths remain available", () => {
  assert.deepEqual(INCHES, [14, 15, 16, 17, 18]);
  assert.deepEqual(BRACELET_IN, [6, 6.5, 7]);
  for (const inches of INCHES) assert.equal(lengthMm(inches), Math.round(inches * 25.4 * 100) / 100);
});

test("pear dimensions and carat use length × width × 61% depth × 0.0060", () => {
  assert.deepEqual(pearDimensions(2.5, 1.5), {
    lengthMm: 2.5,
    widthMm: 1.67,
    depthMm: 1.02,
  });
  assert.equal(PEAR_DEPTH_FACTOR, 0.61);
  assert.equal(caratOf(2.5, 1.5), 0.0256);
  assert.equal(caratOf(6, 1.5), 0.3514);
});

test("automatic patterns preserve exact convertible station order", () => {
  const result = buildPattern(input());
  const groups = result.stations.reduce<string[]>((out, station) => {
    if (out.at(-1) !== station.kind) out.push(station.kind);
    return out;
  }, []);
  assert.deepEqual(groups, [
    "lock1-f",
    "bracelet",
    "lock1-m",
    "lock2-f",
    "conv-l",
    "necklace",
    "conv-r",
    "lock2-m",
  ]);
  assert.equal(result.stations.filter((s) => s.kind === "lock1-f").length, 2);
  assert.equal(result.stations.filter((s) => s.kind === "lock1-m").length, 1);
  assert.equal(result.stations.filter((s) => s.kind === "lock2-f").length, 2);
  assert.equal(result.stations.filter((s) => s.kind === "lock2-m").length, 1);
  assert.equal(result.stations.filter((s) => s.kind.startsWith("conv")).length, 2);
  assert.equal(result.assembly.length, 9);
});

test("bracelet and all hardware stay at the minimum while only the front graduates", () => {
  const result = buildPattern(input({ minSize: 2.2, maxSize: 6 }));
  const fixed = result.stations.filter((s) => s.kind !== "necklace");
  assert.ok(fixed.every((s) => s.lengthMm === 2.2));
  const front = result.stations.filter((s) => s.kind === "necklace");
  assert.equal(Math.max(...front.map((s) => s.lengthMm)), 6);
  assert.equal(front[Math.floor(front.length / 2)].lengthMm, 6);
  assert.deepEqual(front.map((s) => s.lengthMm), front.map((s) => s.lengthMm).reverse());
});

test("every station stores pear length, width, depth and orientation metadata", () => {
  const result = buildPattern(input({ ratio: 1.55 }));
  assert.equal(result.ratio, 1.55);
  assert.equal(result.orientation, PEAR_ORIENTATION);
  for (const station of result.stations) {
    assert.equal(station.lengthMm, station.sizeMm);
    assert.ok(station.widthMm > 0 && station.widthMm < station.lengthMm);
    assert.equal(station.depthMm, Math.round(station.widthMm * 0.61 * 100) / 100);
  }
});

test("all metal, length, bracelet, and gap combinations fit without overflow", () => {
  for (const metal of ["gold", "silver"] as Metal[]) {
    for (const lengthIn of INCHES) {
      for (const braceletIn of BRACELET_IN) {
        for (const gapMm of [GAP_MIN, GAP_MAX]) {
          const spec = METAL[metal];
          const result = buildPattern(input({
            metal,
            prices: defaultPrices(metal),
            lengthIn: lengthIn as LengthIn,
            braceletIn: braceletIn as BraceletIn,
            gapMm,
            minSize: spec.min,
            maxSize: Math.min(spec.max, spec.min + spec.step * 8),
          }));
          assert.ok(result.totalMm <= result.lengthMm + 0.01);
          assert.ok(result.bracelet.setMm <= result.bracelet.lengthMm + 0.01);
          assert.ok(result.necklace.setMm <= result.necklace.lengthMm + 0.01);
          assert.ok(result.necklace.leftoverMm < 2 * (result.minSize + gapMm) + 0.05);
        }
      }
    }
  }
});

test("single-size range remains single size", () => {
  const result = buildPattern(input({ minSize: 3.2, maxSize: 3.2 }));
  assert.deepEqual([...new Set(result.stones)], [3.2]);
});

test("manual front list keeps counts and BOM aggregates duplicate lengths", () => {
  const list = [
    { sizeMm: 2.5, pcs: 4 },
    { sizeMm: 3, pcs: 2 },
    { sizeMm: 2.5, pcs: 6 },
    { sizeMm: 5, pcs: 1 },
  ];
  const laid = layoutFromList(list);
  assert.equal(laid.length, 13);
  assert.equal(laid[Math.floor(laid.length / 2)], 5);
  const result = buildPattern(input({ mode: "list", list }));
  const front = result.stations.filter((s) => s.kind === "necklace");
  assert.equal(front.length, 13);
  const line = result.necklace.bom.find((b) => b.lengthMm === 2.5);
  // Necklace BOM includes the five minimum-size lock/converter cover pears.
  assert.equal(line?.pcs, 15);
});

test("list auto-gap is honored and explicitly flags shop-tolerance escape", () => {
  const result = buildPattern(input({
    mode: "list",
    autoGapFromList: true,
    list: [{ sizeMm: 2.5, pcs: 1 }],
  }));
  assert.equal(result.stations.filter((s) => s.kind === "necklace").length, 1);
  assert.equal(result.gapOutOfRange, result.gapMm < GAP_MIN || result.gapMm > GAP_MAX);
});

test("closed-loop span, BOM text, and JSON round-trip remain reproducible", () => {
  const result = buildPattern(input());
  assert.equal(spanOf(result.stones, result.gapMm), result.totalMm);
  const text = formatBomText(result);
  assert.match(text, /pear rivière/i);
  assert.match(text, /Point-to-center/);
  assert.match(text, /2\.5 × 1\.7/);
  const restored = JSON.parse(JSON.stringify(result)) as typeof result;
  assert.deepEqual(restored.stations, result.stations);
  assert.equal(restored.totalCarat, result.totalCarat);
});
