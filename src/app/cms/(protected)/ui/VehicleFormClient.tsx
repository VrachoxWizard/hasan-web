"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Car,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Info,
  Image as ImageIcon,
  FileText,
  Settings,
  Upload,
  X,
  CheckCircle2,
  Star,
  Sparkles,
} from "lucide-react";

type VehicleImage = { url: string; alt?: string };

type VehiclePayload = {
  naziv: string;
  marka: string;
  model: string;
  godina: number;
  cijena: number;
  staracijena: number | null;
  kilometraza: number;
  gorivo: "benzin" | "dizel" | "hibrid" | "elektricni";
  mjenjac: "rucni" | "automatski";
  snaga: number;
  boja: string;
  opis: string;
  karakteristike: string[];
  istaknuto: boolean;
  ekskluzivno: boolean;
  slike: VehicleImage[];
};

function emptyVehicle(): VehiclePayload {
  return {
    naziv: "",
    marka: "",
    model: "",
    godina: new Date().getFullYear(),
    cijena: 0,
    staracijena: null,
    kilometraza: 0,
    gorivo: "benzin",
    mjenjac: "rucni",
    snaga: 0,
    boja: "",
    opis: "",
    karakteristike: [],
    istaknuto: false,
    ekskluzivno: false,
    slike: [],
  };
}

