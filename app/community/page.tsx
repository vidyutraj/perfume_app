export default function CommunityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Community</h1>
        <p className="text-muted-foreground mt-2">
          Explore public perfume lockers from other fragrance lovers.
        </p>
      </div>

      {/* Placeholder for community grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center"
          >
            <p className="text-sm text-muted-foreground">
              User locker {i}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

