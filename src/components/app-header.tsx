import { Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { formatCarat, formatMoney } from "@/lib/necklace/engine";
import { PRESETS, useAtelier } from "@/lib/necklace/store";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { SuiteMenu } from "@/components/suite-menu";

export function AppHeader() {
  const result = useAtelier((s) => s.result);
  const applyPreset = useAtelier((s) => s.applyPreset);
  const { user, isPending } = useCurrentUserState();
  const theme = useTheme((s) => s.theme);
  const setTheme = useTheme((s) => s.setTheme);
  const cyber = theme === "cyber";

  return (
    <header className="no-print sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-baseline gap-2">
          {cyber ? (
            <span className="font-display text-xl leading-none tracking-wide uppercase">
              <span className="text-neon cyber-glow">HANZU</span>
              <span className="text-gold">TECH</span>
            </span>
          ) : (
            <span className="font-display text-2xl leading-none tracking-tight">
              Rivière
            </span>
          )}
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Pear rivière
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <dl className="hidden items-center gap-4 text-xs tabular-nums text-muted-foreground lg:flex">
            <Stat label="pcs" value={String(result.totalPcs)} />
            <Stat label="ct" value={formatCarat(result.totalCarat)} />
            <Stat label="stones" value={formatMoney(result.totalCost)} />
          </dl>
          <div className="hidden items-center gap-1 md:flex">
            {PRESETS.filter((p) => p.id === "rn" || p.id === "rr").map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className="h-9 rounded-md border border-border px-2.5 text-xs hover:bg-accent"
              >
                {p.id === "rn" ? "RN" : "RR"}
              </button>
            ))}
          </div>
          <div className="flex overflow-hidden rounded-md border border-border">
            {(["atelier", "cyber"] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setTheme(id)}
                className={cn(
                  "h-9 px-2.5 text-xs capitalize",
                  theme === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent",
                )}
              >
                {id}
              </button>
            ))}
          </div>
          {isPending ? (
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : user && !user.isDevFallback ? (
            <UserButton />
          ) : !user ? (
            <Link
              to="/login"
              className="inline-flex h-11 items-center rounded-md border border-border px-3 text-sm hover:bg-accent"
            >
              Sign in
            </Link>
          ) : null}
        </div>
        <SuiteMenu active="pear" />
      </div>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="uppercase tracking-wide">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
