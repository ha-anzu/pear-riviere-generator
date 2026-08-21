import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  BRACELET_IN,
  GAP_MAX,
  GAP_MIN,
  INCHES,
  PEAR_CATALOG,
  formatPearSku,
  formatSize,
  pearSkuId,
  pearSkuOptionLabel,
  resolvePearSku,
  type BraceletIn,
  type LengthIn,
} from "@/lib/necklace/engine";
import { PRESETS, useAtelier } from "@/lib/necklace/store";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/locale";

export function ControlPanel() {
  const s = useAtelier();
  const t = useT();
  const minSku = resolvePearSku(s.minSize, s.minWidth);
  const maxSku = resolvePearSku(s.maxSize, s.maxWidth);
  const single = minSku.id === maxSku.id;

  return (
    <div className="flex flex-col gap-5">
      <Field label={t("metal")}>
        <div className="grid grid-cols-2 gap-2">
          {(["gold", "silver"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => s.setMetal(m)}
              className={cn(
                "flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors",
                s.metal === m
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted text-foreground hover:bg-accent",
              )}
            >
              <span
                className={cn(
                  "size-3 rounded-full",
                  m === "gold" ? "bg-gold" : "bg-silver",
                )}
              />
              {m === "gold" ? t("gold") : t("silver")}
            </button>
          ))}
        </div>
      </Field>

      <Field label={t("metalColor")}>
        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              ["yellow", t("yellow")],
              ["white", t("whiteMetal")],
              ["rose", t("rose")],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => s.setMetalColor(id)}
              className={cn(
                "flex h-11 items-center justify-center gap-2 rounded-lg border text-sm transition-colors",
                s.metalColor === id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted text-foreground hover:bg-accent",
              )}
            >
              <span
                className={
                  id === "yellow"
                    ? "size-3 rounded-full bg-metal-yellow"
                    : id === "white"
                      ? "size-3 rounded-full bg-metal-white"
                      : "size-3 rounded-full bg-metal-rose"
                }
              />
              {label}
            </button>
          ))}
        </div>
      </Field>

      <Field label={t("length")}>
        <div className="grid grid-cols-5 gap-1.5">
          {INCHES.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => s.setLength(n as LengthIn)}
              className={cn(
                "h-11 rounded-lg border text-sm tabular-nums transition-colors",
                s.lengthIn === n
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted text-foreground hover:bg-accent",
              )}
            >
              {n}″
            </button>
          ))}
        </div>
      </Field>

      <Field label={t("backBracelet")}>
        <div className="grid grid-cols-3 gap-1.5">
          {BRACELET_IN.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => s.setBracelet(n as BraceletIn)}
              className={cn(
                "h-11 rounded-lg border text-sm tabular-nums transition-colors",
                s.braceletIn === n
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted text-foreground hover:bg-accent",
              )}
            >
              {n}″
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Finished back including lock 1. Front is{" "}
          {formatSize(s.lengthIn - s.braceletIn)}″ with lock 2 + converters.
        </p>
      </Field>



      <Field label={t("pattern")}>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["range", t("range")],
              ["list", t("list")],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => s.setMode(id)}
              className={cn(
                "h-11 rounded-lg border text-sm transition-colors",
                s.mode === id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted text-foreground hover:bg-accent",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </Field>

      {s.mode === "range" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Size run</Label>
            <button
              type="button"
              onClick={() => s.setSingle(s.minSize)}
              className={cn(
                "h-8 rounded-full border px-3 text-xs",
                single
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-accent",
              )}
            >
              Single size
            </button>
          </div>
          <label className="block space-y-1 text-xs text-muted-foreground">
            {single ? "Pear size" : "Smallest (bracelet / lock)"}
            <select
              value={minSku.id}
              onChange={(e) => {
                const sku = PEAR_CATALOG.find((item) => item.id === e.target.value);
                if (!sku) return;
                if (single) s.setSingle(sku.lengthMm, sku.widthMm);
                else s.setMin(sku.lengthMm, sku.widthMm);
              }}
              className="h-11 w-full rounded-md border border-input bg-muted px-2 text-sm tabular-nums text-foreground"
            >
              {PEAR_CATALOG.map((sku) => (
                <option key={sku.id} value={sku.id}>
                  {pearSkuOptionLabel(sku)}
                </option>
              ))}
            </select>
          </label>
          {!single && (
            <label className="block space-y-1 text-xs text-muted-foreground">
              Largest (front)
              <select
                value={maxSku.id}
                onChange={(e) => {
                  const sku = PEAR_CATALOG.find((item) => item.id === e.target.value);
                  if (sku) s.setMax(sku.lengthMm, sku.widthMm);
                }}
                className="h-11 w-full rounded-md border border-input bg-muted px-2 text-sm tabular-nums text-foreground"
              >
                {PEAR_CATALOG.map((sku) => (
                  <option key={sku.id} value={sku.id}>
                    {pearSkuOptionLabel(sku)}
                  </option>
                ))}
              </select>
            </label>
          )}
          {!single && (
            <p className="text-xs text-muted-foreground">
              Graduates {formatPearSku(minSku)} → {formatPearSku(maxSku)} mm
              on the front. Bracelet and locks stay {formatPearSku(minSku)} mm.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Size · pcs</Label>
            <Button size="sm" variant="secondary" onClick={s.addListRow}>
              <Plus /> Add size
            </Button>
          </div>
          <div className="space-y-2">
            {s.list.map((row, i) => (
              <div key={`${row.sizeMm}-${i}`} className="flex items-center gap-2">
                <select
                  value={pearSkuId(row.sizeMm, row.widthMm ?? resolvePearSku(row.sizeMm).widthMm)}
                  onChange={(e) => {
                    const sku = PEAR_CATALOG.find((item) => item.id === e.target.value);
                    if (!sku) return;
                    s.updateListRow(i, { sizeMm: sku.lengthMm, widthMm: sku.widthMm });
                  }}
                  className="h-10 flex-1 rounded-md border border-input bg-muted px-2 text-sm tabular-nums"
                >
                  {PEAR_CATALOG.map((sku) => (
                    <option key={sku.id} value={sku.id}>
                      {pearSkuOptionLabel(sku)}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={row.pcs}
                  onChange={(e) =>
                    s.updateListRow(i, { pcs: Number(e.target.value) })
                  }
                  className="w-20"
                  aria-label="Piece count"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => s.removeListRow(i)}
                  aria-label="Remove size"
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
            {s.list.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Add sizes for the <em>front strand</em>. Bracelet is auto-filled
                in the smallest size. Largest sits at 6 o’clock.
              </p>
            )}
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={s.autoGapFromList}
              onChange={(e) => s.setAutoGap(e.target.checked)}
              className="size-4 accent-primary"
            />
            Back-solve gap from this count
          </label>
        </div>
      )}

      <SizeSlider
        label="Girdle gap"
        value={s.gapMm}
        metalStep={0.01}
        min={GAP_MIN}
        max={GAP_MAX}
        suffix="mm"
        disabled={s.mode === "list" && s.autoGapFromList}
        onChange={s.setGap}
      />

      <Separator />

      <Field label="Match carat or budget">
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            min={0}
            step={0.1}
            placeholder="Target ct"
            value={s.targetCt}
            onChange={(e) => s.setTargetCt(e.target.value)}
          />
          <Input
            type="number"
            min={0}
            step={50}
            placeholder="Budget USD"
            value={s.budget}
            onChange={(e) => s.setBudget(e.target.value)}
          />
        </div>
        <Button variant="secondary" onClick={s.findMatches}>
          Find mixes
        </Button>
        <p className="text-xs text-muted-foreground">
          Target ct is used if both are filled. Gold prices are diamond $/ct;
          silver is stone $/ct — edit below.
        </p>
      </Field>

      <details className="group rounded-xl border border-border bg-muted/40 p-3">
        <summary className="cursor-pointer text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Stone $/ct by size
        </summary>
        <div className="mt-3 space-y-2">
          {s.prices.map((b, i) => (
            <div key={`${b.minMm}-${b.maxMm}`} className="flex items-center gap-2">
              <span className="w-24 text-xs tabular-nums text-muted-foreground">
                {formatSize(b.minMm)}–{formatSize(b.maxMm)}
              </span>
              <Input
                type="number"
                min={0}
                step={1}
                value={b.perCt}
                onChange={(e) => s.setPrice(i, Number(e.target.value))}
                className="h-9"
              />
            </div>
          ))}
        </div>
      </details>

      <Field label="Examples">
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.filter((p) => p.id === "rn" || p.id === "rr").map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => s.applyPreset(p)}
              className="h-11 rounded-lg border border-border bg-muted text-sm hover:bg-accent"
            >
              {p.id === "rn" ? "Example RN" : "Example RR"}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          RN = silver 15″ graduated · RR = gold 16″ 2.5 × 1.7 mm line
        </p>
      </Field>

      <Field label="Presets">
        <select
          className="h-10 w-full rounded-md border border-input bg-muted px-2 text-sm"
          defaultValue=""
          onChange={(e) => {
            const p = PRESETS.find((x) => x.id === e.target.value);
            if (p) s.applyPreset(p);
            e.target.value = "";
          }}
        >
          <option value="" disabled>
            Load a starting necklace
          </option>
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SizeSlider({
  label,
  value,
  min,
  max,
  metalStep,
  onChange,
  suffix = "mm",
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  metalStep: number;
  onChange: (v: number) => void;
  suffix?: string;
  disabled?: boolean;
}) {
  const factor = metalStep < 0.05 ? 100 : 10;
  return (
    <div className={cn("space-y-1", disabled && "opacity-40")}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs tabular-nums text-foreground">
          {metalStep < 0.05 ? value.toFixed(2) : formatSize(value)} {suffix}
        </span>
      </div>
      <Slider
        min={Math.round(min * factor)}
        max={Math.round(max * factor)}
        step={Math.round(metalStep * factor) || 1}
        value={[Math.round(value * factor)]}
        disabled={disabled}
        onValueChange={([v]) => onChange((v ?? 0) / factor)}
      />
    </div>
  );
}
