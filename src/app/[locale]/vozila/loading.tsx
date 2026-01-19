export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="bg-primary py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="h-10 w-64 bg-white/20 rounded-lg animate-pulse mb-4" />
          <div className="h-6 w-96 bg-white/10 rounded animate-pulse" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl overflow-hidden border border-border animate-pulse"
            >
              <div className="aspect-[4/3] bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-6 w-3/4 bg-muted rounded" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
