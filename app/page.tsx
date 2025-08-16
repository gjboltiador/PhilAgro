"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import {
  Wheat,
  Sprout,
  Tractor,
  BarChart3,
  Leaf,
  Droplets,
  Sun,
  CloudRain,
  Shield,
  CheckCircle,
  ArrowRight,
  Bug,
  AlertTriangle,
  DollarSign,
  Cloud,
  BookOpen
} from "lucide-react"

const roleOptions = [
  { id: "admin", label: "Administrator" },
  { id: "manager", label: "Manager" },
  { id: "operator", label: "Operator" },
  { id: "planner", label: "Planner" },
  { id: "analyst", label: "Analyst" },
  { id: "viewer", label: "Viewer" },
]

export default function LandingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated } = useAuth()

  const [loginOpen, setLoginOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "", role: "" })

  useEffect(() => {
    if (searchParams?.get("login") === "1") {
      setLoginOpen(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password || !formData.role) return
    setIsLoading(true)
    try {
      await login(formData.email, formData.password, formData.role)
      router.replace("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const features = useMemo(() => [
    { icon: Tractor, title: "Field Operations", desc: "Plan and coordinate land preparation, planting, and harvesting." },
    { icon: Sprout, title: "Farm Assistance", desc: "Fertilizer programs, herbicides catalog, and distribution tracking." },
    { icon: BarChart3, title: "Production Reports", desc: "Sugar & molasses analytics, pesada data, and billing summaries." },
    { icon: Leaf, title: "Sustainable Practices", desc: "Standards and support for climate-resilient farming." },
    { icon: BookOpen, title: "Knowledge Base", desc: "Varieties, best practices, and agronomic guidance." },
    { icon: DollarSign, title: "Market Watch", desc: "Sugar and molasses price movements and advisories." },
  ], [])

  const stats = [
    { label: "Active Members", value: "1,250+" },
    { label: "Operational Mills", value: "5" },
    { label: "Annual Capacity", value: "> 40k tons" },
    { label: "Programs Delivered", value: "1,800+" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-farm-green-500 to-farm-green-600 flex items-center justify-center shadow">
              <Wheat className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-farm-green-900">Phil Agro Sugar Farmers Association</div>
              <div className="text-[11px] text-farm-green-600">Official Association Portal</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden md:block text-sm text-farm-green-700 hover:text-farm-green-900">Home</Link>
            <Link href="#about" className="hidden md:block text-sm text-farm-green-700 hover:text-farm-green-900">About</Link>
            <Link href="#contact" className="hidden md:block text-sm text-farm-green-700 hover:text-farm-green-900">Contact</Link>
            <Button onClick={() => setLoginOpen(true)} className="ml-2 bg-farm-green-600 hover:bg-farm-green-700">
              Member Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/placeholder.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-28 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="bg-white/80 text-farm-green-900 border-white">Single Association</Badge>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow">
              Stronger Harvests. Smarter Operations. One Association.
            </h1>
            <p className="mt-4 text-white/90 text-base md:text-lg max-w-xl">
              A modern platform for our members to access assistance, pricing, weather advisories, and a growing knowledge base.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="bg-farm-green-600 hover:bg-farm-green-700" onClick={() => setLoginOpen(true)}>
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="#features">
                <Button variant="outline" className="bg-white/90">Explore Features</Button>
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-3 text-white">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-sm">Secure. Mobile-ready. Association-approved.</span>
            </div>
          </div>
          <div className="relative" />
        </div>
      </section>

      {/* Key Highlights (Compact) */}
      <section id="features" className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-3 md:grid-cols-3">
            {features.slice(0, 3).map((f) => (
              <Card key={f.title} className="hover:shadow-sm transition-shadow">
                <CardHeader className="py-3">
                  <div className="flex items-center gap-2">
                    <f.icon className="h-5 w-5 text-farm-green-700" />
                    <CardTitle className="text-sm">{f.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-xs text-farm-green-700">{f.desc}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-2 gap-6 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-farm-green-900">About Our Association</h2>
            <p className="mt-3 text-farm-green-700">
              We are a single, unified Sugar Farmers Association dedicated to empowering members with timely
              assistance, market visibility, agronomic guidance, and operational tools designed for the realities of
              sugarcane farming.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border p-3">
                <div className="font-medium text-farm-green-900">Mission</div>
                <div className="text-farm-green-700">Sustainably improve yield, income, and resilience.</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="font-medium text-farm-green-900">Vision</div>
                <div className="text-farm-green-700">A digitally enabled, climate-smart sugar community.</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-gradient-to-br from-farm-green-50 to-farm-earth-50 p-4">
            <h3 className="text-lg font-semibold text-farm-green-900 mb-2">What We Offer</h3>
            <ul className="list-disc pl-5 space-y-2 text-farm-green-800 text-sm">
              <li>Member programs and fertilizer assistance</li>
              <li>Transparent pricing updates and advisories</li>
              <li>Weather and pest alerts to guide field work</li>
              <li>Knowledge base of practices and varieties</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-farm-green-900">Services</h2>
            <p className="mt-2 text-farm-green-700">Member-focused services tailored for sugarcane operations</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {["Member Registration", "Assistance Programs", "Logistics Coordination"].map((s) => (
              <Card key={s} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-farm-green-900">{s}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-farm-green-700">
                  Streamlined processes with transparent tracking and timely notifications.
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pests & Solutions (Compact) */}
      <section id="pests" className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-farm-green-900">Pest Alerts & Solutions</h2>
            <Link href="/news/pests" className="text-xs text-farm-green-700 underline">See all</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { title: "Sugarcane Borer", symptom: "Dead-hearts in young canes", action: "Scout, pheromone traps, remove affected" },
              { title: "Aphids & Sooty Mold", symptom: "Honeydew, black coating", action: "Encourage predators, soap sprays" },
              { title: "Leafhopper", symptom: "Yellowing, stunted growth", action: "Reflective mulches, weed control" },
            ].map((n) => (
              <Card key={n.title} className="hover:shadow-sm transition-shadow">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm text-farm-green-900">{n.title}</CardTitle>
                  <CardDescription className="text-xs">{n.symptom}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-farm-green-800">
                  <span className="font-medium">Action:</span> {n.action}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

      {/* Local Weather (Compact) */}
      <section id="weather" className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-farm-green-900">Local Weather</h2>
            <Link href="/news/weather" className="text-xs text-farm-green-700 underline">More weather</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><Sun className="h-5 w-5 text-yellow-500" /> Today</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs text-farm-green-800">
                <div className="flex items-center gap-2"><Cloud className="h-4 w-4" /> Partly Cloudy • 31°C</div>
                <div className="flex items-center gap-2"><CloudRain className="h-4 w-4" /> Rain chance 20%</div>
                <div className="flex items-center gap-2"><Droplets className="h-4 w-4" /> Humidity 68%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><AlertTriangle className="h-5 w-5 text-orange-600" /> Advisory</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-farm-green-800">
                Brief afternoon showers expected. Avoid heavy machinery in wet patches.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="flex items-center gap-2 text-sm"><Leaf className="h-5 w-5 text-green-600" /> Field Note</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-farm-green-800">
                Early signs of leafhopper activity. Scout perimeters and deploy traps if counts increase.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Varieties (Compact) */}
      <section id="varieties" className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-farm-green-900">Sugarcane Varieties</h2>
            <Link href="/news/varieties" className="text-xs text-farm-green-700 underline">Browse all</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { name: "Phil 99-1793", link: "#", desc: "High-yielding, good ratoonability" },
              { name: "Phil 00-2561", link: "#", desc: "Early maturing, lowland-suited" },
              { name: "Phil 2000-2153", link: "#", desc: "Drought-tolerant, stable" },
            ].map((v) => (
              <Card key={v.name} className="hover:shadow-sm transition-shadow">
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center gap-2 text-sm text-farm-green-900"><BookOpen className="h-5 w-5" /> {v.name}</CardTitle>
                  <CardDescription className="text-xs">{v.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={v.link} className="text-xs text-farm-green-700 underline">Learn more</Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="programs" className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-farm-green-900">Join the association platform</h3>
          <p className="mt-2 text-farm-green-700">Access programs, pricing, and operations in one place.</p>
          <div className="mt-6">
            <Button className="bg-farm-green-600 hover:bg-farm-green-700" onClick={() => setLoginOpen(true)}>
              Member Login
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-farm-green-700 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Wheat className="h-4 w-4 text-farm-green-600" />
            <span>© {new Date().getFullYear()} Phil Agro • Sugar Farmers Association</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-farm-green-900">Home</Link>
            <Link href="#about" className="hover:text-farm-green-900">About</Link>
            <Link href="#services" className="hover:text-farm-green-900">Services</Link>
            <Link href="#contact" className="hover:text-farm-green-900">Contact</Link>
            <Link href="#features" className="hover:text-farm-green-900">Features</Link>
            <Link href="#pests" className="hover:text-farm-green-900">Pest News</Link>
            <Link href="#prices" className="hover:text-farm-green-900">Prices</Link>
            <Link href="#weather" className="hover:text-farm-green-900">Weather</Link>
            <Link href="#varieties" className="hover:text-farm-green-900">Varieties</Link>
          </div>
        </div>
      </footer>

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

      {/* Login Dialog */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-farm-green-900">
              <Shield className="h-5 w-5 text-farm-green-700" /> Member Login
            </DialogTitle>
            <DialogDescription>Sign in to access your dashboard and tools</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-farm-green-600 hover:bg-farm-green-700" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
