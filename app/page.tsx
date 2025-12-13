import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center">
      <div className="space-y-4">
        <Package className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Perfume Locker</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Your personal fragrance portfolio and discovery tool
        </p>
      </div>
      
      <Link href="/locker">
        <Button size="lg" className="text-lg px-8">
          Enter Your Locker
        </Button>
      </Link>
    </div>
  )
}

