"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Plus, 
  LogOut, 
  GripVertical, 
  Edit3, 
  Star, 
  Package,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2
} from "lucide-react";

type VehicleListItem = {
  id: string;
  naziv: string;
  marka: string;
  model: string;
  godina: number;
  cijena: number;
  ekskluzivno: boolean;
  ekskluzivnoOrder: number | null;
};

type VehiclesResponse = {
  ekskluzivna: VehicleListItem[];
  ostala: VehicleListItem[];
};

type DragPayload = {
  id: string;
  from: "general" | "exclusive";
};

function formatTitle(v: VehicleListItem) {
  return v.naziv || `${v.marka} ${v.model}`;
}

export default function CmsDashboardClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [general, setGeneral] = useState<VehicleListItem[]>([]);
  const [exclusive, setExclusive] = useState<VehicleListItem[]>([]);

  const exclusiveIds = useMemo(() => exclusive.map((v) => v.id), [exclusive]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cms/vehicles", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || data?.error || "Ne mogu učitati vozila");
      }
      const data = (await res.json()) as VehiclesResponse;
      setGeneral(data.ostala);
      setExclusive(data.ekskluzivna);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Greška");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function logout() {
    await fetch("/api/cms/logout", { method: "POST" }).catch(() => null);
    window.location.href = "/cms/login";
  }

  async function deleteVehicle(id: string, title: string) {
    const confirmed = window.confirm(
      `Jeste li sigurni da želite izbrisati vozilo "${title}"?\n\nOva radnja se ne može poništiti.`
    );
    
    if (!confirmed) return;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/cms/vehicles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Ne mogu izbrisati vozilo");
      
      // Remove from state
      setGeneral(general.filter((v) => v.id !== id));
      setExclusive(exclusive.filter((v) => v.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška");
    } finally {
      setSaving(false);
    }
  }

  function setDragData(e: React.DragEvent, payload: DragPayload) {
    e.dataTransfer.effectAllowed = "move";
    const raw = JSON.stringify(payload);
    e.dataTransfer.setData("application/json", raw);
    e.dataTransfer.setData("text/plain", raw);
    e.dataTransfer.setData("text", raw);
  }

  function getDragData(e: React.DragEvent): DragPayload | null {
    const raw =
      e.dataTransfer.getData("application/json") ||
      e.dataTransfer.getData("text/plain") ||
      e.dataTransfer.getData("text");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as DragPayload;
      if (
        !parsed?.id ||
        (parsed.from !== "general" && parsed.from !== "exclusive")
      )
        return null;
      return parsed;
    } catch {
      return null;
    }
  }

  async function ensureExclusive(id: string) {
    const res = await fetch(`/api/cms/vehicles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ekskluzivno: true }),
    });
    if (!res.ok) throw new Error("Ne mogu označiti kao ekskluzivno");
  }

  async function saveExclusiveOrder(nextExclusiveIds: string[]) {
    const res = await fetch("/api/cms/exclusive-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exclusiveIdsInOrder: nextExclusiveIds }),
    });
    if (!res.ok) throw new Error("Ne mogu spremiti redoslijed");
  }

  async function ensureNotExclusive(id: string) {
    const res = await fetch(`/api/cms/vehicles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ekskluzivno: false }),
    });
    if (!res.ok) throw new Error("Ne mogu ukloniti iz ekskluzivnih");
  }

  function allowDrop(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  async function onDropToExclusive(
    insertIndex: number | null,
    e: React.DragEvent
  ) {
    e.preventDefault();
    e.stopPropagation();
    const payload = getDragData(e);
    if (!payload) return;

    if (payload.from === "general") {
      const dragged = general.find((v) => v.id === payload.id);
      if (!dragged) return;

      const nextExclusive = [...exclusive];
      const idx = insertIndex ?? nextExclusive.length;
      nextExclusive.splice(idx, 0, { ...dragged, ekskluzivno: true });

      setSaving(true);
      setError(null);
      try {
        await ensureExclusive(payload.id);
        await saveExclusiveOrder(nextExclusive.map((v) => v.id));
        setExclusive(nextExclusive);
        setGeneral(general.filter((v) => v.id !== payload.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška");
        await load();
      } finally {
        setSaving(false);
      }
      return;
    }

    if (payload.from === "exclusive") {
      const currentIndex = exclusive.findIndex((v) => v.id === payload.id);
      if (currentIndex === -1) return;

      const next = [...exclusive];
      const [moved] = next.splice(currentIndex, 1);
      const idx = insertIndex ?? next.length;
      next.splice(idx, 0, moved);

      setSaving(true);
      setError(null);
      try {
        await saveExclusiveOrder(next.map((v) => v.id));
        setExclusive(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška");
        await load();
      } finally {
        setSaving(false);
      }
    }
  }

  async function onDropToGeneral(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const payload = getDragData(e);
    if (!payload) return;

    if (payload.from !== "exclusive") return;

    const dragged = exclusive.find((v) => v.id === payload.id);
    if (!dragged) return;

    const nextExclusive = exclusive.filter((v) => v.id !== payload.id);

    setSaving(true);
    setError(null);
    try {
      await ensureNotExclusive(payload.id);
      await saveExclusiveOrder(nextExclusive.map((v) => v.id));
      setExclusive(nextExclusive);
      setGeneral([{ ...dragged, ekskluzivno: false }, ...general]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška");
      await load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/25">
              <Package className="w-5 h-5 text-white" />
            </div>
            CMS Dashboard
          </h1>
          <p className="text-muted-foreground">
            Upravljajte vozilima drag & drop funkcijom • Presložite redoslijed lako i brzo
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/cms/vozila/novo">
            <Button className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent/80 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj vozilo
            </Button>
          </a>
          <Button variant="outline" onClick={logout} className="border-border/50">
            <LogOut className="w-4 h-4 mr-2" />
            Odjava
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-destructive">Greška</p>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
          <Loader2 className="w-5 h-5 text-accent animate-spin" />
          <p className="text-sm text-accent font-medium">Učitavanje vozila...</p>
        </div>
      )}
      
      {saving && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
          <Loader2 className="w-5 h-5 text-accent animate-spin" />
          <p className="text-sm text-accent font-medium">Spremanje promjena...</p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Regular Vehicles Card */}
        <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="h-1 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted rounded-t-lg" />
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">Vozila</CardTitle>
                <CardDescription>
                  Povucite vozilo u "Ekskluzivna vozila" za prikaz na početnoj
                </CardDescription>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">
                {general.length}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="space-y-2 min-h-[300px] rounded-xl border-2 border-dashed border-border/50 bg-muted/20 p-3 transition-colors hover:border-border hover:bg-muted/30"
              onDragEnterCapture={allowDrop}
              onDragOverCapture={allowDrop}
              onDropCapture={(e) => {
                if (e.target !== e.currentTarget) return;
                void onDropToGeneral(e);
              }}
            >
              {general.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[280px] text-center">
                  <Package className="w-12 h-12 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground font-medium">
                    Nema vozila
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Sva vozila su možda u ekskluzivnim
                  </p>
                </div>
              ) : null}
              {general.map((v) => (
                <div
                  key={v.id}
                  draggable
                  onDragStartCapture={(e) =>
                    setDragData(e, { id: v.id, from: "general" })
                  }
                  className="group flex items-center gap-3 rounded-lg border border-border/50 p-3 bg-card hover:bg-accent/5 hover:border-accent/30 select-none cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md"
                >
                  <GripVertical className="w-5 h-5 text-muted-foreground/50 group-hover:text-accent transition-colors flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-sm group-hover:text-accent transition-colors">
                      {formatTitle(v)}
                    </div>
                    <div className="text-xs text-muted-foreground truncate flex items-center gap-2">
                      <span>{v.godina}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="font-medium">{v.cijena.toLocaleString("hr-HR")} €</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a
                      href={`/cms/vozila/${v.id}`}
                      draggable={false}
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        draggable={false}
                        className="border-border/50 hover:border-accent/50 hover:text-accent hover:bg-accent/5"
                      >
                        <Edit3 className="w-3 h-3 mr-1.5" />
                        Uredi
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteVehicle(v.id, formatTitle(v))}
                      draggable={false}
                      className="border-border/50 hover:border-destructive/50 hover:text-destructive hover:bg-destructive/5"
                    >
                      <Trash2 className="w-3 h-3 mr-1.5" />
                      Izbriši
                    </Button>
                  </div>
                </div>
              ))}

              {/* Drop pad for empty space */}
              {general.length > 0 && (
                <div
                  className="h-20 rounded-lg border-2 border-dashed border-transparent hover:border-border/50 transition-colors"
                  onDragEnterCapture={allowDrop}
                  onDragOverCapture={allowDrop}
                  onDrop={(e) => void onDropToGeneral(e)}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exclusive Vehicles Card */}
        <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 rounded-t-lg" />
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  Ekskluzivna vozila
                  <Star className="w-4 h-4 text-accent fill-accent" />
                </CardTitle>
                <CardDescription>
                  Povucite vozilo ovdje • Preslagujte redoslijed kako želite
                </CardDescription>
              </div>
              <div className="text-2xl font-bold text-accent">
                {exclusive.length}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="space-y-2 min-h-[300px] rounded-xl border-2 border-dashed border-accent/30 bg-accent/5 p-3 transition-colors hover:border-accent/50 hover:bg-accent/10"
              onDragEnterCapture={allowDrop}
              onDragOverCapture={allowDrop}
              onDropCapture={(e) => {
                if (e.target !== e.currentTarget) return;
                void onDropToExclusive(null, e);
              }}
            >
              {exclusive.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[280px] text-center">
                  <Star className="w-12 h-12 text-accent/30 mb-3" />
                  <p className="text-sm text-accent font-medium">
                    Nema ekskluzivnih vozila
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Povucite vozilo ovdje za prikaz na početnoj stranici
                  </p>
                </div>
              ) : null}

              {exclusive.map((v, index) => (
                <div
                  key={v.id}
                  draggable
                  onDragStartCapture={(e) =>
                    setDragData(e, { id: v.id, from: "exclusive" })
                  }
                  onDragEnterCapture={allowDrop}
                  onDragOverCapture={allowDrop}
                  onDrop={(e) => void onDropToExclusive(index, e)}
                  className="group flex items-center gap-3 rounded-lg border border-accent/30 p-3 bg-card hover:bg-accent/10 hover:border-accent/50 select-none cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md"
                >
                  <GripVertical className="w-5 h-5 text-accent/50 group-hover:text-accent transition-colors flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-sm group-hover:text-accent transition-colors">
                      {formatTitle(v)}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                        <Star className="w-3 h-3 fill-accent" />
                        #{index + 1}
                      </span>
                      <span className="text-muted-foreground">{v.godina}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="text-muted-foreground font-medium">{v.cijena.toLocaleString("hr-HR")} €</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a
                      href={`/cms/vozila/${v.id}`}
                      draggable={false}
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        draggable={false}
                        className="border-accent/30 hover:border-accent hover:text-accent hover:bg-accent/10"
                      >
                        <Edit3 className="w-3 h-3 mr-1.5" />
                        Uredi
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteVehicle(v.id, formatTitle(v))}
                      draggable={false}
                      className="border-accent/30 hover:border-destructive hover:text-destructive hover:bg-destructive/5"
                    >
                      <Trash2 className="w-3 h-3 mr-1.5" />
                      Izbriši
                    </Button>
                  </div>
                </div>
              ))}

              {/* Drop pad for empty space */}
              {exclusive.length > 0 && (
                <div
                  className="h-20 rounded-lg border-2 border-dashed border-transparent hover:border-accent/30 transition-colors"
                  onDragEnterCapture={allowDrop}
                  onDragOverCapture={allowDrop}
                  onDrop={(e) => void onDropToExclusive(null, e)}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Text */}
      {exclusiveIds.length > 0 && (
        <div className="flex items-start gap-2 p-4 rounded-lg bg-accent/5 border border-accent/20">
          <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-accent">Savjet za upravljanje</p>
            <p className="text-sm text-muted-foreground">
              Možete preslagivati ekskluzivna vozila drag & drop funkcijom • Redoslijed određuje prikaz na početnoj stranici
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
