import { Gem, Layers3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT, type Msg } from "@/lib/locale";

export type SuiteTool = "necklace" | "bracelet" | "pear";

const TOOLS: { id: SuiteTool; label: Msg; href: string }[] = [
  {
    id: "necklace",
    label: "roundTool",
    href: "https://hanzutech.com/opentools/tennis-necklace-generator/",
  },
  {
    id: "bracelet",
    label: "braceletTool",
    href: "https://hanzutech.com/opentools/round-diamond-bracelet-generator/",
  },
  {
    id: "pear",
    label: "pearTool",
    href: "https://hanzutech.com/opentools/pear-riviere-generator/",
  },
];

export function SuiteMenu({ active }: { active: SuiteTool }) {
  const t = useT();
  return (
    <nav className="suite-menu" aria-label={t("suite")}>
      <a
        href="https://hanzutech.com/opentools/riviere-pattern-suite/"
        target="_top"
        className="suite-home"
      >
        <Layers3 className="size-3.5" />
        {t("suiteHome")}
      </a>
      <div className="suite-tools">
        {TOOLS.map((tool) => (
          <a
            key={tool.id}
            href={tool.href}
            target="_top"
            aria-current={active === tool.id ? "page" : undefined}
            className={cn("suite-tool", active === tool.id && "is-active")}
          >
            <Gem className="size-3" />
            {t(tool.label)}
          </a>
        ))}
      </div>
    </nav>
  );
}
