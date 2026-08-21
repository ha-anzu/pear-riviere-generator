import {
  formatCarat,
  formatMoney,
  formatPearSize,
  type PatternResult,
} from "./engine";
import type { ThemeId } from "@/lib/theme";

function svgToImage(svg: SVGSVGElement, px: number): Promise<HTMLImageElement> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(px));
  clone.setAttribute("height", String(px));
  const xml = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(
    new Blob([xml], { type: "image/svg+xml;charset=utf-8" }),
  );
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not rasterize necklace"));
    };
    img.src = url;
  });
}

export async function exportHdJpg(opts: {
  svg: SVGSVGElement;
  result: PatternResult;
  projectId: string;
  projectName: string;
  notes: string;
  theme: ThemeId;
}): Promise<void> {
  const W = 2400;
  const H = 1600;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas");

  const light = opts.theme === "white";
  ctx.fillStyle = light ? "#f4f1ea" : "#0c0b0a";
  ctx.fillRect(0, 0, W, H);

  const img = await svgToImage(opts.svg, 1400);
  ctx.drawImage(img, 40, 100, 1400, 1400);

  const x = 1500;
  ctx.fillStyle = light ? "#161412" : "#ece6da";
  ctx.font = "600 42px 'IBM Plex Sans', 'Noto Sans Thai', sans-serif";
  const title = opts.projectName.trim() || "Pear rivière";
  ctx.fillText(title, x, 160);

  ctx.fillStyle = light ? "#ffcc00" : "#a3988c";
  ctx.font = light
    ? "400 22px 'IBM Plex Mono', monospace"
    : "400 22px Outfit, sans-serif";
  ctx.fillText(opts.projectId || "unsaved", x, 200);

  const r = opts.result;
  const stats = [
    `${r.lengthIn}″  ·  ${r.metal === "gold" ? "Gold" : "Silver"}`,
    `Bracelet ${r.braceletIn}″  ·  front ${r.necklaceIn}″`,
    `${r.totalPcs} pcs  ·  ${formatCarat(r.totalCarat)} ct`,
    `${formatMoney(r.totalCost)} stones · Ag925 ${r.bezelAg925G.toFixed(2)} g`,
    `Gap ${r.gapMm.toFixed(2)} mm`,
    `Pear ratio ${r.ratio.toFixed(2)}  ·  depth 61% of width`,
    `Lock ${formatPearSize(r.minSize, r.ratio)} mm × 2  ·  converter × 2`,
  ];
  ctx.fillStyle = light ? "#e5e7eb" : "#f4f0e8";
  ctx.font = light
    ? "400 28px 'IBM Plex Mono', monospace"
    : "400 28px Outfit, sans-serif";
  stats.forEach((line, i) => ctx.fillText(line, x, 280 + i * 44));

  ctx.fillStyle = light ? "#ffcc00" : "#a3988c";
  ctx.font = light
    ? "700 18px 'IBM Plex Sans', sans-serif"
    : "500 18px Outfit, sans-serif";
  ctx.fillText("SIZE LIST", x, 580);

  ctx.font = light
    ? "400 24px 'IBM Plex Mono', monospace"
    : "400 24px Outfit, sans-serif";
  ctx.fillStyle = light ? "#e5e7eb" : "#f4f0e8";
  r.bom.slice(0, 14).forEach((line, i) => {
    ctx.fillText(
      `${formatPearSize(line.lengthMm, r.ratio)} mm   × ${line.pcs}    ${formatCarat(line.carat)} ct`,
      x,
      620 + i * 34,
    );
  });

  if (opts.notes.trim()) {
    ctx.fillStyle = light ? "#9ca3af" : "#a3988c";
    ctx.font = light
      ? "400 20px 'IBM Plex Mono', monospace"
      : "400 20px Outfit, sans-serif";
    const note = opts.notes.trim().slice(0, 220);
    wrapText(ctx, note, x, 1280, 820, 28);
  }

  ctx.fillStyle = light ? "#ff0033" : "#c4a574";
  ctx.font = light
    ? "700 18px 'IBM Plex Sans', sans-serif"
    : "500 18px Outfit, sans-serif";
  ctx.fillText(
    light ? "HANZU TECH  ·  OPENTOOLS" : "RIVIÈRE",
    x,
    1540,
  );

  const a = document.createElement("a");
  const slug = (opts.projectName || opts.projectId || "pear-riviere")
    .replace(/[^\w.-]+/g, "-")
    .replace(/^-|-$/g, "");
  a.download = `${slug || "pear-riviere"}.jpg`;
  a.href = canvas.toDataURL("image/jpeg", 0.95);
  a.click();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(/\s+/);
  let line = "";
  let yy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}

export function exportJson(opts: {
  config: unknown;
  result: PatternResult;
  projectId: string;
  projectName: string;
  notes: string;
}) {
  const data = {
    schemaVersion: 1,
    shape: "pear",
    id: opts.projectId,
    name: opts.projectName,
    notes: opts.notes,
    config: opts.config,
    totalPcs: opts.result.totalPcs,
    totalCt: opts.result.totalCarat,
    totalCost: opts.result.totalCost,
    bezelAg925G: opts.result.bezelAg925G,
    metalWeights: opts.result.metalWeights,
    ratio: opts.result.ratio,
    depthFactor: opts.result.depthFactor,
    orientation: opts.result.orientation,
    bom: opts.result.bom,
    bracelet: opts.result.bracelet,
    necklace: opts.result.necklace,
    findings: opts.result.findings,
    assembly: opts.result.assembly,
    stations: opts.result.stations,
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.download = `${opts.projectName || opts.projectId || "pear-riviere"}.json`;
  a.href = URL.createObjectURL(blob);
  a.click();
  URL.revokeObjectURL(a.href);
}
