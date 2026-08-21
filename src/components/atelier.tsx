import { useEffect, useRef, useState, type ReactNode } from "react";
import { Download, ImageDown, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";
import { BomPanel } from "@/components/bom-panel";
import { ControlPanel } from "@/components/control-panel";
import { ColorStudio } from "@/components/color-studio";
import { GemPreview } from "@/components/gem-preview";
import { ManufacturingSheet } from "@/components/manufacturing-sheet";
import { NecklaceRing, StrandView } from "@/components/necklace-ring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  deletePattern,
  listPatterns,
  savePattern,
  type SavedPattern,
} from "@/lib/necklace/api";
import { exportHdJpg, exportJson } from "@/lib/necklace/export-jpg";
import { formatCarat } from "@/lib/necklace/engine";
import {
  deleteHistoryItem,
  loadHistory,
  loadLastConfig,
  newProjectId,
  persistLastConfig,
  saveHistoryItem,
  type LocalProject,
} from "@/lib/necklace/history";
import { useAtelier } from "@/lib/necklace/store";
import { useTheme } from "@/lib/theme";
import { useT } from "@/lib/locale";

export function Atelier() {
  const result = useAtelier((s) => s.result);
  const selectedIndex = useAtelier((s) => s.selectedIndex);
  const setSelected = useAtelier((s) => s.setSelected);
  const loadConfig = useAtelier((s) => s.loadConfig);
  const toConfig = useAtelier((s) => s.toConfig);
  const metalColor = useAtelier((s) => s.metalColor);
  const projectId = useAtelier((s) => s.projectId);
  const projectName = useAtelier((s) => s.projectName);
  const notes = useAtelier((s) => s.notes);
  const gemColors = useAtelier((s) => s.gemColors);
  const setProjectId = useAtelier((s) => s.setProjectId);
  const setProjectName = useAtelier((s) => s.setProjectName);
  const setNotes = useAtelier((s) => s.setNotes);
  const newProject = useAtelier((s) => s.newProject);
  const theme = useTheme((s) => s.theme);
  const t = useT();
  const { user, isPending } = useCurrentUserState();
  const [saves, setSaves] = useState<SavedPattern[]>([]);
  const [history, setHistory] = useState<LocalProject[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  const restored = useRef(false);

  useEffect(() => {
    setHistory(loadHistory());
    if (restored.current) return;
    restored.current = true;
    const last = loadLastConfig();
    if (last?.metal) loadConfig(last);
    else setProjectId(newProjectId());
  }, [loadConfig, setProjectId]);

  useEffect(() => {
    const unsub = useAtelier.subscribe((s) => {
      persistLastConfig(s.toConfig());
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (isPending || !user || user.isDevFallback) {
      setSaves([]);
      return;
    }
    void listPatterns()
      .then(setSaves)
      .catch(() => setSaves([]));
  }, [user, isPending]);

  const onSaveLocal = () => {
    const id = projectId.trim() || newProjectId();
    if (!projectId.trim()) setProjectId(id);
    const name =
      projectName.trim() ||
      `${result.lengthIn}″ ${result.metal} ${result.totalPcs}pcs`;
    const item: LocalProject = {
      id,
      name,
      notes,
      created: new Date().toISOString(),
      config: { ...toConfig(), projectId: id, projectName: name },
    };
    setHistory(saveHistoryItem(item));
    toast.success("Saved to history");
  };

  const onSaveCloud = async () => {
    if (!user || user.isDevFallback) {
      toast.message("Account sync is not configured; the local save is active.");
      return;
    }
    onSaveLocal();
    const name =
      projectName.trim() ||
      `${result.lengthIn}″ ${result.metal} ${result.totalPcs}pcs`;
    try {
      await savePattern({ data: { name, config: toConfig() } });
      const next = await listPatterns();
      setSaves(next);
      toast.success("Saved to account");
    } catch {
      toast.error("Sign in to sync to your account");
    }
  };

  const onDeleteCloud = async (id: string) => {
    try {
      await deletePattern({ data: id });
      setSaves((s) => s.filter((p) => p.id !== id));
    } catch {
      toast.error("Could not delete");
    }
  };

  const onExportJpg = async () => {
    const svg = document.getElementById("necklace-svg") as SVGSVGElement | null;
    if (!svg) {
      toast.error("Pear rivière preview not ready");
      return;
    }
    try {
      toast.message("Rendering HD JPG…");
      await exportHdJpg({
        svg,
        result,
        projectId,
        projectName,
        notes,
        theme,
      });
      toast.success("JPG exported");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    }
  };

  const onExportJson = () => {
    exportJson({
      config: toConfig(),
      result,
      projectId,
      projectName,
      notes,
    });
    toast.success("JSON exported");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <AppHeader />
      <main className="mx-auto grid min-w-0 max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <aside className="no-print order-2 min-w-0 rounded-2xl border border-border bg-card p-4 lg:order-1 lg:p-5">
          <h1 className="font-display mb-4 text-2xl leading-tight tracking-normal normal-case">
            Pear rivière
          </h1>

          <div className="mb-5 space-y-3 border-b border-border pb-5">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              {t("project")}
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="project-id">Project ID</Label>
              <Input
                id="project-id"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="PR-…"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="project-name">Name / code</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="RN7 / client code"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="project-notes">Notes</Label>
              <Textarea
                id="project-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Client, metal, special notes…"
                className="min-h-20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={onSaveLocal}>
                <Save /> {t("save")}
              </Button>
              {user && !user.isDevFallback ? (
                <Button size="sm" variant="secondary" onClick={() => void onSaveCloud()}>
                  Account
                </Button>
              ) : null}
              <Button size="sm" variant="ghost" onClick={newProject}>
                {t("newId")}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => void onExportJpg()}>
                <ImageDown /> {t("hdJpg")}
              </Button>
              <Button size="sm" variant="secondary" onClick={onExportJson}>
                <Download /> {t("json")}
              </Button>
            </div>
          </div>

          <ControlPanel />
          <ColorStudio />

          <details className="mt-6 space-y-2 border-t border-border pt-4">
            <summary className="cursor-pointer text-xs tracking-wide text-muted-foreground uppercase">
              {t("history")}
            </summary>
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No saved projects yet. Save keeps the last 30 on this device.
              </p>
            ) : (
              <ul className="max-h-48 space-y-1 overflow-y-auto">
                {history.map((h) => (
                  <li
                    key={h.id}
                    className="flex items-center gap-2 rounded-lg px-1 py-1 text-sm hover:bg-accent"
                  >
                    <button
                      type="button"
                      className="min-w-0 flex-1 truncate text-left"
                      onClick={() => loadConfig(h.config)}
                    >
                      <span className="block truncate">{h.name || h.id}</span>
                      <span className="block text-[11px] text-muted-foreground">
                        {h.config.lengthIn}″ · {h.config.metal} · {h.id}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Delete from history"
                      onClick={() => setHistory(deleteHistoryItem(h.id))}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {user && !user.isDevFallback && saves.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {saves.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-2 rounded-lg px-1 py-1 text-sm hover:bg-accent"
                  >
                    <button
                      type="button"
                      className="min-w-0 flex-1 truncate text-left"
                      onClick={() => loadConfig(p.config)}
                    >
                      {p.name}
                    </button>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => void onDeleteCloud(p.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </details>
        </aside>

        <section className="order-1 min-w-0 space-y-4 lg:order-2">
          <div
            ref={previewRef}
            className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-velvet"
          >
            <NecklaceRing
              result={result}
              selectedIndex={selectedIndex}
              onSelect={setSelected}
              metalColor={metalColor}
              gemColors={gemColors}
            />
            <GemPreview
              result={result}
              selectedIndex={selectedIndex}
              metalColor={metalColor}
              gemColors={gemColors}
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs tabular-nums text-muted-foreground">
            <Chip>{result.totalPcs} pcs</Chip>
            <Chip>{formatCarat(result.totalCarat)} ct</Chip>
            <Chip>
              leftover {result.leftoverMm > 0 ? "+" : ""}
              {result.leftoverMm.toFixed(1)} mm
            </Chip>
          </div>

          <StrandView
            result={result}
            selectedIndex={selectedIndex}
            onSelect={setSelected}
            metalColor={metalColor}
            gemColors={gemColors}
          />

          <BomPanel />
          <ManufacturingSheet result={result} />
        </section>
      </main>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-card px-3 py-1">
      {children}
    </span>
  );
}
