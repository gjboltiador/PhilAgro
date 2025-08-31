"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"
import { DollarSign } from "lucide-react"
import { useCallback } from "react"

export default function LandingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()

  const [dbStatus, setDbStatus] = useState<null | { ok: boolean; message: string }>(null)

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleTestDb = useCallback(async () => {
    setDbStatus(null)
    try {
      const res = await fetch("/api/test-db", { method: "POST" })
      const data = await res.json()
      if (res.ok && data?.ok) {
        setDbStatus({ ok: true, message: "Database connection successful" })
      } else {
        setDbStatus({ ok: false, message: data?.error || "Connection failed" })
      }
    } catch (err: any) {
      setDbStatus({ ok: false, message: err?.message || "Connection failed" })
    }
  }, [])

  // Landing kept minimal: Hero, Services, Prices, Contact, Footer

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />

      {/* Utilities */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 flex items-center gap-3">
          <Button variant="outline" onClick={handleTestDb}>Test DB</Button>
          {dbStatus && (
            <span className={"text-sm " + (dbStatus.ok ? "text-green-700" : "text-red-700")}>{dbStatus.message}</span>
          )}
        </div>
      </section>

      {/* Removed About for simpler landing */}

      {/* Services */}
      <ServicesSection />

      {/* Pests moved to dedicated page for simplicity */}

      {/* Prices (Compact) */}
      <section id="prices" className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-farm-green-900">Market Prices</h2>
            <Link href="/prices" className="text-xs text-farm-green-700 underline">Detailed prices</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm text-farm-green-900">Raw Sugar (Weekly)</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-farm-green-800 space-y-2">
                <div className="flex items-center justify-between"><span>URSUMCO</span><span>₱2,850</span></div>
                <div className="flex items-center justify-between"><span>SONEDCO</span><span>₱2,820</span></div>
                <div className="flex items-center justify-between"><span>TOLONG</span><span>₱2,800</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm text-farm-green-900">Molasses (Weekly)</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-farm-green-800 space-y-2">
                <div className="flex items-center justify-between"><span>URSUMCO</span><span>₱1,150</span></div>
                <div className="flex items-center justify-between"><span>SONEDCO</span><span>₱1,120</span></div>
                <div className="flex items-center justify-between"><span>TOLONG</span><span>₱1,100</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Weather moved to dedicated page for simplicity */}

      {/* Varieties moved to dedicated page for simplicity */}

      {/* CTA trimmed for minimal layout */}

      <Footer />

      {/* Contact */}
      <section id="contact" className="border-t bg-gradient-to-b from-white to-farm-green-50">
        <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-farm-green-900">Contact Us</CardTitle>
              <CardDescription>Reach out for membership and assistance queries</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <Label htmlFor="cname">Name</Label>
                <Input id="cname" placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="cemail">Email</Label>
                <Input id="cemail" type="email" placeholder="you@example.com" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="cmsg">Message</Label>
                <Input id="cmsg" placeholder="How can we help?" />
              </div>
              <div className="md:col-span-2">
                <Button className="bg-farm-green-600 hover:bg-farm-green-700">Send</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-farm-green-900">Association Office</CardTitle>
              <CardDescription>Contact details</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-farm-green-800 space-y-2">
              <div>Address: 123 Sugar Road, Negros</div>
              <div>Phone: +63 (000) 000 0000</div>
              <div>Email: info@philagro.org</div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
