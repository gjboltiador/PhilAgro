"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Wheat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"

export function Header() {
  const [loginOpen, setLoginOpen] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams?.get("login") === "1") {
      setLoginOpen(true)
    }
  }, [searchParams])

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Wheat className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Sugar Farmers Association</h1>
              <p className="text-sm text-muted-foreground">Growing Together Since 1975</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#home" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="#about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="#services" className="text-foreground hover:text-primary transition-colors">
                Services
              </Link>
              <Link href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
            <Button onClick={() => setLoginOpen(true)} variant="default">
              Member Login
            </Button>
          </div>
        </div>
      </header>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  )
}


