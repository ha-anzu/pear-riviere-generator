import { Copy } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/clipboard";
import {
  formatBomText,
  formatCarat,
  formatMoney,
  formatPearSize,
  type BomLine,
  type PatternResult,
  type SegmentFit,
} from "@/lib/necklace/engine";
import { cn } from "@/lib/utils";
import { useAtelier } from "@/lib/necklace/store";
import { formatColorPlan } from "@/lib/necklace/gem-colors";
import { useT, type Msg } from "@/lib/locale";

export function ManufacturingSheet({ result }: { result: PatternResult }) {
  const gemColors = useAtelier((state) => state.gemColors);
  const t = useT();
  const copy = async () => {
    await copyText(
      `${formatBomText(result)}\n\nCOLOR PLAN\n${formatColorPlan(gemColors, result.totalPcs)}`,
    );
    toast.success(t("copied"));
  };

  return (
    <section
      id="shop-sheet"
      className="space-y-5 rounded-2xl border border-border bg-card p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold leading-tight">{t("shopSheet")}</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => void copy()}>
            <Copy /> {t("copy")}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => window.print()}>
            {t("print")}
          </Button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <Stat
          label={t("finishedLength")}
          value={`${result.lengthIn}″`}
          hint={`${result.lengthMm.toFixed(1)} mm`}
        />
        <Stat
          label={t("braceletBack")}
          value={`${result.braceletIn}″`}
          hint={`${t("inclLock1")} · ${result.bracelet.pcs} ${t("pcs")}`}
        />
        <Stat
          label={t("necklaceFront")}
          value={`${result.necklaceIn}″`}
          hint={`${t("inclLock2")} · ${result.necklace.pcs} ${t("pcs")}`}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FitCard seg={result.bracelet} />
        <FitCard seg={result.necklace} />
      </div>

      <div>
        <p className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">
          {t("chain")}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <LinkChip tone="lock">{t("f1")}</LinkChip>
          <Dash />
          <LinkChip tone="bracelet">{t("bracelet")} {result.braceletIn}″</LinkChip>
          <Dash />
          <LinkChip tone="lock">{t("m1")}</LinkChip>
          <Join>R · M1→F2</Join>
          <LinkChip tone="lock">{t("f2")}</LinkChip>
          <Dash />
          <LinkChip tone="conv">{t("convL")}</LinkChip>
          <Dash />
          <LinkChip tone="front">{t("front")} {result.necklaceIn}″</LinkChip>
          <Dash />
          <LinkChip tone="conv">{t("convR")}</LinkChip>
          <Dash />
          <LinkChip tone="lock">{t("m2")}</LinkChip>
          <Join>L · M2→F1</Join>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BomBlock title={t("braceletBom")} seg={result.bracelet} ratio={result.ratio} />
        <BomBlock title={t("necklaceBom")} seg={result.necklace} ratio={result.ratio} />
      </div>

      <div>
        <p className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">
          {t("findings")}
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">{t("item")}</th>
                <th className="px-3 py-2 font-medium">{t("size")}</th>
                <th className="px-3 py-2 font-medium">{t("pcs")}</th>
                <th className="px-3 py-2 font-medium">{t("stonesOnTop")}</th>
              </tr>
            </thead>
            <tbody>
              {result.findings.map((f) => (
                <tr key={f.id} className="border-t border-border">
                  <td className="px-3 py-2">
                    <p className="font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.detail}</p>
                  </td>
                  <td className="px-3 py-2 tabular-nums">
                    {formatPearSize(f.lengthMm, result.ratio)} mm
                  </td>
                  <td className="px-3 py-2 tabular-nums">{f.pcs}</td>
                  <td className="px-3 py-2 tabular-nums">{f.stonesOnTop} / pc</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">
          {t("assembly")}
        </p>
        <ol className="space-y-2">
          {result.assembly.map((step) => (
            <li
              key={step.n}
              className="grid grid-cols-[2rem_1fr] gap-3 rounded-xl border border-border px-3 py-2"
            >
              <span className="font-display text-xl leading-8 text-gold">
                {step.n}
              </span>
              <div>
                <p className="text-sm font-medium">{t(`step${step.n}` as Msg)}</p>
                <p className="text-xs text-muted-foreground">{t(`step${step.n}d` as Msg)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ModeCard
          title={t("necklaceMode")}
          body={t("necklaceModeBody")}
        />
        <ModeCard
          title={t("braceletMode")}
          body={t("braceletModeBody")}
        />
      </div>

      <p className="text-xs tabular-nums text-muted-foreground">
        Total {result.totalPcs} pcs · {formatCarat(result.totalCarat)} ct ·{" "}
        {formatMoney(result.totalCost)} · gap {result.gapMm.toFixed(2)} mm ·
        leftover {result.leftoverMm > 0 ? "+" : ""}
        {result.leftoverMm.toFixed(1)} mm of {result.lengthMm.toFixed(1)} mm
      </p>
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-2xl leading-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function FitCard({ seg }: { seg: SegmentFit }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        seg.fit === "long"
          ? "border-destructive/40"
          : seg.fit === "short"
            ? "border-border"
            : "border-border",
      )}
    >
      <p className="text-xs tracking-wide text-muted-foreground uppercase">
        {seg.label} fit
      </p>
      <p className="mt-1 text-sm tabular-nums">
        {seg.setMm.toFixed(1)} mm of {seg.lengthMm.toFixed(1)} mm
      </p>
      <p className="text-xs text-muted-foreground">
        leftover {seg.leftoverMm > 0 ? "+" : ""}
        {seg.leftoverMm.toFixed(1)} mm · {fitWord(seg)}
      </p>
    </div>
  );
}

function fitWord(seg: SegmentFit): string {
  if (seg.fit === "ok") return "in tolerance";
  if (seg.fit === "long") return "over length — drop pcs or gap";
  return "short — add pcs or open the gap";
}

function BomBlock({
  title,
  seg,
  ratio,
}: {
  title: string;
  seg: SegmentFit;
  ratio: number;
}) {
  return (
    <div>
      <p className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">
        {title}
      </p>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm tabular-nums">
          <thead className="bg-muted text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Size</th>
              <th className="px-3 py-2 font-medium">Pcs</th>
              <th className="px-3 py-2 font-medium">Ct</th>
              <th className="px-3 py-2 font-medium">Cost</th>
            </tr>
          </thead>
          <tbody>
            {seg.bom.map((line) => (
              <BomRow key={line.sizeMm} line={line} ratio={ratio} />
            ))}
            {seg.bom.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-4 text-center text-muted-foreground"
                >
                  Empty run
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="border-t border-border bg-muted/50 font-medium">
            <tr>
              <td className="px-3 py-2">Total</td>
              <td className="px-3 py-2">{seg.pcs}</td>
              <td className="px-3 py-2">{formatCarat(seg.carat)}</td>
              <td className="px-3 py-2">
                {formatMoney(seg.bom.reduce((a, l) => a + l.cost, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function BomRow({ line, ratio }: { line: BomLine; ratio: number }) {
  return (
    <tr className="border-t border-border">
      <td className="px-3 py-1.5">{formatPearSize(line.lengthMm, ratio)} mm</td>
      <td className="px-3 py-1.5">{line.pcs}</td>
      <td className="px-3 py-1.5">{formatCarat(line.carat)}</td>
      <td className="px-3 py-1.5">{formatMoney(line.cost)}</td>
    </tr>
  );
}

function LinkChip({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "lock" | "bracelet" | "conv" | "front";
}) {
  return (
    <span
      className={cn(
        "rounded-md border px-2 py-1",
        tone === "lock" && "border-gold/40 text-gold",
        tone === "bracelet" && "border-border text-muted-foreground",
        tone === "conv" && "border-silver/40 text-silver",
        tone === "front" && "border-border text-foreground",
      )}
    >
      {children}
    </span>
  );
}

function Dash() {
  return <span className="text-muted-foreground">—</span>;
}

function Join({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-dashed border-gold/50 px-2 py-1 text-gold">
      {children}
    </span>
  );
}

function ModeCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 px-3 py-3">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
