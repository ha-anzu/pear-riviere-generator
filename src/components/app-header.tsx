import { Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useT, useLocale, type Lang } from "@/lib/locale";
import { useTheme, type ThemeId } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { SuiteMenu } from "@/components/suite-menu";

export function AppHeader() {
  const { user, isPending } = useCurrentUserState();
  const theme = useTheme((s) => s.theme);
  const setTheme = useTheme((s) => s.setTheme);
  const lang = useLocale((s) => s.lang);
  const setLang = useLocale((s) => s.setLang);
  const t = useT();

  return (
    <header className="no-print sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="min-w-0">
          <span className="block font-display text-xl font-semibold leading-none">
            {t("suite")}
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">{t("pearTool")}</span>
        </Link>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Seg
            value={lang}
            options={[
              ["en", t("english")],
              ["th", t("thai")],
            ]}
            onChange={(value) => setLang(value as Lang)}
            label="Language"
          />
          <Seg
            value={theme}
            options={[
              ["black", t("black")],
              ["white", t("white")],
            ]}
            onChange={(value) => setTheme(value as ThemeId)}
            label="Theme"
          />
          {isPending ? (
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : user && !user.isDevFallback ? (
            <UserButton />
          ) : !user ? (
            <Link
              to="/login"
              className="inline-flex h-11 items-center rounded-md border border-border px-3 text-sm hover:bg-accent"
            >
              {t("signIn")}
            </Link>
          ) : null}
        </div>
        <SuiteMenu active="pear" />
      </div>
    </header>
  );
}

function Seg({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div className="flex overflow-hidden rounded-md border border-border" aria-label={label}>
      {options.map(([id, text]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "h-11 min-w-11 px-3 text-sm",
            value === id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent",
          )}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
