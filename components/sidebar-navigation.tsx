"use client"

import type React from "react"
import Link from "next/link"
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)

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
      title: "Registration",
      icon: Users,
      submenu: [
        {
          title: "Planters",
          href: "/registration/planters",
          active: false,
        },
        {
          title: "Farmers",
          href: "/registration/farmers",
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
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Dashboard Sidebar - Mobile First */}
      <aside
        className={cn(
          "dashboard-sidebar bg-gradient-to-b from-farm-green-50 to-farm-earth-50 border-r border-farm-green-200",
          "fixed lg:relative top-0 left-0 h-full w-80 lg:w-72 transform transition-transform duration-300 ease-in-out",
          "flex flex-col",
          "z-60 lg:z-auto shadow-2xl lg:shadow-none", // Higher z-index for mobile, normal for desktop
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        style={{ 
          zIndex: 60,
          backgroundColor: 'rgb(240 253 244)', // Ensure background is visible
        }}
      >
        {/* SIDEBAR HEADER - Logo and Branding */}
        <header className="flex-shrink-0 h-16 flex items-center justify-between px-4 lg:px-6 border-b border-farm-green-200 bg-white/80 backdrop-blur-sm shadow-sm">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-farm-green-500 to-farm-green-600 shadow-lg">
              <Wheat className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-farm-green-700">Phil Agro</span>
              <span className="text-xs text-farm-green-500">Agriculture Management</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden hover:bg-farm-green-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </header>

        {/* SCROLLABLE NAVIGATION - Menu Items */}
        <nav className="flex-1 overflow-y-auto px-4 pt-4 space-y-2 bg-gradient-to-b from-farm-green-50 to-farm-earth-50">
          {routes.map((route) => (
            <div key={route.title}>
              {route.submenu ? (
                <div className="space-y-1">
                  {/* Submenu Parent */}
                  <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-farm-green-700 rounded-lg">
                    <route.icon className="h-5 w-5" />
                    <span>{route.title}</span>
                  </div>
                  {/* Submenu Items */}
                  <div className="ml-6 space-y-1">
                    {route.submenu.map((submenu) => (
                      <Link
                        key={submenu.title}
                        href={submenu.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 pt-2 pb-1 text-sm rounded-lg transition-colors",
                          submenu.active
                            ? "bg-farm-green-200 font-medium text-farm-green-800 shadow-sm"
                            : "text-farm-green-600 hover:bg-farm-green-100 hover:text-farm-green-800",
                        )}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span>{submenu.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={route.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 pt-2 pb-1 text-sm rounded-lg transition-colors",
                    route.active
                      ? "bg-farm-green-200 font-medium text-farm-green-800 shadow-sm"
                      : "text-farm-green-600 hover:bg-farm-green-100 hover:text-farm-green-800",
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  <span>{route.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main-content flex flex-col flex-1 min-w-0">
        {/* Dashboard Header */}
        <header className="dashboard-header border-b border-farm-green-200 bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">
            {/* Left side - Mobile Menu Button and Title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden border-farm-green-300 hover:bg-farm-green-100"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              {/* Page Title - Moved from center to left */}
              <div className="flex items-center gap-2 text-sm text-farm-green-600">
                <span className="hidden sm:inline font-medium">Phil Agro-Industrial Technologist Agriculture</span>
                <span className="hidden sm:inline text-farm-green-400">•</span>
                <span className="text-xs sm:text-sm">Management Dashboard</span>
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
                    className="w-64 h-9 px-4 text-sm border border-farm-green-200 rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-farm-green-500 focus:border-transparent"
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

              <Button variant="ghost" size="icon" className="relative hover:bg-farm-green-100">
                <Bell className="h-5 w-5 text-farm-green-600" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-farm-earth-500">3</Badge>
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-farm-green-100">
                <User className="h-5 w-5 text-farm-green-600" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="dashboard-main-content flex-1 bg-gradient-to-br from-farm-green-50/30 via-background to-farm-earth-50/30 overflow-y-auto">
          {children}
        </main>

        {/* Dashboard Footer */}
        <footer className="dashboard-footer border-t border-farm-green-200 bg-white/80 backdrop-blur-sm">
          <div className="flex h-12 items-center justify-between px-4 lg:px-6 text-sm text-farm-green-600">
            <div className="flex items-center gap-2 lg:gap-4">
              <span className="text-xs lg:text-sm">© 2024 Phil Agro-Industrial Technologist Agriculture</span>
              <span className="hidden lg:inline">•</span>
              <span className="hidden lg:inline">Sugar Planters Association Management System</span>
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
