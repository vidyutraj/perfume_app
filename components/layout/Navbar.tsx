"use client"

import { Menu, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./Sidebar"
import Link from "next/link"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
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
          
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Perfume Locker
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Placeholder for user avatar/profile menu */}
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-background" />
        </div>
      </div>
    </header>
  )
}

