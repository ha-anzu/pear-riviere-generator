import { Copy, Download, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";
import { PearMark } from "@/components/diamond-mark";
import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/clipboard";
import {
  csvBom,
  formatBomText,
  formatCarat,
  formatMoney,
  formatPearSize,
  type Variant,
} from "@/lib/necklace/engine";
import { useAtelier } from "@/lib/necklace/store";
import { cn } from "@/lib/utils";
import { formatColorPlan, gemColorCounts } from "@/lib/necklace/gem-colors";

export function BomPanel() {
  const { result, variants, matches, applyVariant, gemColors } = useAtelier();

  const copy = async () => {
    await copyText(
      `${formatBomText(result)}\n\nCOLOR PLAN\n${formatColorPlan(gemColors, result.totalPcs)}`,
    );
    toast.success("BOM copied");
  };

  const download = () => {
    const colorRows = gemColorCounts(gemColors, result.totalPcs)
      .map((item) => `color,${item.label},${item.count}`)
      .join("\n");
    const blob = new Blob([`${csvBom(result)}\n${colorRows}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `necklace-${result.lengthIn}in-${result.metal}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl leading-tight">Size list</h2>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => void copy()}>
            <Copy /> Copy
          </Button>
          <Button size="sm" variant="secondary" onClick={download}>
            <Download /> CSV
          </Button>
        </div>
      </div>

      {result.fit !== "ok" && (
        <p
          className={cn(
            "rounded-lg border px-3 py-2 text-xs",
            result.fit === "long"
              ? "border-destructive/40 text-destructive"
              : "border-border text-muted-foreground",
          )}
        >
          {result.fit === "long"
            ? `Run is ${Math.abs(result.leftoverMm).toFixed(1)} mm longer than ${result.lengthIn}″. Drop pcs or gap.`
            : `Run is ${result.leftoverMm.toFixed(1)} mm short of ${result.lengthIn}″. Add pcs or open the gap.`}
        </p>
      )}
      {result.gapOutOfRange && (
        <p className="text-xs text-muted-foreground">
          Implied gap {result.gapMm.toFixed(2)} mm is outside the 0.2–0.5 mm
          shop tolerance.
        </p>
      )}

      <div className="min-w-0 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm tabular-nums">
          <thead className="bg-muted text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Gem</th>
              <th className="px-3 py-2 font-medium">Size</th>
              <th className="px-3 py-2 font-medium">Pcs</th>
              <th className="px-3 py-2 font-medium">Ct</th>
              <th className="px-3 py-2 font-medium">$/ct</th>
              <th className="px-3 py-2 font-medium">Cost</th>
            </tr>
          </thead>
          <tbody>
            {result.bom.map((line) => (
              <tr key={line.sizeMm} className="border-t border-border">
                <td className="px-3 py-1.5">
                  <svg viewBox="0 0 28 28" className="size-7">
                    <g transform="translate(14,14)">
                      <PearMark r={8} metal={result.metal} aspectRatio={result.ratio} />
                    </g>
                  </svg>
                </td>
                <td className="px-3 py-1.5">{formatPearSize(line.lengthMm, result.ratio)} mm</td>
                <td className="px-3 py-1.5">{line.pcs}</td>
                <td className="px-3 py-1.5">{formatCarat(line.carat)}</td>
                <td className="px-3 py-1.5">{formatMoney(line.perCt)}</td>
                <td className="px-3 py-1.5">{formatMoney(line.cost)}</td>
              </tr>
            ))}
            {result.bom.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-muted-foreground"
                >
                  No stones yet.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="border-t border-border bg-muted/50 font-medium">
            <tr>
              <td className="px-3 py-2" colSpan={2}>
                Total
              </td>
              <td className="px-3 py-2">{result.totalPcs}</td>
              <td className="px-3 py-2">{formatCarat(result.totalCarat)}</td>
              <td />
              <td className="px-3 py-2">{formatMoney(result.totalCost)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <VariantRow title="Style lines" items={variants} onApply={applyVariant} />
      {matches.length > 0 && (
        <VariantRow
          title="Closest mixes"
          items={matches}
          onApply={applyVariant}
        />
      )}
    </div>
  );
}

function VariantRow({
  title,
  items,
  onApply,
}: {
  title: string;
  items: Variant[];
  onApply: (v: Variant) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">
        {title}
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {items.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onApply(v)}
            className="rounded-xl border border-border bg-card p-3 text-left transition-colors hover:bg-accent"
          >
            <div className="flex items-center gap-2">
              <LayoutTemplate className="size-3.5 text-muted-foreground" />
              <span className="text-sm font-medium">{v.name}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{v.note}</p>
            <p className="mt-2 text-xs tabular-nums text-foreground">
              {v.result.totalPcs} pcs · {formatCarat(v.result.totalCarat)} ct ·{" "}
              {formatMoney(v.result.totalCost)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
