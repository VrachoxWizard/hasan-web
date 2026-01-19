"use client";

import { useMemo } from "react";
import { Shield, FileCheck, Wrench, Clock, Award } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

interface TrustBadge {
  icon: React.ElementType;
  label: string;
  variant?: "default" | "secondary" | "outline";
}

interface TrustBadgesProps {
  size?: "sm" | "md";
}

export default function TrustBadges({ size = "sm" }: TrustBadgesProps) {
  const t = useTranslations("trust");

  const badges: TrustBadge[] = useMemo(
    () => [
      { icon: Shield, label: t("warranty"), variant: "default" as const },
      { icon: FileCheck, label: t("verified"), variant: "secondary" as const },
    ],
    [t]
  );

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <Badge
            key={badge.label}
            variant={badge.variant}
            className={`gap-1 ${
              size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"
            }`}
          >
            <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
            {badge.label}
          </Badge>
        );
      })}
    </div>
  );
}

// Detailed trust section for homepage or about page
export function TrustSection() {
  const t = useTranslations("trust");

  const trustPoints = useMemo(
    () => [
      {
        icon: Shield,
        title: t("quality.title"),
        description: t("quality.description"),
      },
      {
        icon: FileCheck,
        title: t("history.title"),
        description: t("history.description"),
      },
      {
        icon: Wrench,
        title: t("serviced.title"),
        description: t("serviced.description"),
      },
      {
        icon: Clock,
        title: t("exchange.title"),
        description: t("exchange.description"),
      },
      {
        icon: Award,
        title: t("experience.title"),
        description: t("experience.description"),
      },
    ],
    [t]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trustPoints.map((point) => {
        const Icon = point.icon;
        return (
          <div
            key={point.title}
            className="flex gap-4 p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow"
          >
            <div className="shrink-0 w-12 h-12 rounded-lg bg-accent/10 dark:bg-accent/20 flex items-center justify-center">
              <Icon className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                {point.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {point.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
