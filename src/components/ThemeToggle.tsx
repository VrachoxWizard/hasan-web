"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useIsHydrated } from "@/lib/useIsHydrated";

export default function ThemeToggle() {
  const t = useTranslations("common.theme");
  const { setTheme, resolvedTheme } = useTheme();
  const isHydrated = useIsHydrated();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Prevent hydration mismatch - show placeholder until next-themes resolves
  if (!isHydrated || !resolvedTheme) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-foreground/60 dark:text-white/80 min-w-[40px] min-h-[40px] rounded-xl"
        aria-label={t("loading")}
      >
        <Sun className="w-5 h-5 transition-transform" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="cursor-pointer text-foreground/60 hover:text-foreground hover:bg-accent/10 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10 min-w-[40px] min-h-[40px] rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={isDark ? t("lightMode") : t("darkMode")}
    >
      {isDark ? (
        <Sun className="w-5 h-5 transition-transform" />
      ) : (
        <Moon className="w-5 h-5 transition-transform" />
      )}
    </Button>
  );
}
