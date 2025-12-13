"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, BarChart3, Heart, Users, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface SidebarProps {
  isMobile?: boolean
}

const navigation = [
  {
    label: "Locker",
    route: "/",
    icon: Package,
  },
  {
    label: "Discover",
    route: "/discover",
    icon: Search,
  },
  {
    label: "Dashboard",
    route: "/dashboard",
    icon: BarChart3,
  },
  {
    label: "Wishlist",
    route: "/wishlist",
    icon: Heart,
  },
  {
    label: "Community",
    route: "/community",
    icon: Users,
  },
]

export function Sidebar({ isMobile = false }: SidebarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before using pathname
  useEffect(() => {
    setMounted(true)
  }, [])

  const content = (
    <nav className="flex flex-col space-y-1 p-4">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = mounted && pathname === item.route

        return (
          <Link
            key={item.route}
            href={item.route}
            prefetch={true}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer",
              isActive
                ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-foreground border-l-2 border-primary shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  if (isMobile) {
    return content
  }

  return (
    <aside className="hidden w-64 border-r bg-background/50 backdrop-blur-sm md:block">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {content}
      </div>
    </aside>
  )
}

