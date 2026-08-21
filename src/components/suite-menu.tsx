import { Gem, Layers3 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SuiteTool = "necklace" | "bracelet" | "pear";

const TOOLS = [
  {
    id: "necklace" as const,
    label: "Round necklace",
    href: "https://hanzutech.com/opentools/tennis-necklace-generator/",
  },
  {
    id: "bracelet" as const,
    label: "Round bracelet",
    href: "https://hanzutech.com/opentools/round-diamond-bracelet-generator/",
  },
  {
    id: "pear" as const,
    label: "Pear rivière",
    href: "https://hanzutech.com/opentools/pear-riviere-generator/",
  },
];

export function SuiteMenu({ active }: { active: SuiteTool }) {
  return (
    <nav className="suite-menu" aria-label="Rivière pattern suite">
      <a
        href="https://hanzutech.com/opentools/riviere-pattern-suite/"
        target="_top"
        className="suite-home"
      >
        <Layers3 className="size-3.5" />
        Pattern suite
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
            {tool.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
