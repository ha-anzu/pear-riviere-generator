import { Palette } from "lucide-react";
import type { CSSProperties } from "react";
import {
  GEM_COLORS,
  gemColorAt,
  gemColorCounts,
  type ColorScope,
  type GemColorKey,
} from "@/lib/necklace/gem-colors";
import { useAtelier } from "@/lib/necklace/store";
import { cn } from "@/lib/utils";

const SCOPES: { id: ColorScope; label: string }[] = [
  { id: "stone", label: "This stone" },
  { id: "pair", label: "Mirror pair" },
  { id: "all", label: "All stones" },
];

export function ColorStudio() {
  const result = useAtelier((state) => state.result);
  const selectedIndex = useAtelier((state) => state.selectedIndex);
  const gemColors = useAtelier((state) => state.gemColors);
  const colorScope = useAtelier((state) => state.colorScope);
  const setColorScope = useAtelier((state) => state.setColorScope);
  const paintGem = useAtelier((state) => state.paintGem);
  const selectedColor =
    selectedIndex == null ? null : gemColorAt(gemColors, selectedIndex);
  const counts = gemColorCounts(gemColors, result.totalPcs);

  const apply = (color: GemColorKey) => {
    if (selectedIndex == null) return;
    paintGem(color);
  };

  return (
    <section className="mt-6 space-y-3 border-t border-border pt-5" aria-labelledby="color-studio-title">
      <div className="flex items-center gap-2">
        <Palette className="size-4 text-gold" />
        <div>
          <h2 id="color-studio-title" className="text-sm font-medium">Gem color studio</h2>
          <p className="text-xs text-muted-foreground">
            {selectedIndex == null
              ? "Select a stone in the circular or strand preview."
              : `Stone ${selectedIndex + 1} of ${result.totalPcs} · ${GEM_COLORS[selectedColor ?? "colorless"].label}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-border" aria-label="Color scope">
        {SCOPES.map((scope) => (
          <button
            key={scope.id}
            type="button"
            aria-pressed={colorScope === scope.id}
            onClick={() => setColorScope(scope.id)}
            className={cn(
              "min-h-11 border-r border-border px-1.5 text-xs last:border-r-0",
              colorScope === scope.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent",
            )}
          >
            {scope.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1.5" aria-label="Gem colors">
        {Object.entries(GEM_COLORS).map(([key, color]) => (
          <button
            key={key}
            type="button"
            disabled={selectedIndex == null}
            aria-label={`Apply ${color.label}`}
            aria-pressed={selectedColor === key}
            onClick={() => apply(key as GemColorKey)}
            className={cn(
              "gem-swatch min-h-12 rounded-md border px-1 py-1 text-center text-muted-foreground transition-colors",
              selectedColor === key
                ? "border-primary text-foreground"
                : "border-border hover:border-primary",
            )}
            style={{ "--gem-fill": color.fill, "--gem-light": color.light } as CSSProperties}
          >
            <span className="mx-auto block size-5 rounded-full" />
            <span className="mt-1 block truncate text-[9px]">{color.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5" aria-label="Current color allocation">
        {counts.map((item) => (
          <span key={item.key} className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground">
            <i className="size-2 rounded-full" style={{ background: item.fill }} />
            {item.label} · {item.count}
          </span>
        ))}
      </div>
    </section>
  );
}
