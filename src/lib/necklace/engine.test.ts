import assert from "node:assert/strict";
import test from "node:test";
import {
  BRACELET_IN,
  DEFAULT_PEAR_SKU,
  GAP_MAX,
  GAP_MIN,
  INCHES,
  PEAR_CATALOG,
  PEAR_ORIENTATION,
  buildPattern,
  caratOf,
  defaultPrices,
  lengthMm,
  pearDimensions,
  pearShoulderRotation,
  pearTipOutRotation,
  pearWidth,
  resolvePearSku,
  spanOf,
  type BraceletIn,
  type LengthIn,
  type Metal,
  type PatternInput,
} from "./engine.ts";
import {
  alloyGramsFromSilver,
  pearBezelGrams,
  quoteMetals,
  silverBezelGrams,
} from "./metal-weight.ts";

function input(overrides: Partial<PatternInput> = {}): PatternInput {
  const metal = overrides.metal ?? "gold";
  return {
    metal,
    lengthIn: 16,
    braceletIn: 7,
    gapMm: 0.28,
    ratio: DEFAULT_PEAR_SKU.lengthMm / DEFAULT_PEAR_SKU.widthMm,
    mode: "range",
    minSize: 5,
    maxSize: 5,
    minWidth: 3,
    maxWidth: 3,
    list: [],
    prices: defaultPrices(metal),
    autoGapFromList: false,
    ...overrides,
  };
}

test("pear catalog contains the shop L×W chart", () => {
  assert.equal(PEAR_CATALOG[0].id, "5x3");
  assert.equal(resolvePearSku(7, 5).carat, 0.75);
  assert.equal(resolvePearSku(7.7, 5.7).carat, 1);
  assert.equal(resolvePearSku(10, 6).carat, 1.75);
  assert.equal(resolvePearSku(15, 10).carat, 5.75);
});

test("all supported necklace and bracelet lengths remain available", () => {
  assert.deepEqual(INCHES, [14, 15, 16, 17, 18]);
  assert.deepEqual(BRACELET_IN, [6, 6.5, 7]);
  for (const inches of INCHES) assert.equal(lengthMm(inches), Math.round(inches * 25.4 * 100) / 100);
});

test("catalog dimensions and carat win over free ratio", () => {
  assert.deepEqual(pearDimensions(5, 1.5, 3), {
    lengthMm: 5,
    widthMm: 3,
    depthMm: 1.83,
  });
  assert.equal(caratOf(5, 1.5, 3), 0.25);
  assert.equal(caratOf(8, 1.5, 6), 1.25);
});

test("strand pitch uses pear width and tips point radially out", () => {
  assert.equal(pearWidth(5, 1.67, 3), 3);
  assert.equal(spanOf([5, 5], 0.3, 5 / 3), 6.6);
  assert.equal(pearTipOutRotation(-Math.PI / 2), 0);
  assert.equal(pearTipOutRotation(Math.PI / 2), 180);
  assert.equal(pearShoulderRotation(360, 608, Math.PI / 2, 360, 360), 180);
  assert.equal(pearShoulderRotation(535, 360, 0, 360, 360), 90);
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
  assert.equal(result.orientation, PEAR_ORIENTATION);
});

test("bracelet and all hardware stay at the minimum while only the front graduates", () => {
  const result = buildPattern(input({ minSize: 5, minWidth: 3, maxSize: 8, maxWidth: 6 }));
  const fixed = result.stations.filter((s) => s.kind !== "necklace");
  assert.ok(fixed.every((s) => s.lengthMm === 5 && s.widthMm === 3));
  const front = result.stations.filter((s) => s.kind === "necklace");
  assert.equal(Math.max(...front.map((s) => s.lengthMm)), 8);
  assert.equal(front[Math.floor(front.length / 2)].lengthMm, 8);
  assert.deepEqual(front.map((s) => s.lengthMm), front.map((s) => s.lengthMm).reverse());
});

test("every station stores catalog length, width, and depth", () => {
  const result = buildPattern(input({ minSize: 6, minWidth: 4, maxSize: 6, maxWidth: 4 }));
  assert.ok(result.orientation.includes("Tip-out"));
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
          const result = buildPattern(input({
            metal,
            prices: defaultPrices(metal),
            lengthIn: lengthIn as LengthIn,
            braceletIn: braceletIn as BraceletIn,
            gapMm,
            minSize: 5,
            maxSize: 7,
            minWidth: 3,
            maxWidth: 5,
          }));
          assert.ok(result.totalMm <= result.lengthMm + 0.01);
          assert.ok(result.bracelet.setMm <= result.bracelet.lengthMm + 0.01);
          assert.ok(result.necklace.setMm <= result.necklace.lengthMm + 0.01);
        }
      }
    }
  }
});

test("single-size range remains single size", () => {
  const result = buildPattern(input({ minSize: 5, maxSize: 5, minWidth: 3, maxWidth: 3 }));
  assert.ok(result.stations.every((s) => s.lengthMm === 5 && s.widthMm === 3));
});

test("4.5 mm Ag925 round bezel is 0.4 g and scales with diameter cubed", () => {
  assert.equal(silverBezelGrams(4.5), 0.4);
  assert.equal(silverBezelGrams(9), 3.2);
  const pear = pearBezelGrams(4.5, 4.5);
  assert.equal(pear, 0.4);
  const weights = alloyGramsFromSilver(0.4);
  assert.ok(weights.k18 > weights.k14);
  assert.ok(weights.k14 > weights.k9);
  assert.ok(weights.k9 > weights.ag925);
  assert.ok(weights.pt950 > weights.k18);
  assert.equal(weights.ag925, 0.4);
});

test("pattern result includes bezel grams and metal quotes for five alloys", () => {
  const result = buildPattern(input({ minSize: 5, maxSize: 5, minWidth: 3, maxWidth: 3 }));
  assert.ok(result.bezelAg925G > 0);
  assert.ok(result.metalWeights.k18 > result.metalWeights.ag925);
  const quotes = quoteMetals(result.bezelAg925G, result.totalCost);
  assert.equal(quotes.length, 5);
  assert.deepEqual(
    quotes.map((q) => q.id),
    ["k18", "k14", "k9", "ag925", "pt950"],
  );
  assert.ok(quotes.every((q) => q.total >= q.stoneCost));
});
