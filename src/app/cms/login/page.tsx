"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, User, AlertCircle, Car } from "lucide-react";

export default function CmsLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/cms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Neuspješna prijava");
        return;
      }

      router.push("/cms");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-gradient-to-br from-accent/5 via-background to-primary/5">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-4 shadow-lg shadow-accent/25">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Produkt Auto</h1>
          <p className="text-sm text-muted-foreground">Content Management System</p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/95 animate-in fade-in zoom-in-95 duration-500">
          <div className="h-1.5 bg-gradient-to-r from-accent/50 via-accent to-accent/50 rounded-t-lg" />
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold">Dobrodošli natrag</CardTitle>
            <CardDescription className="text-base">Prijavite se za pristup CMS platformi</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Korisničko ime
                </label>
                <div className="relative">
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    className="pl-10 h-11 border-border/50 focus-visible:ring-accent transition-all"
                    placeholder="admin"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Lozinka
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="pl-10 h-11 border-border/50 focus-visible:ring-accent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Error Message */}
              {error ? (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-300">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              ) : null}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent/80 text-white font-semibold shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300" 
                disabled={loading || !username || !password}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Prijava u tijeku...
                  </>
                ) : (
                  "Prijavi se"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground mt-6 animate-in fade-in duration-1000">
          Zaštićeni pristup • Samo za ovlaštene korisnike
        </p>
      </div>
    </div>
  );
}
