"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./Sidebar"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0" showClose={false}>
              <Sidebar isMobile />
            </SheetContent>
          </Sheet>
          
          <h1 className="text-xl font-semibold">Perfume Locker</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Placeholder for user avatar/profile menu */}
          <div className="h-8 w-8 rounded-full bg-muted" />
        </div>
      </div>
    </header>
  )
}

