"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  LogOut, 
  ChevronDown, 
  Edit3,
  HelpCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface UserProfile {
  name: string
  email: string
  role: string
  avatar?: string
  phone?: string
  location?: string
  joinDate: string
  lastLogin: string
}

export function ProfileManagement() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-farm-green-600 text-white relative"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 p-0 z-[9999] bg-white border border-gray-200 shadow-lg" align="end">
        {/* Profile Header */}
        <div className="p-4 bg-gradient-to-r from-farm-green-50 to-farm-green-100 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={undefined} alt={(user?.name || user?.email || "Guest") as string} />
              <AvatarFallback className="bg-farm-green-500 text-white font-medium">
                {(user?.name || user?.email || "G").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-farm-green-900 truncate">
                {user?.name || user?.email || "Guest"}
              </p>
              <p className="text-xs text-farm-green-600 truncate">
                {user?.email || "Not signed in"}
              </p>
              {isAuthenticated && (
                <Badge variant="secondary" className="mt-1 text-xs capitalize">
                  {user?.role}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-4 py-2 text-xs font-medium text-farm-green-600">
            Quick Actions
          </DropdownMenuLabel>
          
          <DropdownMenuItem className="px-4 py-2" asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="px-4 py-2">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="px-4 py-2">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
            <Badge className="ml-auto h-5 w-5 rounded-full p-0 text-xs bg-orange-500 text-white flex items-center justify-center">
              3
            </Badge>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Account Management */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-4 py-2 text-xs font-medium text-farm-green-600">
            Account
          </DropdownMenuLabel>
          
          <DropdownMenuItem className="px-4 py-2">
            <Edit3 className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="px-4 py-2">
            <Shield className="mr-2 h-4 w-4" />
            <span>Privacy & Security</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="px-4 py-2">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem 
          className="px-4 py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
