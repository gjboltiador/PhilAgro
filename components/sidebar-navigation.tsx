"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import {
  BarChart3,
  ChevronRight,
  Menu,
  Settings,
  TrendingUp,
  Users,
  Wheat,
  X,
  Bell,
  User,
  Package,
  HelpCircle,
  ClipboardList,
  Tractor,
  Sprout,
  Search,
  Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Debug logging
  console.log('Sidebar state:', sidebarOpen)

  // Function to get active route display
  const getActiveRouteDisplay = () => {
    if (pathname === '/') return 'Overview'
    if (pathname.startsWith('/registration/planters')) return 'Registration • Planters'
    if (pathname.startsWith('/registration/farms')) return 'Registration • Farms'
    if (pathname.startsWith('/registration/haulers')) return 'Registration • Haulers'
    if (pathname.startsWith('/equipment/trucks')) return 'Equipment • Trucks'
    if (pathname.startsWith('/equipment/tractors')) return 'Equipment • Tractors'
    if (pathname.startsWith('/equipment/calendar')) return 'Equipment • Calendar'
    if (pathname.startsWith('/reports/planters')) return 'Reports • Planters Production'
    if (pathname.startsWith('/prices')) return 'Sugar Prices'
    if (pathname.startsWith('/assistance/fertilizer')) return 'Farm Assistance • Fertilizer'
    if (pathname.startsWith('/settings')) return 'Settings'
    return 'Dashboard'
  }

  // Search data
  const searchItems = [
    { title: "Planters", href: "/registration/planters", category: "Registration" },
    { title: "Haulers", href: "/registration/haulers", category: "Registration" },
    { title: "Trucks", href: "/equipment/trucks", category: "Equipment" },
    { title: "Tractors", href: "/equipment/tractors", category: "Equipment" },
    { title: "Other Equipment", href: "/equipment/other", category: "Equipment" },
    { title: "Planters Production", href: "/reports/planters", category: "Reports" },
    { title: "Haulers", href: "/reports/haulers", category: "Reports" },
    { title: "Fertilizer", href: "/assistance/fertilizer", category: "Farm Assistance" },
    { title: "Other Assistance", href: "/assistance/other", category: "Farm Assistance" },
    { title: "Sugar Prices", href: "/prices", category: "Sugar Prices" },
  ]

  const filteredItems = searchItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Click outside handler for search results
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const routes = [
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/",
      active: true,
    },
    {
      title: "Management",
      icon: Users,
      submenu: [
        {
          title: "Planters",
          href: "/registration/planters",
          active: false,
        },
        {
          title: "Farms",
          href: "/registration/farms",
          active: false,
        },
        {
          title: "Haulers",
          href: "/registration/haulers",
          active: false,
        },
      ],
    },
    {
      title: "Equipment Rentals",
      icon: Tractor,
      submenu: [
        {
          title: "Trucks",
          href: "/equipment/trucks",
          active: false,
        },
        {
          title: "Tractors",
          href: "/equipment/tractors",
          active: false,
        },
        {
          title: "Other Equipment",
          href: "/equipment/other",
          active: false,
        },
        {
          title: "Calendar",
          href: "/equipment/calendar",
          active: false,
        },
      ],
    },
    {
      title: "Reports",
      icon: ClipboardList,
      submenu: [
        {
          title: "Planters Production",
          href: "/reports/planters",
          active: false,
        },
        {
          title: "Haulers",
          href: "/reports/haulers",
          active: false,
        },
      ],
    },
    {
      title: "Farm Assistance",
      icon: Sprout,
      submenu: [
        {
          title: "Fertilizer",
          href: "/assistance/fertilizer",
          active: false,
        },
        {
          title: "Other Assistance",
          href: "/assistance/other",
          active: false,
        },
      ],
    },
    {
      title: "Sugar Prices",
      icon: TrendingUp,
      href: "/prices",
      active: false,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      active: false,
    },
  ]

  return (
    <div className="dashboard-wrapper min-h-screen flex bg-gradient-to-br from-farm-green-50 via-background to-farm-earth-50">
      {/* Mobile Overlay - Lower z-index than sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Higher z-index than overlay */}
      {sidebarOpen && (
        <aside className="fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-farm-green-700 to-farm-green-800 border-r border-farm-green-600 z-50 flex flex-col shadow-2xl lg:hidden">
          {/* SIDEBAR HEADER - Logo and Branding */}
          <header className="flex-shrink-0 h-16 flex items-center justify-between px-4 lg:px-6 border-b border-farm-green-600 bg-farm-green-800 shadow-sm">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-farm-green-500 to-farm-green-600 shadow-lg">
                <Wheat className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">Phil Agro</span>
                <span className="text-xs text-farm-green-100">Agriculture Management</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden hover:bg-farm-green-600 text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </header>

          {/* SCROLLABLE NAVIGATION - Menu Items */}
          <nav className="flex-1 overflow-y-auto px-4 pt-4 space-y-2 bg-gradient-to-b from-farm-green-700 to-farm-green-800">
            {routes.map((route) => (
              <div key={route.title}>
                {route.submenu ? (
                  <div className="space-y-1">
                    {/* Submenu Parent */}
                    <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-farm-green-100 rounded-lg">
                      <route.icon className="h-5 w-5" />
                      <span>{route.title}</span>
                    </div>
                    {/* Submenu Items */}
                    <div className="ml-6 space-y-1">
                      {route.submenu.map((submenu) => {
                        const isActive = pathname === submenu.href || pathname.startsWith(submenu.href + '/')
                        return (
                          <Link
                            key={submenu.title}
                            href={submenu.href}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ease-in-out relative",
                              "hover:bg-farm-green-600 hover:text-white hover:shadow-md hover:scale-[1.02] hover:border hover:border-farm-green-500",
                              "active:scale-[0.98] active:bg-farm-green-700",
                              isActive
                                ? "bg-farm-green-500 text-white font-medium shadow-md border border-white"
                                : "text-farm-green-100",
                            )}
                          >
                            <ChevronRight className={cn(
                              "h-4 w-4 transition-colors",
                              isActive ? "text-white" : "text-farm-green-300"
                            )} />
                            <span>{submenu.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  (() => {
                    const isActive = pathname === route.href || pathname.startsWith(route.href + '/')
                    return (
                      <Link
                        href={route.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ease-in-out relative",
                          "hover:bg-farm-green-600 hover:text-white hover:shadow-md hover:scale-[1.02] hover:border hover:border-farm-green-500",
                          "active:scale-[0.98] active:bg-farm-green-700",
                          isActive
                            ? "bg-farm-green-500 text-white font-medium shadow-md border border-white"
                            : "text-farm-green-100",
                        )}
                      >
                        <route.icon className={cn(
                          "h-5 w-5 transition-colors",
                          isActive ? "text-white" : "text-farm-green-300"
                        )} />
                        <span>{route.title}</span>
                      </Link>
                    )
                  })()
                )}
              </div>
            ))}
          </nav>
        </aside>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:relative lg:top-0 lg:left-0 lg:h-full lg:w-72 lg:flex-col lg:bg-gradient-to-b lg:from-farm-green-700 lg:to-farm-green-800 lg:border-r lg:border-farm-green-600 lg:shadow-none">
        {/* SIDEBAR HEADER - Logo and Branding */}
        <header className="flex-shrink-0 h-16 flex items-center justify-between px-4 lg:px-6 border-b border-farm-green-600 bg-farm-green-800 shadow-sm">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-farm-green-500 to-farm-green-600 shadow-lg">
              <Wheat className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">Phil Agro</span>
              <span className="text-xs text-farm-green-100">Agriculture Management</span>
            </div>
          </Link>
        </header>

        {/* SCROLLABLE NAVIGATION - Menu Items */}
        <nav className="flex-1 overflow-y-auto px-4 pt-4 space-y-2 bg-gradient-to-b from-farm-green-700 to-farm-green-800">
          {routes.map((route) => (
            <div key={route.title}>
              {route.submenu ? (
                <div className="space-y-1">
                  {/* Submenu Parent */}
                  <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-farm-green-100 rounded-lg">
                    <route.icon className="h-5 w-5" />
                    <span>{route.title}</span>
                  </div>
                  {/* Submenu Items */}
                  <div className="ml-6 space-y-1">
                    {route.submenu.map((submenu) => {
                      const isActive = pathname === submenu.href || pathname.startsWith(submenu.href + '/')
                      return (
                        <Link
                          key={submenu.title}
                          href={submenu.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ease-in-out relative",
                            "hover:bg-farm-green-600 hover:text-white hover:shadow-md hover:scale-[1.02] hover:border hover:border-farm-green-500",
                            "active:scale-[0.98] active:bg-farm-green-700",
                            isActive
                              ? "bg-farm-green-500 text-white font-medium shadow-md border border-white"
                              : "text-farm-green-100",
                          )}
                        >
                          <ChevronRight className={cn(
                            "h-4 w-4 transition-colors",
                            isActive ? "text-white" : "text-farm-green-300"
                          )} />
                          <span>{submenu.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ) : (
                (() => {
                  const isActive = pathname === route.href || pathname.startsWith(route.href + '/')
                  return (
                    <Link
                      href={route.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ease-in-out relative",
                        "hover:bg-farm-green-600 hover:text-white hover:shadow-md hover:scale-[1.02] hover:border hover:border-farm-green-500",
                        "active:scale-[0.98] active:bg-farm-green-700",
                        isActive
                          ? "bg-farm-green-500 text-white font-medium shadow-md border border-white"
                          : "text-farm-green-100",
                      )}
                    >
                      <route.icon className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-white" : "text-farm-green-300"
                      )} />
                      <span>{route.title}</span>
                    </Link>
                  )
                })()
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area - Lower z-index than sidebar */}
      <div className="dashboard-main-content flex flex-col flex-1 min-w-0 relative z-10">
        {/* Dashboard Header */}
        <header className="dashboard-header border-b border-farm-green-600 bg-farm-green-800 shadow-sm relative z-20">
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">
            {/* Left side - Mobile Menu Button and Title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden border-farm-green-500 hover:bg-farm-green-600 text-white"
                onClick={() => {
                  console.log('Hamburger clicked, current state:', sidebarOpen)
                  setSidebarOpen(!sidebarOpen)
                  console.log('New state will be:', !sidebarOpen)
                }}
              >
                <Menu className="h-5 w-5" />
              </Button>
              {/* Page Title - Moved from center to left */}
              <div className="flex items-center gap-2 text-sm text-white">
                <span className="text-xs sm:text-sm font-medium">Management Dashboard</span>
                <span className="hidden sm:inline text-farm-green-200">•</span>
                <span className="text-xs sm:text-sm text-farm-green-100">
                  {getActiveRouteDisplay()}
                </span>
              </div>
            </div>

            {/* Right side - Search and Actions */}
            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <div className="relative hidden md:block" ref={searchRef}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Search Planters, Haulers, Equipment..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowSearchResults(e.target.value.length > 0)
                    }}
                    onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                    className="w-64 h-9 px-4 text-sm border border-farm-green-500 rounded-lg bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-farm-green-300 focus:border-transparent text-farm-green-800 placeholder-farm-green-500"
                  />
                </div>
                
                {/* Search Results Dropdown */}
                {showSearchResults && filteredItems.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-farm-green-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {filteredItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={() => {
                          setSearchQuery("")
                          setShowSearchResults(false)
                        }}
                        className="flex items-center justify-between px-4 py-2 text-sm hover:bg-farm-green-50 border-b border-farm-green-100 last:border-b-0"
                      >
                        <div>
                          <div className="font-medium text-farm-green-800">{item.title}</div>
                          <div className="text-xs text-farm-green-500">{item.category}</div>
                        </div>
                        <ChevronRight className="h-3 w-3 text-farm-green-400" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Button variant="ghost" size="icon" className="relative hover:bg-farm-green-600 text-white">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-orange-500 text-white flex items-center justify-center font-medium">3</Badge>
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-farm-green-600 text-white">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="dashboard-main-content flex-1 bg-gradient-to-br from-farm-green-50/30 via-background to-farm-earth-50/30 overflow-y-auto">
          {children}
        </main>

        {/* Dashboard Footer */}
        <footer className="dashboard-footer border-t border-farm-green-200 bg-white/80 backdrop-blur-sm relative z-20">
          <div className="flex h-12 items-center justify-between px-4 lg:px-6 text-sm text-farm-green-600">
            <div className="flex items-center gap-2 lg:gap-4">
              <span className="text-xs lg:text-sm">© 2024 Phil Agro-Industrial Technologist Agriculture</span>
              <span className="hidden lg:inline">•</span>
              <span className="hidden lg:inline">Logged in as: Godfrey J. Boltiador</span>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <span className="hidden md:inline text-xs lg:text-sm">Version 1.0.0</span>
              <span className="hidden md:inline text-farm-green-400">•</span>
              <span className="text-xs lg:text-sm">All Rights Reserved</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
