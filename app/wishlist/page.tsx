export default function WishlistPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Wishlist</h1>
        <p className="text-muted-foreground mt-2">
          Perfumes you're interested in trying or buying.
        </p>
      </div>

      {/* Placeholder for wishlist items */}
      <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center">
        <p className="text-muted-foreground">
          Your wishlist items will appear here
        </p>
      </div>
    </div>
  )
}

