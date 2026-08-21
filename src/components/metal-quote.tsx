import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/necklace/engine";
import {
  ALLOY_ORDER,
  ALLOYS,
  quoteMetals,
  type AlloyId,
  type MetalWeights,
} from "@/lib/necklace/metal-weight";
import { useT } from "@/lib/locale";

export function MetalPriceFields({
  prices,
  onChange,
}: {
  prices: MetalWeights;
  onChange: (id: AlloyId, perG: number) => void;
}) {
  const t = useT();
  return (
    <details className="group rounded-xl border border-border bg-muted/40 p-3">
      <summary className="cursor-pointer text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {t("metalPrice")}
      </summary>
      <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
        {t("bezelNote")}
      </p>
      <div className="mt-3 space-y-2">
        {ALLOY_ORDER.map((id) => (
          <div key={id} className="flex items-center gap-2">
            <span className="w-24 text-xs text-muted-foreground">
              {ALLOYS[id].label}
            </span>
            <Input
              type="number"
              min={0}
              step={0.1}
              value={prices[id]}
              onChange={(e) => onChange(id, Number(e.target.value))}
              className="h-9"
              aria-label={`${ALLOYS[id].label} USD per gram`}
            />
          </div>
        ))}
      </div>
    </details>
  );
}

export function MetalQuoteTable({
  gramsAg,
  stoneCost,
  prices,
}: {
  gramsAg: number;
  stoneCost: number;
  prices: MetalWeights;
}) {
  const t = useT();
  const quotes = quoteMetals(gramsAg, stoneCost, prices);
  return (
    <div>
      <p className="mb-1 text-xs tracking-wide text-muted-foreground uppercase">
        {t("metalWeight")}
      </p>
      <p className="mb-2 text-[11px] leading-snug text-muted-foreground">
        {t("bezelNote")} · {t("stoneCost")} {formatMoney(stoneCost)}
      </p>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm tabular-nums">
          <thead className="bg-muted text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">{t("metal")}</th>
              <th className="px-3 py-2 font-medium">{t("grams")}</th>
              <th className="px-3 py-2 font-medium">{t("perGram")}</th>
              <th className="px-3 py-2 font-medium">{t("metalCost")}</th>
              <th className="px-3 py-2 font-medium">{t("grandTotal")}</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id} className="border-t border-border">
                <td className="px-3 py-1.5">{q.label}</td>
                <td className="px-3 py-1.5">{q.grams.toFixed(2)}</td>
                <td className="px-3 py-1.5">{formatMoney(q.perG)}</td>
                <td className="px-3 py-1.5">{formatMoney(q.metalCost)}</td>
                <td className="px-3 py-1.5 font-medium">
                  {formatMoney(q.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