export default function VehicleFormClient({
  mode,
  vehicleId,
}: {
  mode: "create" | "edit";
  vehicleId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [v, setV] = useState<VehiclePayload>(() => emptyVehicle());
  const [featuresText, setFeaturesText] = useState("");

  const title = useMemo(
    () => (mode === "edit" ? "Uredi vozilo" : "Novo vozilo"),
    [mode]
  );

  useEffect(() => {
    if (mode !== "edit" || !vehicleId) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/cms/vehicles/${vehicleId}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || data?.error || "Ne mogu učitati vozilo");
        }
        const data = await res.json();
        const vehicle = data.vehicle;
        setV({
          naziv: vehicle.naziv ?? "",
          marka: vehicle.marka,
          model: vehicle.model,
          godina: vehicle.godina,
          cijena: vehicle.cijena,
          staracijena: vehicle.staracijena ?? null,
          kilometraza: vehicle.kilometraza,
          gorivo: vehicle.gorivo,
          mjenjac: vehicle.mjenjac,
          snaga: vehicle.snaga,
          boja: vehicle.boja,
          opis: vehicle.opis ?? "",
          karakteristike: (vehicle.karakteristike ?? []) as string[],
          istaknuto: !!vehicle.istaknuto,
          ekskluzivno: !!vehicle.ekskluzivno,
          slike: (vehicle.images ?? []).map((img: any) => ({
            url: img.url,
            alt: img.alt ?? undefined,
          })),
        });
        setFeaturesText(
          ((vehicle.karakteristike ?? []) as string[]).join("\n")
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Greška");
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, vehicleId]);

  function setField<K extends keyof VehiclePayload>(
    key: K,
    value: VehiclePayload[K]
  ) {
    setV((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const form = new FormData();
    for (const file of Array.from(files)) form.append("files", file);

    const res = await fetch("/api/cms/upload", { method: "POST", body: form });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error || "Upload nije uspio");
    }

    const data = await res.json();
    const urls = (data.urls ?? []) as string[];
    setField("slike", v.slike.concat(urls.map((url) => ({ url }))));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: VehiclePayload = {
      ...v,
      karakteristike: featuresText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url =
        mode === "edit"
          ? `/api/cms/vehicles/${vehicleId}`
          : "/api/cms/vehicles";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Spremanje nije uspjelo");
        return;
      }

      router.push("/cms");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Greška");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/25">
              <Car className="w-5 h-5 text-white" />
            </div>
            {title}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info className="w-4 h-4" />
            <p className="text-sm">
              Popunite sve potrebne podatke • Sva polja su na hrvatskom
            </p>
          </div>
        </div>
        <a href="/cms">
          <Button variant="outline" className="border-border/50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Natrag na dashboard
          </Button>
        </a>
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

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6" suppressHydrationWarning>
        {/* Basic Info Card */}
        <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 rounded-t-lg" />
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Car className="w-5 h-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-xl">Osnovni podaci</CardTitle>
                <CardDescription>Naziv, marka, model i cijene vozila</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <span>Naziv vozila</span>
                <span className="text-xs text-muted-foreground">(prikazuje se na kartici)</span>
              </label>
              <Input
                value={v.naziv}
                onChange={(e) => setField("naziv", e.target.value)}
                placeholder="npr. Audi Q5 2.0 TDI Quattro S-line"
                className="h-11 border-border/50 focus-visible:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Marka</label>
              <Input
                value={v.marka}
                onChange={(e) => setField("marka", e.target.value)}
                placeholder="npr. Audi"
                className="h-11 border-border/50 focus-visible:ring-accent"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <Input
                value={v.model}
                onChange={(e) => setField("model", e.target.value)}
                placeholder="npr. Q5"
                className="h-11 border-border/50 focus-visible:ring-accent"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Godina proizvodnje</label>
              <Input
                type="number"
                value={v.godina}
                onChange={(e) => setField("godina", Number(e.target.value))}
                min="1900"
                max={new Date().getFullYear() + 1}
                className="h-11 border-border/50 focus-visible:ring-accent"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cijena (€)</label>
              <Input
                type="number"
                value={v.cijena}
                onChange={(e) => setField("cijena", Number(e.target.value))}
                min="0"
                placeholder="19990"
                className="h-11 border-border/50 focus-visible:ring-accent"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <span>Stara cijena (€)</span>
                <span className="text-xs text-muted-foreground">(opciono - za prikaz popusta)</span>
              </label>
              <Input
                type="number"
                value={v.staracijena ?? ""}
                onChange={(e) =>
                  setField(
                    "staracijena",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                min="0"
                placeholder="Ostavite prazno ako nema popusta"
                className="h-11 border-border/50 focus-visible:ring-accent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Specifications Card */}
        <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="h-1 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted rounded-t-lg" />
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">Tehničke specifikacije</CardTitle>
                <CardDescription>Kilometraža, snaga, gorivo i druge tehničke karakteristike</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kilometraža (km)</label>
              <Input
                type="number"
                value={v.kilometraza}
                onChange={(e) =>
                  setField("kilometraza", Number(e.target.value))
                }
                min="0"
                placeholder="85000"
                className="h-11 border-border/50 focus-visible:ring-accent"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Snaga (kW)</label>
              <Input
                type="number"
                value={v.snaga}
                onChange={(e) => setField("snaga", Number(e.target.value))}
                min="0"
                placeholder="140"
                className="h-11 border-border/50 focus-visible:ring-accent"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Boja</label>
              <Input
                value={v.boja}
                onChange={(e) => setField("boja", e.target.value)}
                placeholder="npr. Crna"
                className="h-11 border-border/50 focus-visible:ring-accent"
                required
              />
            </div>

            <div className="space-y-2" suppressHydrationWarning>
              <label className="text-sm font-medium">Gorivo</label>
              <Select
                value={v.gorivo}
                onValueChange={(val) => setField("gorivo", val as any)}
              >
                <SelectTrigger className="h-11 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="benzin">Benzin</SelectItem>
                  <SelectItem value="dizel">Dizel</SelectItem>
                  <SelectItem value="hibrid">Hibrid</SelectItem>
                  <SelectItem value="elektricni">Električni</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2" suppressHydrationWarning>
              <label className="text-sm font-medium">Mjenjač</label>
              <Select
                value={v.mjenjac}
                onValueChange={(val) => setField("mjenjac", val as any)}
              >
                <SelectTrigger className="h-11 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rucni">Ručni</SelectItem>
                  <SelectItem value="automatski">Automatski</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-sm font-medium">Posebne oznake</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={v.istaknuto}
                    onCheckedChange={(c) => setField("istaknuto", Boolean(c))}
                    className="border-border/50"
                  />
                  <Sparkles className="w-4 h-4 text-accent/70 group-hover:text-accent transition-colors" />
                  <span className="text-sm font-medium">Istaknuto vozilo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={v.ekskluzivno}
                    onCheckedChange={(c) => setField("ekskluzivno", Boolean(c))}
                    className="border-border/50"
                  />
                  <Star className="w-4 h-4 text-accent/70 group-hover:text-accent transition-colors" />
                  <span className="text-sm font-medium">Ekskluzivno</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description Card */}
        <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="h-1 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted rounded-t-lg" />
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">Opis i oprema</CardTitle>
                <CardDescription>Detaljan opis vozila i lista karakteristika/opreme</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <span>Opis vozila</span>
                <span className="text-xs text-muted-foreground">(prikazuje se na stranici vozila)</span>
              </label>
              <textarea
                value={v.opis}
                onChange={(e) => setField("opis", e.target.value)}
                placeholder="Unesite detaljan opis vozila, njegovo stanje, servisnu povijest..."
                className="min-h-32 w-full rounded-lg border border-border/50 bg-transparent px-4 py-3 text-sm shadow-sm outline-none focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/20 transition-all resize-y"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <span>Karakteristike i oprema</span>
                <span className="text-xs text-muted-foreground">(svaki red je jedna stavka)</span>
              </label>
              <textarea
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Klima uređaj&#10;Panorama krov&#10;Kožna sjedala&#10;Parking senzori&#10;..."
                className="min-h-40 w-full rounded-lg border border-border/50 bg-transparent px-4 py-3 text-sm shadow-sm outline-none focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/20 transition-all resize-y font-mono"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                Svaki red predstavlja jednu karakteristiku koja će biti prikazana s checkmarkom
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Images Card */}
        <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 rounded-t-lg" />
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">Slike vozila</CardTitle>
                <CardDescription>
                  Dodajte fotografije vozila • Preporučeno najmanje 5 slika
                </CardDescription>
              </div>
              {v.slike.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                  <ImageIcon className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-accent">{v.slike.length}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Section */}
            <div className="rounded-lg border-2 border-dashed border-border/50 bg-muted/20 p-6 hover:border-accent/30 hover:bg-accent/5 transition-colors">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Dodajte slike vozila</p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WebP ili AVIF • Maksimalno 10MB po slici
                  </p>
                </div>
                <Input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  onChange={(e) => {
                    void (async () => {
                      try {
                        await uploadFiles(e.target.files);
                        e.target.value = "";
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Greška");
                      }
                    })();
                  }}
                  className="max-w-xs"
                />
              </div>
            </div>

            {/* Images List */}
            {v.slike.length === 0 ? (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                <p className="text-sm text-amber-900 dark:text-amber-200 font-medium">
                  Potrebna je barem jedna slika vozila
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Dodane slike ({v.slike.length})
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {v.slike.map((img, idx) => (
                    <div
                      key={`${img.url}::${idx}`}
                      className="group flex items-center gap-3 rounded-lg border border-border/50 p-3 bg-card hover:bg-accent/5 hover:border-accent/30 transition-all"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-accent">#{idx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <a
                          href={img.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm truncate block hover:text-accent transition-colors"
                        >
                          {img.url.split('/').pop()}
                        </a>
                        <p className="text-xs text-muted-foreground">
                          {idx === 0 ? "Glavna slika" : "Dodatna slika"}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setField(
                            "slike",
                            v.slike.filter((_, i) => i !== idx)
                          )
                        }
                        className="border-border/50 hover:border-destructive/50 hover:text-destructive hover:bg-destructive/5"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center p-6 rounded-lg border border-border/50 bg-muted/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="w-4 h-4" />
            <span>Provjerite sve podatke prije spremanja</span>
          </div>
          <div className="flex gap-2">
            <a href="/cms">
              <Button type="button" variant="outline" className="border-border/50">
                Odustani
              </Button>
            </a>
            <Button 
              type="submit" 
              disabled={saving || loading || v.slike.length === 0}
              className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent/80 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Spremanje...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Spremi vozilo
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
