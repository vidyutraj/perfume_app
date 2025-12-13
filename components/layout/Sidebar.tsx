"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, BarChart3, Heart, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isMobile?: boolean
}

const navigation = [
  {
    label: "Locker",
    route: "/locker",
    icon: Package,
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

  const content = (
    <nav className="flex flex-col space-y-1 p-4">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.route

        return (
          <Link
            key={item.route}
            href={item.route}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-muted text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
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
    <aside className="hidden w-64 border-r bg-background md:block">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {content}
      </div>
    </aside>
  )
}

