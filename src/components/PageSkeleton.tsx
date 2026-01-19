import { Card, CardContent } from "@/components/ui/card";
import { spacing } from "@/lib/designTokens";

export default function PageSkeleton() {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-muted animate-pulse rounded-md w-1/3 mb-4"></div>
          <div className="h-4 bg-muted animate-pulse rounded-md w-1/2"></div>
        </div>

        {/* Grid Skeleton */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${spacing.gap.default}`}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-48 bg-muted animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-muted animate-pulse rounded-md w-3/4"></div>
                  <div className="h-4 bg-muted animate-pulse rounded-md w-full"></div>
                  <div className="h-4 bg-muted animate-pulse rounded-md w-5/6"></div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-10 bg-muted animate-pulse rounded-md flex-1"></div>
                    <div className="h-10 bg-muted animate-pulse rounded-md flex-1"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
