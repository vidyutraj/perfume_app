import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { LockerProvider } from "@/lib/contexts/LockerContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Perfume Locker",
  description: "Your personal fragrance portfolio and discovery tool",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LockerProvider>
          <Navbar />
          <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <Sidebar />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </LockerProvider>
      </body>
    </html>
  )
}

