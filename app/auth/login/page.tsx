"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  Mail, 
  Building, 
  Users, 
  Truck, 
  Tractor, 
  MapPin, 
  BarChart3, 
  DollarSign, 
  FileText, 
  Settings,
  CheckCircle,
  ArrowRight,
  Shield,
  TrendingUp,
  Calendar,
  MessageSquare
} from "lucide-react"

interface UserRole {
  id: string
  name: string
  description: string
  permissions: string[]
  icon: React.ReactNode
  color: string
}

const userRoles: UserRole[] = [
  {
    id: "admin",
    name: "System Administrator",
    description: "Full system access with user management and configuration",
    permissions: ["All Permissions", "User Management", "System Configuration", "Reports & Analytics"],
    icon: <Shield className="h-6 w-6" />,
    color: "bg-red-500"
  },
  {
    id: "manager",
    name: "Farm Manager",
    description: "Complete farm operations management and oversight",
    permissions: ["Farm Management", "Equipment Operations", "Production Reports", "Financial Management"],
    icon: <Building className="h-6 w-6" />,
    color: "bg-blue-500"
  },
  {
    id: "operator",
    name: "Equipment Operator",
    description: "Equipment operation and field work tracking",
    permissions: ["Equipment Operation", "Field Work Tracking", "Maintenance Reports", "Time Tracking"],
    icon: <Tractor className="h-6 w-6" />,
    color: "bg-green-500"
  },
  {
    id: "planner",
    name: "Production Planner",
    description: "Production planning and scheduling management",
    permissions: ["Production Planning", "Scheduling", "Resource Allocation", "Progress Monitoring"],
    icon: <Calendar className="h-6 w-6" />,
    color: "bg-purple-500"
  },
  {
    id: "analyst",
    name: "Data Analyst",
    description: "Data analysis and reporting capabilities",
    permissions: ["Data Analysis", "Report Generation", "Performance Metrics", "Trend Analysis"],
    icon: <BarChart3 className="h-6 w-6" />,
    color: "bg-orange-500"
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to basic information",
    permissions: ["View Reports", "Basic Information", "Price Lists", "News Updates"],
    icon: <Eye className="h-6 w-6" />,
    color: "bg-gray-500"
  }
]

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ""
  })

  // Update form data when role is selected
  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    setFormData(prev => ({ ...prev, role }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password || !formData.role) {
      alert("Please fill in all fields and select a role")
      return
    }

    setIsLoading(true)
    
    try {
      await login(formData.email, formData.password, formData.role)
      router.push("/")
    } catch (error) {
      console.error("Login failed:", error)
      alert("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side - Application Overview */}
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">PhilAgro Dashboard</h1>
                <p className="text-gray-600">Agricultural Technology Management System</p>
              </div>
            </div>
          </div>

          {/* Application Description */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                <Building className="h-6 w-6 text-green-600" />
                Comprehensive Farm Management Platform
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Streamline your agricultural operations with our integrated management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Registration Management</h3>
                    <p className="text-sm text-gray-600">Planters, haulers, and farm registration with GPS tracking</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Equipment Management</h3>
                    <p className="text-sm text-gray-600">Truck and tractor fleet with real-time tracking</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Farm Management</h3>
                    <p className="text-sm text-gray-600">GPS-based farm area mapping and monitoring</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Production Reports</h3>
                    <p className="text-sm text-gray-600">Comprehensive analytics and performance tracking</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sugar Prices</h3>
                    <p className="text-sm text-gray-600">Real-time price monitoring and market analysis</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Communication</h3>
                    <p className="text-sm text-gray-600">Integrated messaging and notification system</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role-Based Access */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Shield className="h-5 w-5 text-green-600" />
                Role-Based Access Management
              </CardTitle>
              <CardDescription>
                Choose your role to access specific functionalities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedRole} onValueChange={handleRoleSelect} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 gap-2">
                  {userRoles.map((role) => (
                    <TabsTrigger 
                      key={role.id} 
                      value={role.id}
                      className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-xs"
                    >
                      {role.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {selectedRole && (
                  <TabsContent value={selectedRole} className="mt-4">
                    {userRoles.find(role => role.id === selectedRole) && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${userRoles.find(role => role.id === selectedRole)?.color} rounded-lg flex items-center justify-center`}>
                            {userRoles.find(role => role.id === selectedRole)?.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {userRoles.find(role => role.id === selectedRole)?.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {userRoles.find(role => role.id === selectedRole)?.description}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Permissions:</h4>
                          <div className="flex flex-wrap gap-2">
                            {userRoles.find(role => role.id === selectedRole)?.permissions.map((permission, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Select Role
                  </Label>
                                      <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => {
                        setFormData({ ...formData, role: e.target.value })
                        setSelectedRole(e.target.value)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choose your role</option>
                      {userRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Demo Credentials: Use any email and password with your selected role
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 