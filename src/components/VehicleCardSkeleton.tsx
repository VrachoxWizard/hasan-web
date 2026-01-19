import { Card, CardContent } from "@/components/ui/card";
import { spacing, components } from "@/lib/designTokens";

interface VehicleCardSkeletonProps {
  variant?: "grid" | "list";
}

export default function VehicleCardSkeleton({
  variant = "grid",
}: VehicleCardSkeletonProps) {
  if (variant === "list") {
    return (
      <Card className={`${components.card.elevated} overflow-hidden`}>
        <div className="flex flex-col sm:flex-row">
          {/* Image skeleton */}
          <div className="relative w-full sm:w-64 md:w-80 shrink-0 aspect-[16/10] sm:aspect-auto sm:h-48 bg-muted animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
          </div>

          {/* Content skeleton */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Title skeleton */}
                <div className="h-6 bg-muted rounded animate-pulse mb-2 w-3/4" />
                {/* Price skeleton */}
                <div className="h-7 bg-muted rounded animate-pulse w-32" />
              </div>
              {/* Buttons skeleton */}
              <div className="flex gap-2">
                <div className="w-11 h-11 bg-muted rounded animate-pulse" />
                <div className="w-11 h-11 bg-muted rounded animate-pulse" />
              </div>
            </div>

            {/* Specs skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-16" />
                </div>
              ))}
            </div>

            {/* Description & CTA skeleton */}
            <div className="mt-auto pt-4 flex items-end justify-between gap-4">
              <div className="hidden md:block flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-full" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              </div>
              <div className="h-9 bg-muted rounded animate-pulse w-24" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`${components.card.default} overflow-hidden h-full rounded-3xl border border-border/60 bg-card/95`}
    >
      {/* Image skeleton */}
      <div className="relative aspect-[4/3] bg-muted animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
      </div>

      <CardContent className={spacing.card.medium}>
        {/* Title skeleton */}
        <div className="h-6 bg-muted rounded animate-pulse mb-2 w-3/4" />

        {/* Badge/Status skeleton */}
        <div className="h-5 bg-muted rounded animate-pulse mb-3 w-24" />

        {/* Specs skeleton */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-32" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-28" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-36" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-muted my-4" />

        {/* Price skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 bg-muted rounded animate-pulse w-32" />
        </div>

        {/* Buttons skeleton */}
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
