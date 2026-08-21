import { Palette } from "lucide-react";
import type { CSSProperties } from "react";
import {
  GEM_COLORS,
  gemColorAt,
  type ColorScope,
  type GemColorKey,
} from "@/lib/necklace/gem-colors";
import { useAtelier } from "@/lib/necklace/store";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/locale";

const SCOPE_KEYS: { id: ColorScope; key: "stone" | "pair" | "all" }[] = [
  { id: "stone", key: "stone" },
  { id: "pair", key: "pair" },
  { id: "all", key: "all" },
];

export function ColorStudio() {
  const selectedIndex = useAtelier((state) => state.selectedIndex);
  const gemColors = useAtelier((state) => state.gemColors);
  const colorScope = useAtelier((state) => state.colorScope);
  const setColorScope = useAtelier((state) => state.setColorScope);
  const paintGem = useAtelier((state) => state.paintGem);
  const selectedColor =
    selectedIndex == null ? null : gemColorAt(gemColors, selectedIndex);

  const t = useT();
  const apply = (color: GemColorKey) => {
    if (selectedIndex == null) return;
    paintGem(color);
  };

  return (
    <section className="mt-5 space-y-2 border-t border-border pt-4" aria-labelledby="color-studio-title">
      <div className="flex items-center justify-between gap-2">
        <h2 id="color-studio-title" className="flex items-center gap-1.5 text-sm font-medium">
          <Palette className="size-3.5 text-gold" />
          {t("color")}
        </h2>
        <p className="text-[10px] text-muted-foreground">
          {selectedIndex == null
            ? t("tapStone")
            : GEM_COLORS[selectedColor ?? "colorless"].label}
        </p>
      </div>

      <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-border" aria-label="Color scope">
        {SCOPE_KEYS.map((scope) => (
          <button
            key={scope.id}
            type="button"
            aria-pressed={colorScope === scope.id}
            onClick={() => setColorScope(scope.id)}
            className={cn(
              "h-9 border-r border-border px-1 text-[10px] last:border-r-0",
              colorScope === scope.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent",
            )}
          >
            {t(scope.key)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1" aria-label="Gem colors">
        {Object.entries(GEM_COLORS).map(([key, color]) => (
          <button
            key={key}
            type="button"
            disabled={selectedIndex == null}
            title={color.label}
            aria-label={`Apply ${color.label}`}
            aria-pressed={selectedColor === key}
            onClick={() => apply(key as GemColorKey)}
            className={cn(
              "gem-swatch flex min-h-9 items-center justify-center rounded-md border",
              selectedColor === key
                ? "border-primary"
                : "border-border hover:border-primary",
            )}
            style={{ "--gem-fill": color.fill, "--gem-light": color.light } as CSSProperties}
          >
            <span className="block size-4 rounded-full" />
          </button>
        ))}
      </div>
    </section>
  );
}
